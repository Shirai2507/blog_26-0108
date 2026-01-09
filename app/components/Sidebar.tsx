import Link from "next/link";
import SidebarToc from "./SidebarToc";
import type { TocItem } from "../../lib/markdown";
import type { CategoryCount } from "../../lib/posts";

type SidebarProps = {
  tocItems?: TocItem[];
  categories?: CategoryCount[];
  activeCategory?: string;
  clearCategoryHref?: string;
  searchQuery?: string;
};

function buildCategoryHref(name: string, searchQuery?: string): string {
  const params = new URLSearchParams();
  params.set("category", name);
  if (searchQuery) {
    params.set("q", searchQuery);
  }
  return `/?${params.toString()}`;
}

export default function Sidebar({
  tocItems,
  categories = [],
  activeCategory,
  clearCategoryHref,
  searchQuery,
}: SidebarProps) {
  return (
    <aside className="flex h-full flex-col gap-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Search
        </p>
        <form action="/" method="get" className="mt-4 flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search posts"
            className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 focus:border-slate-400 focus:outline-none"
          />
          {activeCategory ? (
            <input type="hidden" name="category" value={activeCategory} />
          ) : null}
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
          >
            Go
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Author
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            KN
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Nishimura</p>
            <p className="text-xs text-slate-500">PHP / Next.js / UI</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Designing practical interfaces and writing focused notes on building
          with clarity.
        </p>
      </section>

      <SidebarToc items={tocItems ?? []} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Categories
          </p>
          {activeCategory ? (
            <Link
              href={clearCategoryHref ?? "/"}
              className="text-xs font-semibold text-slate-700 transition hover:text-slate-900"
            >
              Clear
            </Link>
          ) : null}
        </div>
        <div className="mt-4 space-y-2">
          {categories.length === 0 ? (
            <p className="text-xs text-slate-500">No categories.</p>
          ) : (
            categories.map((item) => {
              const isActive =
                activeCategory?.toLowerCase() === item.name.toLowerCase();
              return (
                <Link
                  key={item.name}
                  href={buildCategoryHref(item.name, searchQuery)}
                  className={`flex items-center justify-between rounded-full border px-3 py-1 text-xs transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span>{item.name}</span>
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.count}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section className="sticky top-24 mt-auto rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-200">
          Ad / Sponsored
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-100">
          Placeholder for sponsorship notes and promos.
        </p>
      </section>
    </aside>
  );
}
