import CodeCopy from "./CodeCopy";
import Sidebar from "./Sidebar";
import type { TocItem } from "../../lib/markdown";
import type { CategoryCount } from "../../lib/posts";

type PageLayoutProps = {
  children: React.ReactNode;
  tocItems?: TocItem[];
  categories?: CategoryCount[];
  activeCategory?: string;
  clearCategoryHref?: string;
  searchQuery?: string;
};

export default function PageLayout({
  children,
  tocItems,
  categories,
  activeCategory,
  clearCategoryHref,
  searchQuery,
}: PageLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 lg:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">{children}</section>
        <Sidebar
          tocItems={tocItems}
          categories={categories}
          activeCategory={activeCategory}
          clearCategoryHref={clearCategoryHref}
          searchQuery={searchQuery}
        />
      </div>
      <CodeCopy />
    </main>
  );
}
