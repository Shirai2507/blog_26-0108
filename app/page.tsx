import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  formatDate,
  getAllPostsWithBodyText,
  getCategoryCounts,
} from "../lib/posts";
import PageLayout from "./components/PageLayout";

type HomeProps = {
  searchParams?: Promise<{
    page?: string | string[];
    category?: string | string[];
    q?: string | string[];
  }>;
};

function getParamValue(value?: string | string[]): string | undefined {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

function getPageNumber(value?: string): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isNaN(parsed) ? 1 : parsed;
}

export default async function Home({ searchParams }: HomeProps) {
  const posts = getAllPostsWithBodyText();
  const categories = getCategoryCounts();
  const resolvedParams = (await searchParams) ?? {};
  const categoryParam = getParamValue(resolvedParams.category);
  const searchQuery = getParamValue(resolvedParams.q)?.trim();
  const normalizedQuery = searchQuery?.toLowerCase();

  const filteredByCategory = categoryParam
    ? posts.filter(
        (post) =>
          post.meta.category.toLowerCase() === categoryParam.toLowerCase()
      )
    : posts;

  const filteredPosts = normalizedQuery
    ? filteredByCategory.filter((post) => {
        const haystack = `${post.meta.title} ${post.meta.description} ${
          post.bodyText
        }`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : filteredByCategory;

  const postsPerPage = 6;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / postsPerPage)
  );
  const requestedPage = getPageNumber(getParamValue(resolvedParams.page));
  const clampedPage = Math.min(Math.max(requestedPage, 1), totalPages);

  if (requestedPage !== clampedPage) {
    const params = new URLSearchParams();
    if (categoryParam) {
      params.set("category", categoryParam);
    }
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    params.set("page", String(clampedPage));
    redirect(`/?${params.toString()}`);
  }

  const startIndex = (clampedPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (categoryParam) {
      params.set("category", categoryParam);
    }
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    params.set("page", String(page));
    return `/?${params.toString()}`;
  };

  const clearCategoryHref = (() => {
    if (!searchQuery) {
      return "/";
    }
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    return `/?${params.toString()}`;
  })();

  return (
    <PageLayout
      categories={categories}
      activeCategory={categoryParam}
      clearCategoryHref={clearCategoryHref}
      searchQuery={searchQuery}
    >
      <div className="space-y-10">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            2026 Modern Tech Blog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Editorial notes on practical engineering.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Focused write-ups on building product interfaces with clear
            architecture, sensible typography, and stable performance.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Latest posts
            </h2>
          </div>

          <div className="space-y-5">
            {paginatedPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-sm text-slate-500">
                <p className="text-sm font-semibold text-slate-700">
                  No results found.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Try a different keyword or clear the active filters.
                </p>
              </div>
            ) : (
              paginatedPosts.map((post) => (
                <article
                  key={post.meta.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{formatDate(post.meta.date)}</span>
                    <span className="rounded-full border border-slate-200 px-2 py-0.5">
                      {post.meta.category}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">
                    <Link
                      href={`/posts/${post.meta.slug}`}
                      className="transition hover:text-slate-700"
                    >
                      {post.meta.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {post.meta.description}
                  </p>
                  <Link
                    href={`/posts/${post.meta.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-slate-900"
                  >
                    Read more ?
                  </Link>
                </article>
              ))
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-slate-600">
            {clampedPage > 1 ? (
              <Link
                href={buildPageHref(clampedPage - 1)}
                className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:bg-slate-50"
              >
                Prev
              </Link>
            ) : null}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Link
                  key={page}
                  href={buildPageHref(page)}
                  className={`rounded-full px-3 py-1 transition ${
                    page === clampedPage
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </Link>
              )
            )}
            {clampedPage < totalPages ? (
              <Link
                href={buildPageHref(clampedPage + 1)}
                className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:bg-slate-50"
              >
                Next
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: "トップ",
  description: "最新の記事と検索・カテゴリの一覧を表示します。",
};
