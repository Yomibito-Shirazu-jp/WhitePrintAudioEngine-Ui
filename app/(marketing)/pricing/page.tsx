import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Pricing — AI Audio Mastering Plans',
  description:
    'Free, Standard, Pro, and API plans for AI-powered audio mastering. Start free with BS.1770-4 analysis and multi-LLM deliberation.',
  alternates: { canonical: '/pricing' },
};

const plans = [
  {
    name: 'Free',
    monthlyPrice: '¥0',
    annualPrice: null,
    period: '',
    annualNote: null,
    description: 'AI マスタリングを体験。',
    features: [
      'WAV マスタリング 月3回',
      'BS.1770-4 全解析 + 時系列データ',
      'マルチ LLM 審議（3モデル）',
      'セクション別マスタリング',
      'A/B 比較プレーヤー',
      'メトリクスダッシュボード',
    ],
    cta: '無料で始める',
    href: '/signup',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Standard',
    monthlyPrice: '¥9,800',
    annualPrice: '¥7,840',
    period: '/月',
    annualNote: '年払い ¥94,080（¥23,520 お得）',
    description: 'レギュラーに制作するプロデューサー向け。',
    features: [
      'WAV マスタリング 月30回',
      'BS.1770-4 全解析 + 時系列データ',
      'マルチ LLM 審議（3モデル）',
      'セクション別マスタリング',
      'カスタム LUFS / True Peak ターゲット',
      '解析履歴 90日保持',
      'メールサポート',
    ],
    cta: '14日間無料トライアル',
    href: '/signup?plan=standard',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Pro',
    monthlyPrice: '¥198,000',
    annualPrice: '¥158,400',
    period: '/月',
    annualNote: '年払い ¥1,900,800（¥475,200 お得）',
    description: 'プロのエンジニア・レーベル向け。',
    features: [
      'WAV マスタリング無制限',
      'BS.1770-4 全解析 + 時系列データ',
      'マルチ LLM 審議（3モデル + 審議ログ全文）',
      'セクション別マスタリング',
      'カスタム DSP パラメータ上書き',
      'バッチ処理（最大10トラック）',
      '優先キュー処理',
      '解析履歴 無期限保持',
      'プライオリティサポート',
    ],
    cta: '14日間無料トライアル',
    href: '/signup?plan=pro',
    highlighted: true,
    badge: '人気',
  },
  {
    name: 'API',
    monthlyPrice: '¥398,000',
    annualPrice: '¥318,400',
    period: '/月',
    annualNote: '年払い ¥3,820,800（¥955,200 お得）',
    description: 'プロダクトやワークフローに統合。',
    features: [
      'Pro の全機能',
      'REST API アクセス',
      'Webhook 通知',
      '月 1,000 API コール',
      'バッチ処理（無制限）',
      'カスタム LLM モデル選択',
      '専用サポート + SLA',
      'SSO / チーム管理',
    ],
    cta: '営業に問い合わせ',
    href: '/contact',
    highlighted: false,
    badge: 'B2B',
  },
  {
    name: 'White Label',
    monthlyPrice: '¥998,000',
    annualPrice: '¥798,400',
    period: '/月',
    annualNote: '年払い ¥9,580,800（¥2,395,200 お得）',
    description: '自社ブランドでマスタリングサービスを提供。',
    features: [
      'API の全機能',
      'ホワイトラベル（自社ブランド UI）',
      'カスタムドメイン対応',
      'API コール無制限',
      '専用インフラ（独立環境）',
      'カスタム DSP チェーン構成',
      'カスタム LLM プロンプト',
      'オンボーディングサポート',
      '24/7 専用サポート + SLA 99.9%',
    ],
    cta: '営業に問い合わせ',
    href: '/contact',
    highlighted: false,
    badge: 'Enterprise',
  },
];

