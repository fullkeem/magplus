"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CATEGORIES, type CategoryId } from "@/constants/categories";
import { useFilters } from "@/hooks/useStores";
import SubscriptionForm from "@/components/common/SubscriptionForm";
import { getArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory, Category } from "@/lib/database.types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function HomePage() {
  const { setCategory } = useFilters();
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
      setLoading(true);
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
      "popup-store": "🏪",
      culture: "🎭",
      shopping: "🛍️",
      exhibition: "🎨",
    };
    return categoryMap[slug] || "📍";
  };

  return (
    <div className="bg-white">
      {/* 히어로 섹션 */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-light text-black mb-8 tracking-tight">
              Discover Seoul's
              <br />
              <span className="italic">Hidden Gems</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              A curated collection of the city's most interesting cafes,
              restaurants, pop-up stores, and cultural spaces, updated weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/articles"
                className="inline-flex items-center px-8 py-3 border border-black text-sm font-light tracking-wide text-black bg-white hover:bg-black hover:text-white transition-all duration-200"
              >
                EXPLORE NOW
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/subscription"
                className="inline-flex items-center px-8 py-3 text-sm font-light tracking-wide text-gray-600 hover:text-black transition-colors"
              >
                SUBSCRIBE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
              Explore by Category
            </h2>
            <p className="text-gray-600 text-lg font-light">
              Find exactly what you're looking for
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  onClick={() =>
                    handleCategoryClick(category.slug as CategoryId)
                  }
                  className="group"
                >
                  <div className="bg-white p-8 text-center hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-200">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                      {getCategoryIcon(category.slug)}
                    </div>
                    <h3 className="text-sm font-medium text-black mb-2 tracking-wide">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-light">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 최신 아티클 섹션 */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
                Latest Stories
              </h2>
              <p className="text-gray-600 text-lg font-light">
                Fresh discoveries from around the city
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden md:inline-flex items-center text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              VIEW ALL
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestArticles.slice(0, 6).map((article) => (
                <article key={article.id} className="group">
                  <Link href={`/articles/${article.id}`}>
                    <div className="aspect-[4/3] bg-gray-100 mb-4 overflow-hidden">
                      {article.images && article.images.length > 0 ? (
                        <img
                          src={article.images[0]}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-4xl">
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
                            <span>•</span>
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
                        <span>{article.views || 0} views</span>
                        <span>{article.likes || 0} likes</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link
              href="/articles"
              className="inline-flex items-center text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              VIEW ALL ARTICLES
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 구독 섹션 */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
            Never Miss a Story
          </h2>
          <p className="text-lg text-gray-300 mb-12 font-light leading-relaxed">
            Get the latest discoveries delivered to your inbox every week.
            Curated content, no spam.
          </p>
          <SubscriptionForm />
        </div>
      </section>
    </div>
  );
}
