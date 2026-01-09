import PageLayout from "../components/PageLayout";

export default function AdminPage() {
  return (
    <PageLayout>
      <article className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Admin
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          管理人プロフィール
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          PHPを中心にWebアプリケーションを設計・実装しています。
          Next.jsとUI設計も並行して研究中です。
        </p>
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>主言語</span>
            <span className="font-semibold text-slate-900">PHP</span>
          </div>
          <div className="flex items-center justify-between">
            <span>得意領域</span>
            <span className="font-semibold text-slate-900">
              Backend / UI / Performance
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>最近の関心</span>
            <span className="font-semibold text-slate-900">
              App Router, Design Systems
            </span>
          </div>
        </div>
      </article>
    </PageLayout>
  );
}
