import PageLayout from "../components/PageLayout";

export default function AboutPage() {
  return (
    <PageLayout>
      <article className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          About
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          このブログについて
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          2026年の日本向けモダンデザインを前提に、読みやすい技術ブログの
          体験を整理しています。記事の作り方や運用の流れは今後追加予定です。
        </p>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">
          Markdownベースの構成、App Routerでの高速な配信、そして
          「読むリズム」を意識したタイポグラフィを大切にします。
        </div>
      </article>
    </PageLayout>
  );
}
