import CodeCopy from "./CodeCopy";
import Sidebar from "./Sidebar";
import type { TocItem } from "../../lib/markdown";

type PageLayoutProps = {
  children: React.ReactNode;
  tocItems?: TocItem[];
};

export default function PageLayout({ children, tocItems }: PageLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 lg:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">{children}</section>
        <Sidebar tocItems={tocItems} />
      </div>
      <CodeCopy />
    </main>
  );
}
