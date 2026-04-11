import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/json-ld';
import PricingCards from '@/components/marketing/pricing-cards';

export const metadata: Metadata = {
  title: 'Pricing — AI Audio Mastering Plans',
  description:
    'Free, Standard, Pro, API, and White Label plans for AI-powered audio mastering. Start free with BS.1770-4 analysis and multi-LLM deliberation.',
  alternates: { canonical: '/pricing' },
};

const comparisonRows = [
  { feature: 'WAV mastering', free: '3/mo', standard: '30/mo', pro: 'Unlimited', api: 'Unlimited', whitelabel: 'Unlimited' },
  { feature: 'BS.1770-4 analysis', free: 'Full + time-series', standard: 'Full + time-series', pro: 'Full + time-series', api: 'Full + time-series', whitelabel: 'Full + time-series' },
  { feature: 'LLM deliberation', free: '3 models', standard: '3 models', pro: '3 + full logs', api: '3 + custom', whitelabel: 'Custom' },
  { feature: 'Section-based processing', free: 'Yes', standard: 'Yes', pro: 'Yes', api: 'Yes', whitelabel: 'Yes' },
  { feature: 'DSP parameter override', free: '-', standard: '-', pro: 'Yes', api: 'Yes', whitelabel: 'Custom chain' },
  { feature: 'Batch processing', free: '-', standard: '-', pro: 'Up to 10', api: 'Unlimited', whitelabel: 'Unlimited' },
  { feature: 'API access', free: '-', standard: '-', pro: '-', api: '1,000 calls/mo', whitelabel: 'Unlimited' },
  { feature: 'White label', free: '-', standard: '-', pro: '-', api: '-', whitelabel: 'Your brand' },
  { feature: 'Dedicated infra', free: '-', standard: '-', pro: '-', api: '-', whitelabel: 'Yes' },
  { feature: 'Analysis history', free: '7 days', standard: '90 days', pro: 'Unlimited', api: 'Unlimited', whitelabel: 'Unlimited' },
  { feature: 'Support', free: 'Community', standard: 'Email', pro: 'Priority', api: 'Dedicated + SLA', whitelabel: '24/7 + 99.9% SLA' },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'WhitePrint AudioEngine',
          description: 'AI-powered audio mastering service',
          offers: [
            { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'Standard', price: '54', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'Pro', price: '1092', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'API', price: '2196', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'White Label', price: '5506', priceCurrency: 'USD' },
          ],
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Start free. Upgrade when you need more. 14-day free trial on all paid plans.
          </p>
        </div>

        {/* Plan Cards with Toggle */}
        <PricingCards />

        {/* Differentiator */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">WhitePrint vs the competition</h2>
            <p className="mt-3 text-zinc-400 text-sm">
              Features only WhitePrint provides at any price
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Full deliberation transparency',
                desc: 'See what each of 3 AI models recommended and why. Every parameter, every rationale — not a black box.',
                others: 'Others: result only, no reasoning',
              },
              {
                title: 'BS.1770-4 certified measurement',
                desc: 'ITU broadcast-standard LUFS, true peak, and LRA. The same standard streaming platforms use.',
                others: 'Others: no standards compliance stated',
              },
              {
                title: 'REST API',
                desc: 'Everything in the web UI is available via API. Integrate into DAW plugins, distribution pipelines, CI/CD.',
                others: 'Others: no public API',
              },
              {
                title: 'Cloud URL input — no upload needed',
                desc: 'Paste a Google Drive, Dropbox, OneDrive, S3, or GCS link. We fetch and process directly.',
                others: 'Others: file upload required',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-950"
              >
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 mb-3">{item.desc}</p>
                <p className="text-xs text-zinc-600 italic">{item.others}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-24 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Plan comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">Feature</th>
                  <th className="text-center py-3 px-3 text-zinc-400 font-medium">Free</th>
                  <th className="text-center py-3 px-3 text-zinc-400 font-medium">Standard</th>
                  <th className="text-center py-3 px-3 text-zinc-400 font-medium">
                    <span className="text-indigo-400">Pro</span>
                  </th>
                  <th className="text-center py-3 px-3 text-zinc-400 font-medium">API</th>
                  <th className="text-center py-3 px-3 text-zinc-400 font-medium">White Label</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-zinc-800/50">
                    <td className="py-3 px-4 text-zinc-300">{row.feature}</td>
                    <td className="py-3 px-3 text-center text-zinc-500">{row.free}</td>
                    <td className="py-3 px-3 text-center text-zinc-400">{row.standard}</td>
                    <td className="py-3 px-3 text-center text-zinc-300">{row.pro}</td>
                    <td className="py-3 px-3 text-center text-zinc-300">{row.api}</td>
                    <td className="py-3 px-3 text-center text-zinc-300">{row.whitelabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Do I need a credit card for the free trial?',
                a: 'No. The Free plan requires no card. Paid plan 14-day trials are also card-free.',
              },
              {
                q: 'Can I change plans or cancel anytime?',
                a: 'Yes. Upgrade or downgrade anytime. Annual plans are prorated for the remaining period.',
              },
              {
                q: 'How is WhitePrint different from LANDR or eMastered?',
                a: 'WhitePrint is fully transparent. You see what 3 AI models each recommended and why. We provide BS.1770-4 certified measurements and a public REST API — features no competitor offers.',
              },
              {
                q: 'What happens if I exceed 1,000 API calls on the API plan?',
                a: 'Overage is billed at $0.07 per call. For high-volume usage, contact us for a custom plan.',
              },
            ].map((item) => (
              <div key={item.q} className="p-6 rounded-xl border border-zinc-800 bg-zinc-950">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center text-sm text-zinc-500">
          All plans include BS.1770-4 analysis and multi-LLM deliberation.
          <br />
          Need a custom plan?{' '}
          <Link href="/contact" className="text-indigo-400 hover:text-indigo-300">
            Contact us
          </Link>
        </div>
      </div>
    </>
  );
}
