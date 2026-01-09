import Link from "next/link";
import { formatDate, getAllPosts } from "../lib/posts";
import PageLayout from "./components/PageLayout";

export default function Home() {
  const posts = getAllPosts();

  return (
    <PageLayout>
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
            {posts.map((post) => (
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
                  続きを読む →
                </Link>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <span>1 / 4 ページ</span>
            <div className="flex gap-2">
              <button className="rounded-full border border-slate-200 px-3 py-1">
                前へ
              </button>
              <button className="rounded-full border border-slate-200 px-3 py-1">
                次へ
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
