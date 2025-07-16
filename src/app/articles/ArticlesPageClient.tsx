"use client";

import Link from "next/link";
import Image from "next/image";

import { useState, useEffect, useCallback } from "react";
import { useFilters } from "@/hooks/useStores";
import type { CategoryFilter } from "@/constants/categories";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { PaginationResult } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory, Category } from "@/lib/database.types";

export default function ArticlesPageClient() {
  const {
    selectedCategory,
    selectedRegion,
    sortBy,
    searchQuery,
    setCategory,
    setSortBy,
    setSearchQuery,
    clearFilters,
  } = useFilters();

  const [articlesData, setArticlesData] =
    useState<PaginationResult<ArticleWithCategory> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const PAGE_SIZE = 20; // 12에서 20으로 증가

  // 데이터 로딩 함수
  const loadArticles = useCallback(
    async (page: number = 1, reset: boolean = true) => {
      try {
        console.log("🔄 아티클 로딩 시작:", {
          page,
          reset,
          selectedCategory,
          selectedRegion,
          searchQuery,
          sortBy,
        });

        if (reset) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        // 필터가 없을 때는 모든 아티클을 보여줌
        const hasFilters = !!(
          selectedCategory ||
          selectedRegion ||
          searchQuery
        );
        const showAll = !hasFilters; // 필터가 없을 때는 항상 모든 아티클 표시

        // Dynamic import로 함수 로딩
        const { getArticlesPaginated } = await import(
          "@/lib/supabase/articles"
        );
        const result = await getArticlesPaginated(page, PAGE_SIZE, {
          categorySlug: selectedCategory || undefined, // categoryId에서 categorySlug로 변경
          region: selectedRegion || undefined,
          searchQuery: searchQuery || undefined,
          sortBy,
          showAll: showAll, // showAll 옵션 명시적 전달
        });

        console.log("✅ 아티클 로딩 완료:", result);

        if (reset) {
          setArticlesData(result);
        } else {
          setArticlesData((prev) =>
            prev
              ? {
                  ...result,
                  data: [...prev.data, ...result.data],
                }
              : result
          );
        }

        setCurrentPage(page);
      } catch (err) {
        console.error("❌ 아티클 로딩 실패:", err);
        setError(
          err instanceof Error
            ? err.message
            : "아티클을 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory, selectedRegion, searchQuery, sortBy]
  );
  // 카테고리 로딩
  const loadCategories = useCallback(async () => {
    try {
      console.log("🔄 카테고리 로딩 시작");
      const categoriesData = await getCategories();
      console.log("✅ 카테고리 로딩 완료:", categoriesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("❌ 카테고리 로딩 실패:", err);
      // 카테고리 로딩 실패는 치명적이지 않으므로 에러 상태로 설정하지 않음
    }
  }, []);

  // 초기 데이터 로딩
  useEffect(() => {
    Promise.all([loadArticles(1, true), loadCategories()]);
  }, [loadArticles, loadCategories]);

  // 필터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    if (articlesData) {
      loadArticles(1, true);
    }
  }, [selectedCategory, selectedRegion, searchQuery, sortBy]);

  // 더 많은 아티클 로드
  const loadMore = () => {
    if (articlesData && articlesData.hasMore && !loadingMore) {
      loadArticles(currentPage + 1, false);
    }
  };

  // 페이지 변경 (페이지네이션 버튼용)
  const goToPage = (page: number) => {
    loadArticles(page, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 에러 재시도
  const retry = () => {
    setError(null);
    loadArticles(1, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-red-500 text-lg mb-4">
              ⚠️ 오류가 발생했습니다
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={retry}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-black mb-4">
            모든 아티클
          </h1>
          <p className="text-lg text-gray-600">
            총 {articlesData?.total || 0}개의 아티클
          </p>
        </div>

        {/* 필터 및 정렬 */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* 카테고리 필터 */}
            <select
              value={selectedCategory || ""}
              onChange={(e) => {
                const value = e.target.value;
                setCategory(value === "" ? null : (value as CategoryFilter));
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
            >
              <option value="">모든 카테고리</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* 정렬 */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "latest" | "popular" | "oldest")
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
            >
              <option value="latest">최신순</option>
              <option value="popular">조회수순</option>
              <option value="oldest">오래된순</option>
            </select>

            {/* 필터 초기화 */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
            >
              필터 초기화
            </button>
          </div>

          {/* 검색 */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder="아티클 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* 아티클 목록 */}
        {articlesData && articlesData.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articlesData.data.map((article) => (
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
                            <span>
                              {new Date(
                                article.created_at || ""
                              ).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* 페이지네이션 - 필터가 적용되었을 때만 표시 */}
            {(selectedCategory || selectedRegion || searchQuery) &&
              articlesData.totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center space-y-4">
                  {/* 더 보기 버튼 (무한 스크롤 스타일) */}
                  {articlesData.hasMore && (
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>로딩 중...</span>
                        </div>
                      ) : (
                        "더 보기"
                      )}
                    </button>
                  )}

                  {/* 페이지 번호 네비게이션 */}
                  {articlesData.totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => goToPage(articlesData.page - 1)}
                        disabled={articlesData.page === 1}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        이전
                      </button>

                      {/* 페이지 번호들 */}
                      {Array.from(
                        { length: Math.min(5, articlesData.totalPages) },
                        (_, i) => {
                          const pageNum =
                            Math.max(1, articlesData.page - 2) + i;
                          if (pageNum > articlesData.totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`px-3 py-2 text-sm border rounded-lg ${
                                pageNum === articlesData.page
                                  ? "bg-black text-white border-black"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() => goToPage(articlesData.page + 1)}
                        disabled={articlesData.page === articlesData.totalPages}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다음
                      </button>
                    </div>
                  )}

                  {/* 페이지 정보 */}
                  <p className="text-sm text-gray-500">
                    {articlesData.page} / {articlesData.totalPages} 페이지 (총{" "}
                    {articlesData.total}개)
                  </p>
                </div>
              )}

            {/* 필터가 없을 때 표시할 간단한 통계 */}
            {!selectedCategory && !selectedRegion && !searchQuery && (
              <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                  전체 {articlesData.total}개의 아티클을 모두 표시하고 있습니다
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">
              {searchQuery || selectedCategory || selectedRegion
                ? "검색 결과가 없습니다"
                : "아직 아티클이 없습니다"}
            </div>
            <p className="text-gray-500 text-sm">
              {searchQuery || selectedCategory || selectedRegion
                ? "다른 검색어나 필터를 시도해보세요"
                : "곧 새로운 아티클을 만나보실 수 있습니다"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
