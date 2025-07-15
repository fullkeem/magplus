"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CATEGORIES, type CategoryId } from "@/constants/categories";
import { useFilters } from "@/hooks/useStores";
import SubscriptionForm from "@/components/common/SubscriptionForm";
import { getArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory, Category } from "@/lib/database.types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { stripMarkdown } from "@/utils/markdown";

export default function HomePage() {
  const { setCategory } = useFilters();

  // 구조화된 데이터 (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MAG+",
    description: "MZ세대를 위한 핫플레이스 웹매거진",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://mag-plus.com",
    publisher: {
      "@type": "Organization",
      name: "MAG+",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://mag-plus.com"
        }/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  const [latestArticles, setLatestArticles] = useState<ArticleWithCategory[]>(
    []
  );
  const [popularArticles, setPopularArticles] = useState<ArticleWithCategory[]>(
    []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, latestData, popularData] = await Promise.all([
        getCategories(),
        getArticles({ limit: 6, orderBy: "created_at" }),
        getArticles({ limit: 6, orderBy: "views" }),
      ]);

      setCategories(categoriesData);
      setLatestArticles(latestData);
      setPopularArticles(popularData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: CategoryId) => {
    setCategory(categoryId);
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="bg-white">
        {/* 히어로 섹션 - 모바일 간격 최적화 */}
        <section className="relative bg-white" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-8 sm:pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-black mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight">
                Discover Seoul's
                <br />
                <span className="italic">Hidden Gems</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-3xl mx-auto font-light leading-relaxed px-2">
                서울의 가장 흥미로운 카페, 레스토랑, 팝업스토어, 문화공간을
                큐레이션하여 매주 업데이트합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto px-4">
                <Link
                  href="/articles"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-black text-sm sm:text-base font-light tracking-wide text-black bg-white hover:bg-black hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 min-h-[48px]"
                  aria-label="모든 기사 보기"
                >
                  Explore Articles
                  <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/subscribe"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-light tracking-wide text-gray-600 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[48px]"
                  aria-label="뉴스레터 구독하기"
                >
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section
          className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50"
          role="region"
          aria-labelledby="categories-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h2
                id="categories-heading"
                className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-3 sm:mb-4 tracking-wide"
              >
                Categories
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-light">
                관심 있는 카테고리를 탐색해보세요
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  onClick={() => handleCategoryClick(category.id)}
                  className="group bg-white p-3 sm:p-4 md:p-6 text-center hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] flex flex-col justify-center items-center"
                  aria-label={`${category.name} 카테고리 보기`}
                >
                  <div
                    className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3"
                    aria-hidden="true"
                  >
                    {getCategoryIcon(category.slug)}
                  </div>
                  <h3 className="text-xs sm:text-sm font-light text-black group-hover:text-gray-600 transition-colors tracking-wide">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 로딩 상태 */}
        {loading && (
          <section className="py-8 sm:py-12 md:py-16">
            <div className="flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          </section>
        )}

        {/* 최신 아티클 섹션 */}
        {!loading && (
          <section
            className="py-8 sm:py-12 md:py-16 lg:py-20"
            role="region"
            aria-labelledby="latest-heading"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-12 gap-4">
                <div>
                  <h2
                    id="latest-heading"
                    className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-2 tracking-wide"
                  >
                    Latest Articles
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 font-light">
                    가장 최근에 발행된 아티클들을 확인해보세요
                  </p>
                </div>
                <Link
                  href="/articles"
                  className="inline-flex items-center text-sm font-light text-gray-600 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-sm px-2 py-1"
                  aria-label="모든 기사 보기"
                >
                  View All
                  <ArrowRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {latestArticles.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>아직 등록된 아티클이 없습니다.</p>
                  </div>
                ) : (
                  latestArticles.map((article) => (
                    <article
                      key={article.id}
                      className="group bg-white border border-gray-100 hover:shadow-lg transition-all duration-200"
                    >
                      <Link
                        href={`/articles/${article.id}`}
                        className="block focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        aria-label={`${article.title} 아티클 읽기`}
                      >
                        {article.images && article.images.length > 0 && (
                          <div className="aspect-[4/3] overflow-hidden relative">
                            <Image
                              src={article.images[0]}
                              alt={`${article.title} 대표 이미지`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            />
                          </div>
                        )}
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center text-xs text-gray-500 mb-2 font-light">
                            <span aria-hidden="true">
                              {getCategoryIcon(article.category?.slug || "")}
                            </span>
                            <span className="ml-1">
                              {article.category?.name}
                            </span>
                            <span className="mx-2" aria-hidden="true">
                              •
                            </span>
                            <time dateTime={article.created_at || undefined}>
                              {article.created_at
                                ? new Date(
                                    article.created_at
                                  ).toLocaleDateString("ko-KR")
                                : ""}
                            </time>
                          </div>
                          <h3 className="text-base sm:text-lg md:text-xl font-light text-black mb-2 group-hover:text-gray-600 transition-colors tracking-wide line-clamp-2">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-2">
                              {stripMarkdown(article.excerpt)}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-3">
                              <span
                                aria-label={`조회수 ${article.views || 0}회`}
                              >
                                👁 {article.views || 0}
                              </span>
                              <span
                                aria-label={`좋아요 ${article.likes || 0}개`}
                              >
                                ❤️ {article.likes || 0}
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
                      </Link>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* 인기 아티클 섹션 */}
        {!loading && (
          <section
            className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50"
            role="region"
            aria-labelledby="popular-heading"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-12 gap-4">
                <div>
                  <h2
                    id="popular-heading"
                    className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-2 tracking-wide"
                  >
                    Popular Articles
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 font-light">
                    가장 많이 읽힌 인기 아티클들을 확인해보세요
                  </p>
                </div>
                <Link
                  href="/articles?sort=views"
                  className="inline-flex items-center text-sm font-light text-gray-600 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-sm px-2 py-1"
                  aria-label="조회수 순으로 정렬된 아티클 보기"
                >
                  View All
                  <ArrowRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {popularArticles.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>아직 등록된 아티클이 없습니다.</p>
                  </div>
                ) : (
                  popularArticles.map((article, index) => (
                    <article
                      key={article.id}
                      className="group bg-white border border-gray-100 hover:shadow-lg transition-all duration-200 relative"
                    >
                      {index < 3 && (
                        <div className="absolute top-3 left-3 z-10 bg-black text-white text-xs px-2 py-1 font-light">
                          #{index + 1}
                        </div>
                      )}
                      <Link
                        href={`/articles/${article.id}`}
                        className="block focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        aria-label={`인기 아티클 ${index + 1}위: ${
                          article.title
                        } 읽기`}
                      >
                        {article.images && article.images.length > 0 && (
                          <div className="aspect-[4/3] overflow-hidden relative">
                            <Image
                              src={article.images[0]}
                              alt={`${article.title} 대표 이미지`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            />
                          </div>
                        )}
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center text-xs text-gray-500 mb-2 font-light">
                            <span aria-hidden="true">
                              {getCategoryIcon(article.category?.slug || "")}
                            </span>
                            <span className="ml-1">
                              {article.category?.name}
                            </span>
                            <span className="mx-2" aria-hidden="true">
                              •
                            </span>
                            <time dateTime={article.created_at || undefined}>
                              {article.created_at
                                ? new Date(
                                    article.created_at
                                  ).toLocaleDateString("ko-KR")
                                : ""}
                            </time>
                          </div>
                          <h3 className="text-base sm:text-lg md:text-xl font-light text-black mb-2 group-hover:text-gray-600 transition-colors tracking-wide line-clamp-2">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-2">
                              {stripMarkdown(article.excerpt)}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-3">
                              <span
                                aria-label={`조회수 ${article.views || 0}회`}
                              >
                                👁 {article.views || 0}
                              </span>
                              <span
                                aria-label={`좋아요 ${article.likes || 0}개`}
                              >
                                ❤️ {article.likes || 0}
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
                      </Link>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* 구독 섹션 */}
        <section
          className="py-8 sm:py-12 md:py-16 lg:py-20"
          role="region"
          aria-labelledby="subscribe-heading"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              id="subscribe-heading"
              className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-4 tracking-wide"
            >
              Stay Updated
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-light mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
              매주 새로운 아티클과 큐레이션된 콘텐츠를 이메일로 받아보세요.
              언제든지 구독을 취소할 수 있습니다.
            </p>
            <div className="max-w-md mx-auto">
              <SubscriptionForm onSuccess={() => {}} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
