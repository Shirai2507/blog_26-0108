import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageLayout from "../components/PageLayout";
import { extractToc, markdownToHtml } from "../../lib/markdown";
import { getCategoryCounts } from "../../lib/posts";
import { getPageBySlug } from "../../lib/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug("about");
  return {
    title: page?.meta.title ?? "このブログについて",
    description:
      page?.meta.description ??
      "ブログの方針と扱うテーマをまとめています。",
  };
}

export default async function AboutPage() {
  const page = getPageBySlug("about");
  if (!page) {
    notFound();
  }

  const tocItems = extractToc(page.content);
  const html = await markdownToHtml(page.content);
  const categories = getCategoryCounts();

  return (
    <PageLayout tocItems={tocItems} categories={categories}>
      <article className="space-y-8">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            ページ
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {page.meta.title}
          </h1>
          {page.meta.description ? (
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              {page.meta.description}
            </p>
          ) : null}
        </header>

        <section
          className="post-content space-y-6 text-base leading-8 text-slate-700"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </PageLayout>
  );
}
