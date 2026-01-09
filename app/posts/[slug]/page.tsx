import { notFound } from "next/navigation";
import PageLayout from "../../components/PageLayout";
import { extractToc, markdownToHtml } from "../../../lib/markdown";
import { formatDate, getAllPostSlugs, getPostBySlug } from "../../../lib/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const tocItems = extractToc(post.content);
  const html = await markdownToHtml(post.content);

  return (
    <PageLayout tocItems={tocItems}>
      <article className="space-y-8">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Article
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {post.meta.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>{formatDate(post.meta.date)}</span>
            <span className="rounded-full border border-slate-200 px-2 py-0.5">
              {post.meta.category}
            </span>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            {post.meta.description}
          </p>
        </header>

        <section
          className="post-content space-y-6 text-base leading-8 text-slate-700"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
          画像は `public/images` に配置し、Markdown内で
          `![alt](/images/xxx.png)` の形式で指定してください。
        </p>
      </article>
    </PageLayout>
  );
}
