import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageLayout from "../../components/PageLayout";
import { extractToc, markdownToHtml } from "../../../lib/markdown";
import {
  formatDate,
  getAllPostSlugs,
  getAllPosts,
  getCategoryCounts,
  getPostBySlug,
} from "../../../lib/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {};
  }

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const tocItems = extractToc(post.content);
  const html = await markdownToHtml(post.content);
  const categories = getCategoryCounts();
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex(
    (item) => item.slug === post.meta.slug
  );
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost =
    currentIndex !== -1 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  return (
    <PageLayout tocItems={tocItems} categories={categories}>
      <article className="space-y-8">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            記事
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

        {(newerPost || olderPost) ? (
          <section className="grid gap-4 md:grid-cols-2">
            {olderPost ? (
              <Link
                href={`/posts/${olderPost.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  前の記事
                </p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900 transition group-hover:text-slate-700">
                  {olderPost.title}
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDate(olderPost.date)}
                </p>
              </Link>
            ) : null}
            {newerPost ? (
              <Link
                href={`/posts/${newerPost.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  次の記事
                </p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900 transition group-hover:text-slate-700">
                  {newerPost.title}
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDate(newerPost.date)}
                </p>
              </Link>
            ) : null}
          </section>
        ) : null}

        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
          画像は `public/images` に配置し、Markdownで
          `![alt](/images/xxx.png)` を指定してください。
        </p>
      </article>
    </PageLayout>
  );
}
