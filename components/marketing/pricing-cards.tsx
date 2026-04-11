'use client';

import { useState } from 'react';
import Link from 'next/link';
import CheckoutButton from './checkout-button';

const plans = [
  {
    name: 'Free',
    monthlyPrice: '$0',
    annualPrice: null,
    period: '',
    annualNote: null,
    description: 'Experience the full AI mastering pipeline.',
    features: [
      '3 WAV masters per month',
      'BS.1770-4 full analysis + time-series',
      'Multi-LLM deliberation (3 models)',
      'Section-based mastering',
      'A/B comparison player',
      'Metrics dashboard',
    ],
    cta: 'Start Free',
    href: '/app',
    checkoutKey: null,
    checkoutKeyAnnual: null,
    highlighted: false,
    badge: null,
  },
  {
    name: 'Standard',
    monthlyPrice: '$67',
    annualPrice: '$54',
    period: '/mo',
    annualNote: '$648/yr billed annually (save $156)',
    description: 'For producers who master regularly.',
    features: [
      '30 WAV masters per month',
      'BS.1770-4 full analysis + time-series',
      'Multi-LLM deliberation (3 models)',
      'Section-based mastering',
      'Custom LUFS / True Peak targets',
      '90-day analysis history',
      'Email support',
    ],
    cta: 'Subscribe with USDT',
    href: '/signup?plan=standard',
    checkoutKey: 'standard',
    checkoutKeyAnnual: 'standard-annual',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Pro',
    monthlyPrice: '$1,365',
    annualPrice: '$1,092',
    period: '/mo',
    annualNote: '$13,104/yr billed annually (save $3,276)',
    description: 'For professional engineers and labels.',
    features: [
      'Unlimited WAV masters',
      'BS.1770-4 full analysis + time-series',
      'Multi-LLM deliberation (3 models + full logs)',
      'Section-based mastering',
      'Custom DSP parameter override',
      'Batch processing (up to 10 tracks)',
      'Priority queue',
      'Unlimited analysis history',
      'Priority support',
    ],
    cta: 'Subscribe with USDT',
    href: '/signup?plan=pro',
    checkoutKey: 'pro',
    checkoutKeyAnnual: 'pro-annual',
    highlighted: true,
    badge: 'Popular',
  },
  {
    name: 'API',
    monthlyPrice: '$2,745',
    annualPrice: '$2,196',
    period: '/mo',
    annualNote: '$26,352/yr billed annually (save $6,588)',
    description: 'Integrate mastering into your product.',
    features: [
      'Everything in Pro',
      'REST API access',
      'Webhook notifications',
      '1,000 API calls/month',
      'Unlimited batch processing',
      'Custom LLM model selection',
      'Dedicated support + SLA',
      'SSO / team management',
    ],
    cta: 'Subscribe with USDT',
    href: '/contact',
    checkoutKey: 'api',
    checkoutKeyAnnual: 'api-annual',
    highlighted: false,
    badge: 'B2B',
  },
  {
    name: 'White Label',
    monthlyPrice: '$6,883',
    annualPrice: '$5,506',
    period: '/mo',
    annualNote: '$66,072/yr billed annually (save $16,524)',
    description: 'Run mastering under your own brand.',
    features: [
      'Everything in API',
      'White-label (custom brand UI)',
      'Custom domain support',
      'Unlimited API calls',
      'Dedicated infrastructure',
      'Custom DSP chain configuration',
      'Custom LLM prompts',
      'Onboarding support',
      '24/7 dedicated support + 99.9% SLA',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    checkoutKey: null,
    checkoutKeyAnnual: null,
    highlighted: false,
    badge: 'Enterprise',
  },
];

export default function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative w-12 h-6 rounded-full bg-zinc-800 transition-colors"
          aria-label="Toggle annual billing"
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-indigo-500 transition-transform ${
              isAnnual ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className={`text-sm ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>
          Annual <span className="text-indigo-400 text-xs ml-1">Save 20%</span>
        </span>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const showPrice = isAnnual && plan.annualPrice ? plan.annualPrice : plan.monthlyPrice;
          const checkoutKey = isAnnual && plan.checkoutKeyAnnual ? plan.checkoutKeyAnnual : plan.checkoutKey;

          return (
            <div
              key={plan.name}
              className={`p-6 rounded-xl border ${
                plan.highlighted
                  ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20'
                  : 'border-zinc-800 bg-zinc-950'
              } flex flex-col relative`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-6 px-3 py-0.5 rounded-full text-xs font-bold ${
                    plan.highlighted
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-700 text-zinc-200'
                  }`}
                >
                  {plan.badge}
                </div>
              )}
              <h2 className="text-lg font-bold text-white">{plan.name}</h2>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{showPrice}</span>
                  {plan.period && <span className="text-sm text-zinc-500">{plan.period}</span>}
                </div>
                {isAnnual && plan.annualPrice && (
                  <>
                    <div className="mt-1 text-xs text-zinc-500 line-through">
                      {plan.monthlyPrice}/mo
                    </div>
                    <div className="mt-1 text-xs text-indigo-400">{plan.annualNote}</div>
                  </>
                )}
              </div>
              <p className="mt-3 text-sm text-zinc-400">{plan.description}</p>
              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                    <svg
                      className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {checkoutKey ? (
                <CheckoutButton
                  planKey={checkoutKey}
                  label={plan.cta}
                  highlighted={plan.highlighted}
                />
              ) : (
                <Link
                  href={plan.href}
                  className={`mt-6 block text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    plan.highlighted
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
