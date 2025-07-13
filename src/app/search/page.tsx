"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useFilters } from "@/hooks/useStores";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Input from "@/components/ui/Input";
import { getArticles } from "@/lib/supabase/articles";
import type { ArticleWithCategory } from "@/lib/database.types";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery } = useFilters();
  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setLocalSearchQuery(query);
    setSearchQuery(query);
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setArticles([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setArticles([]);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await getArticles({
        search: query,
        status: "published",
      });
      setArticles(searchResults);
    } catch (error) {
      console.error("Error searching articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 검색 헤더 */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-light text-black mb-6">
          Search
        </h1>

        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-12 py-4 text-lg"
            />
          </div>
        </form>
      </div>

      {/* 검색 결과 */}
      {searchQuery && (
        <div className="mb-8">
          <h2 className="text-xl font-medium text-black mb-4">
            Search results for "{searchQuery}"
          </h2>
          <p className="text-sm text-gray-500">
            {loading
              ? "Searching..."
              : `${articles.length} ${
                  articles.length === 1 ? "result" : "results"
                } found`}
          </p>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* 검색 결과 목록 */}
      {!loading && searchQuery && (
        <>
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg font-light">
                No articles found for "{searchQuery}".
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try different keywords or browse our categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
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
        </>
      )}

      {/* 검색 전 상태 */}
      {!searchQuery && !loading && (
        <div className="text-center py-16">
          <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-light">
            Enter a search term to find articles
          </p>
        </div>
      )}
    </div>
  );
}
