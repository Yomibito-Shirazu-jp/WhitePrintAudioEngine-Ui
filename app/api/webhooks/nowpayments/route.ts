import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

// Plan → billing configuration
const PLAN_CONFIG: Record<string, { tracksLimit: number; monthlyAmountCents: number; isAnnual: boolean }> = {
  standard:           { tracksLimit: 30,       monthlyAmountCents: 6700,    isAnnual: false },
  'standard-annual':  { tracksLimit: 30,       monthlyAmountCents: 5400,    isAnnual: true },
  pro:                { tracksLimit: 999999,   monthlyAmountCents: 136500,  isAnnual: false },
  'pro-annual':       { tracksLimit: 999999,   monthlyAmountCents: 109200,  isAnnual: true },
  api:                { tracksLimit: 999999,   monthlyAmountCents: 274500,  isAnnual: false },
  'api-annual':       { tracksLimit: 999999,   monthlyAmountCents: 219600,  isAnnual: true },
  whitelabel:         { tracksLimit: 999999,   monthlyAmountCents: 688300,  isAnnual: false },
  'whitelabel-annual':{ tracksLimit: 999999,   monthlyAmountCents: 550600,  isAnnual: true },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify IPN signature (mandatory)
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!ipnSecret) {
      console.error('NOWPayments IPN: NOWPAYMENTS_IPN_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    const signature = request.headers.get('x-nowpayments-sig');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const sortedBody = JSON.stringify(sortObject(body));
    const expectedSig = crypto
      .createHmac('sha512', ipnSecret)
      .update(sortedBody)
      .digest('hex');

    if (signature !== expectedSig) {
      console.error('NOWPayments IPN: Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const {
      payment_id,
      payment_status,
      order_id,
      price_amount,
      actually_paid,
      pay_currency,
    } = body;

    console.log(
      `NOWPayments IPN: payment_id=${payment_id} status=${payment_status} order=${order_id} paid=${actually_paid} ${pay_currency}`,
    );

    const supabase = createAdminClient();

    // Parse order_id: {userId}_{planName}_{timestamp}
    const parts = (order_id as string).split('_');
    const userId = parts[0] !== 'guest' ? parts[0] : null;
    // Plan name may contain hyphens (e.g., "standard-annual"), so rejoin middle parts
    const plan = parts.slice(1, -1).join('_');

    // Log every payment event
    await supabase.from('payment_events').insert({
      user_id: userId,
      provider: 'nowpayments',
      payment_id: String(payment_id),
      order_id: String(order_id),
      payment_status: String(payment_status),
      price_amount: price_amount ? Number(price_amount) : null,
      price_currency: 'usd',
      actually_paid: actually_paid ? Number(actually_paid) : null,
      pay_currency: pay_currency || null,
      plan: plan || null,
      raw_payload: body,
    });

    // Handle payment status
    if (payment_status === 'finished' || payment_status === 'confirmed') {
      if (userId && plan) {
        const config = PLAN_CONFIG[plan];
        const periodMonths = config?.isAnnual ? 12 : 1;
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + periodMonths);

        // Upsert billing record
        const { error: billingError } = await supabase
          .from('billing')
          .upsert(
            {
              user_id: userId,
              plan,
              payment_provider: 'nowpayments',
              nowpayments_payment_id: String(payment_id),
              nowpayments_order_id: String(order_id),
              period_start: new Date().toISOString(),
              period_end: periodEnd.toISOString(),
              tracks_used: 0,
              tracks_limit: config?.tracksLimit ?? 30,
              monthly_amount_cents: config?.monthlyAmountCents ?? 0,
              currency: 'usd',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          );

        if (billingError) {
          console.error('NOWPayments IPN: Failed to update billing:', billingError);
        } else {
          console.log(`Billing updated for user ${userId}: plan=${plan}, period_end=${periodEnd.toISOString()}`);
        }
      } else {
        console.warn(`NOWPayments IPN: Payment confirmed but cannot identify user. order_id=${order_id}`);
      }
    } else if (payment_status === 'failed' || payment_status === 'expired') {
      console.log(`Payment failed/expired for order ${order_id}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('NOWPayments IPN error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Sort object keys alphabetically (required for NOWPayments signature verification)
function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce(
      (result, key) => {
        result[key] =
          obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])
            ? sortObject(obj[key] as Record<string, unknown>)
            : obj[key];
        return result;
      },
      {} as Record<string, unknown>,
    );
}