const comparisonRows = [
  { feature: 'WAV マスタリング', free: '月3回', standard: '月30回', pro: '無制限', api: '無制限', whitelabel: '無制限' },
  { feature: 'BS.1770-4 解析', free: '全指標 + 時系列', standard: '全指標 + 時系列', pro: '全指標 + 時系列', api: '全指標 + 時系列', whitelabel: '全指標 + 時系列' },
  { feature: 'LLM 審議モデル数', free: '3', standard: '3', pro: '3 + 全ログ', api: '3 + カスタム', whitelabel: 'カスタム' },
  { feature: 'セクション別処理', free: 'あり', standard: 'あり', pro: 'あり', api: 'あり', whitelabel: 'あり' },
  { feature: 'DSP パラメータ上書き', free: '-', standard: '-', pro: 'あり', api: 'あり', whitelabel: 'カスタムチェーン' },
  { feature: 'バッチ処理', free: '-', standard: '-', pro: '最大10', api: '無制限', whitelabel: '無制限' },
  { feature: 'API アクセス', free: '-', standard: '-', pro: '-', api: '月1,000コール', whitelabel: '無制限' },
  { feature: 'ホワイトラベル', free: '-', standard: '-', pro: '-', api: '-', whitelabel: '自社ブランド' },
  { feature: '専用インフラ', free: '-', standard: '-', pro: '-', api: '-', whitelabel: 'あり' },
  { feature: '解析履歴', free: '7日', standard: '90日', pro: '無期限', api: '無期限', whitelabel: '無期限' },
  { feature: 'サポート', free: 'コミュニティ', standard: 'メール', pro: 'プライオリティ', api: '専用 + SLA', whitelabel: '24/7 + SLA 99.9%' },
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
          offers: plans.map((plan) => ({
            '@type': 'Offer',
            name: plan.name,
            price: plan.annualPrice
              ? plan.annualPrice.replace('¥', '').replace(',', '')
              : '0',
            priceCurrency: 'JPY',
            description: plan.description,
          })),
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white">
            シンプルで透明な料金体系
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            無料で始めて、必要に応じてアップグレード。全プラン14日間無料トライアル付き。
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
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
                {plan.annualPrice ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-white">{plan.annualPrice}</span>
                      <span className="text-sm text-zinc-500">{plan.period}</span>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500 line-through">
                      {plan.monthlyPrice}/月
                    </div>
                    <div className="mt-1 text-xs text-indigo-400">{plan.annualNote}</div>
                  </>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{plan.monthlyPrice}</span>
                  </div>
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
            </div>
          ))}
        </div>

        {/* LANDR Comparison */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">WhitePrint vs 他サービス</h2>
            <p className="mt-3 text-zinc-400 text-sm">
              同等価格帯で、WhitePrint だけが提供する機能
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: '審議プロセスの完全公開',
                desc: '3つの AI モデルがそれぞれ推奨するパラメータと根拠を全て閲覧可能。ブラックボックスではありません。',
                others: '他社: 結果のみ、理由は非公開',
              },
              {
                title: 'BS.1770-4 準拠の測定',
                desc: 'ITU 放送規格に完全準拠した LUFS/True Peak/LRA 測定。ストリーミングプラットフォームと同じ基準。',
                others: '他社: 規格準拠の明示なし',
              },
              {
                title: 'REST API',
                desc: 'Web UI で出来ることは全て API 経由で自動化可能。DAW プラグイン、配信パイプラインに統合。',
                others: '他社: API 非公開',
              },
              {
                title: 'URL 入力でファイルアップロード不要',
                desc: 'Google Drive, Dropbox, OneDrive, S3, GCS の URL を貼るだけ。クラウドから直接処理。',
                others: '他社: ファイルアップロード必須',
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
        <div className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">プラン比較表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">機能</th>
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
          <h2 className="text-2xl font-bold text-white text-center mb-8">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '無料トライアル中にクレジットカードは必要ですか？',
                a: 'いいえ。Free プランはカード登録不要です。有料プランの14日間トライアルもカード不要で始められます。',
              },
              {
                q: 'いつでもプラン変更やキャンセルはできますか？',
                a: 'はい。アップグレード・ダウングレードはいつでも可能です。年払いの場合、残り期間は日割りで精算されます。',
              },
              {
                q: 'LANDR や eMastered との違いは何ですか？',
                a: 'WhitePrint は審議プロセスを完全公開します。3つの AI モデルがそれぞれ推奨するパラメータと根拠を閲覧でき、BS.1770-4 準拠の測定結果も提供します。また、REST API を公開しており、自動化や統合が可能です。',
              },
              {
                q: 'API プランの月1,000コールを超えた場合は？',
                a: '超過分は 1コールあたり ¥10 で従量課金されます。大量利用の場合はカスタムプランをご相談ください。',
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
          全プランに BS.1770-4 解析とマルチ LLM 審議が含まれます。
          <br />
          カスタムプランが必要ですか？{' '}
          <Link href="/contact" className="text-indigo-400 hover:text-indigo-300">
            お問い合わせ
          </Link>
        </div>
      </div>
    </>
  );
}
