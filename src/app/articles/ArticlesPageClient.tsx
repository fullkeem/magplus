"use client";

import { useState, useEffect, useCallback } from "react";
import { useFilters } from "@/hooks/useStores";
import { REGIONS } from "@/constants/regions";
import type { CategoryFilter } from "@/constants/categories";
import type { RegionFilter } from "@/constants/regions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getAllArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory, Category } from "@/lib/database.types";
import Link from "next/link";
import Image from "next/image";

export default function ArticlesPageClient() {
  const {
    selectedCategory,
    selectedRegion,
    sortBy,
    searchQuery,
    setCategory,
    setRegion,
    setSortBy,
    setSearchQuery,
    clearFilters,
  } = useFilters();

  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredArticles, setFilteredArticles] = useState<
    ArticleWithCategory[]
  >([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [articlesData, categoriesData] = await Promise.all([
        getAllArticles(),
        getCategories(),
      ]);

      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortArticles = useCallback(() => {
    let filtered = [...articles];

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.category?.id === selectedCategory
      );
    }

    // 지역 필터
    if (selectedRegion) {
      filtered = filtered.filter(
        (article) => article.region === selectedRegion
      );
    }

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.excerpt &&
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "oldest":
          return (
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, selectedRegion, sortBy, searchQuery]);

  useEffect(() => {
    filterAndSortArticles();
  }, [filterAndSortArticles]);

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-black mb-4">
            모든 아티클
          </h1>
          <p className="text-lg text-gray-600">
            총 {filteredArticles.length}개의 아티클
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">모든 카테고리</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* 지역 필터 */}
            <select
              value={selectedRegion || ""}
              onChange={(e) => {
                const value = e.target.value;
                setRegion(value === "" ? null : (value as RegionFilter));
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">모든 지역</option>
              {REGIONS.map((region) => (
                <option key={region.id} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>

            {/* 정렬 */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "latest" | "popular" | "oldest")
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* 아티클 목록 */}
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
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">
              검색 결과가 없습니다
            </div>
            <p className="text-gray-500 text-sm">
              다른 검색어나 필터를 시도해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
