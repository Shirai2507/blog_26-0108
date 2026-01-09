import SidebarToc from "./SidebarToc";
import type { TocItem } from "../../lib/markdown";

const categories = ["Next.js", "PHP", "UI/UX", "Performance"];

type SidebarProps = {
  tocItems?: TocItem[];
};

export default function Sidebar({ tocItems }: SidebarProps) {
  return (
    <aside className="flex h-full flex-col gap-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          管理人
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            KN
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Nishimura
            </p>
            <p className="text-xs text-slate-500">
              PHP / Next.js / UI
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          現場で役立つ設計と実装を、読みやすさ重視でまとめています。
        </p>
      </section>

      <SidebarToc items={tocItems ?? []} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          カテゴリ
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="sticky top-24 mt-auto rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-200">
          Ad / Sponsored
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-100">
          広告枠（差し替え予定）。Auto ads + 任意の枠を想定。
        </p>
      </section>
    </aside>
  );
}
