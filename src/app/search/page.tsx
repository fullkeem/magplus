import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory } from "@/lib/database.types";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "검색 | MAG+",
  description: "MAG+ 아티클 검색",
};

interface Props {
  searchParams: Promise<{ q?: string; category?: string; region?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, category, region } = await searchParams;

  if (!q && !category && !region) {
    notFound();
  }

  // 모든 아티클을 가져와서 서버 사이드에서 필터링
  const allArticles = await getAllArticles();
  const categories = await getCategories();

  // 서버 사이드에서 기본 필터링
  let filteredArticles = allArticles;

  if (q) {
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(q.toLowerCase()) ||
        article.content.toLowerCase().includes(q.toLowerCase()) ||
        (article.excerpt &&
          article.excerpt.toLowerCase().includes(q.toLowerCase()))
    );
  }

  if (category) {
    filteredArticles = filteredArticles.filter(
      (article) => article.category?.slug === category
    );
  }

  if (region) {
    filteredArticles = filteredArticles.filter(
      (article) => article.region === region
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-black mb-4">검색 결과</h1>
          {q && (
            <p className="text-gray-600">
              "{q}"에 대한 검색 결과 {filteredArticles.length}개
            </p>
          )}
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article key={article.id} className="group">
                <Link href={`/articles/${article.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* 이미지 */}
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                      {article.images && article.images.length > 0 ? (
                        <Image
                          src={article.images[0]}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 내용 */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide mb-3">
                        <span>{article.category?.name}</span>
                        {article.region && (
                          <>
                            <span>•</span>
                            <span>{article.region}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-xl font-light text-black mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span aria-label={`조회수 ${article.views || 0}회`}>
                            👁 {article.views || 0}
                          </span>
                        </div>
                        {article.region && (
                          <span
                            className="truncate max-w-[120px]"
                            title={article.region}
                          >
                            📍 {article.region}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-light text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">다른 검색어를 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
