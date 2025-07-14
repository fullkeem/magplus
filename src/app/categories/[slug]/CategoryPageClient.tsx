"use client";

import Link from "next/link";
import Image from "next/image";
import type { ArticleWithCategory, Category } from "@/lib/database.types";

interface Props {
  category: Category;
  articles: ArticleWithCategory[];
}

export default function CategoryPageClient({ category, articles }: Props) {
  const getCategoryIcon = (slug: string) => {
    const categoryMap: Record<string, string> = {
      cafe: "☕",
      restaurant: "🍽️",
      "popup-store": "🏪",
      culture: "🎭",
      shopping: "🛍️",
      exhibition: "🎨",
    };
    return categoryMap[slug] || "📍";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 카테고리 헤더 */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl" aria-hidden="true">
            {getCategoryIcon(category.slug)}
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-black">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 text-lg font-light mt-2">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 아티클 개수 */}
      <div className="mb-8">
        <h2 className="sr-only">카테고리 아티클 목록</h2>
        <p className="text-sm text-gray-500">
          {articles.length}{" "}
          {articles.length === 1 ? "개의 아티클" : "개의 아티클"}이 이
          카테고리에 있습니다
        </p>
      </div>

      {/* 아티클 그리드 */}
      {articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-light">
            No articles found in this category yet.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Check back soon for new content!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="group">
              <Link
                href={`/articles/${article.id}`}
                className="block focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm"
                aria-label={`${article.title} 아티클 읽기`}
              >
                <div className="aspect-[4/3] bg-gray-100 mb-4 overflow-hidden relative">
                  {article.images && article.images.length > 0 ? (
                    <Image
                      src={article.images[0]}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span
                        className="text-gray-400 text-4xl"
                        aria-hidden="true"
                      >
                        {getCategoryIcon(category.slug)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
                    <span>{category.name}</span>
                    {article.region && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{article.region}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-black group-hover:text-gray-600 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span aria-label={`조회수 ${article.views || 0}회`}>
                      {article.views || 0} views
                    </span>
                    <span aria-label={`좋아요 ${article.likes || 0}개`}>
                      {article.likes || 0} likes
                    </span>
                    {article.published_at && (
                      <time dateTime={article.published_at}>
                        {new Date(article.published_at).toLocaleDateString(
                          "ko-KR"
                        )}
                      </time>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
