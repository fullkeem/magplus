"use client";

import { useState, useEffect } from "react";
import { useFilters } from "@/hooks/useStores";
import { REGIONS } from "@/constants/regions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory, Category } from "@/lib/database.types";
import Link from "next/link";
import Image from "next/image";
import { stripMarkdown } from "@/utils/markdown";

export default function ArticlesPageClient() {
  const { selectedCategory, selectedRegion, searchQuery } = useFilters();
  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredArticles, setFilteredArticles] = useState<
    ArticleWithCategory[]
  >([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [articles, selectedCategory, selectedRegion, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData] = await Promise.all([
        getArticles({ status: "published" }),
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

  const applyFilters = () => {
    let filtered = articles;

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category?.slug === selectedCategory
      );
    }

    if (selectedRegion && selectedRegion !== "all") {
      filtered = filtered.filter(
        (article) => article.region === selectedRegion
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.excerpt &&
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  };

  const getCategoryIcon = (slug: string) => {
    const categoryMap: Record<string, string> = {
      cafe: "☕",
      restaurant: "🍽️",
      popup: "🏪",
      culture: "🎭",
      shopping: "🛍️",
      exhibition: "🎨",
    };
    return categoryMap[slug] || "📍";
  };

  const getRegionLabel = (region: string) => {
    const regionData = REGIONS.find((r) => r.id === region);
    return regionData?.name || region;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-light text-black mb-4">
          모든 기사
        </h1>
        <p className="text-gray-600 text-lg font-light">
          서울의 가장 흥미로운 장소와 경험을 발견하세요
        </p>
      </div>

      {/* 결과 개수 */}
      <div className="mb-8">
        <h2 className="sr-only">검색 결과</h2>
        <p className="text-sm text-gray-500">
          {filteredArticles.length}{" "}
          {filteredArticles.length === 1 ? "개의 아티클" : "개의 아티클"}이
          있습니다
        </p>
      </div>

      {/* 아티클 그리드 */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-light">
            No articles found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
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
                        {getCategoryIcon(article.category?.slug || "")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
                    <span>{article.category?.name}</span>
                    {article.region && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{getRegionLabel(article.region)}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-black group-hover:text-gray-600 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      {stripMarkdown(article.excerpt)}
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
