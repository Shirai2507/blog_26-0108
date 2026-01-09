import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDate, getAllPosts, getCategoryCounts } from "../lib/posts";
import PageLayout from "./components/PageLayout";

type HomeProps = {
  searchParams?: Promise<{
    page?: string | string[];
    category?: string | string[];
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
  const posts = getAllPosts();
  const categories = getCategoryCounts();
  const resolvedParams = (await searchParams) ?? {};
  const categoryParam = getParamValue(resolvedParams.category);
  const filteredPosts = categoryParam
    ? posts.filter(
        (post) =>
          post.category.toLowerCase() === categoryParam.toLowerCase()
      )
    : posts;
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
    params.set("page", String(page));
    return `/?${params.toString()}`;
  };

  return (
    <PageLayout
      categories={categories}
      activeCategory={categoryParam}
      clearCategoryHref="/"
    >
      <div className="space-y-10">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            2026 Modern Tech Blog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            開発現場で役立つ実装ノート
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            プロジェクトで再利用できる設計、PHPとNext.jsの橋渡し、
            パフォーマンス改善の知見をまとめていきます。
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">最新記事</h2>
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="記事を検索"
                className="w-48 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 focus:border-slate-400 focus:outline-none"
              />
              <button className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
                検索
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {paginatedPosts.length == 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-sm text-slate-500">
                ???????????
              </div>
            ) : (
              paginatedPosts.map((post) => (
                <article
                  key={post.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{formatDate(post.date)}</span>
                    <span className="rounded-full border border-slate-200 px-2 py-0.5">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-slate-900">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="transition hover:text-slate-700"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {post.description}
                  </p>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-slate-900"
                  >
                    ????? ?
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
