"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useFilters } from "@/hooks/useStores";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Input from "@/components/ui/Input";
import { getArticles } from "@/lib/supabase/articles";
import type { ArticleWithCategory } from "@/lib/database.types";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery } = useFilters();
  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("q") || "";
    if (query) {
      setLocalSearchQuery(query);
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    if (searchQuery && searchQuery !== localSearchQuery) {
      setLocalSearchQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchQuery, localSearchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const allArticles = await getArticles();
      const filtered = allArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.category?.name.toLowerCase().includes(query.toLowerCase())
      );
      setArticles(filtered);
    } catch (error) {
      console.error("검색 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(localSearchQuery);
  };

  const getCategoryIcon = (slug: string) => {
    const icons: { [key: string]: string } = {
      cafe: "☕",
      restaurant: "🍽️",
      popup: "🏪",
      culture: "🎭",
      shopping: "🛍️",
      exhibition: "🎨",
    };
    return icons[slug] || "📍";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 검색 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-light text-gray-900 mb-6">
            아티클 검색
          </h1>

          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="검색어를 입력하세요..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "검색 중..." : "검색"}
            </button>
          </form>
        </div>

        {/* 검색 결과 */}
        {localSearchQuery && (
          <div className="mb-6">
            <h2 className="text-lg font-light text-gray-700">
              &quot;{localSearchQuery}&quot; 검색 결과 ({articles.length}개)
            </h2>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={article.images?.[0] || "/placeholder-image.jpg"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-white bg-opacity-90 text-gray-800 rounded-full">
                      {getCategoryIcon(article.category?.slug || "")}
                      <span className="ml-1">{article.category?.name}</span>
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-light text-lg text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {article.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.region}</span>
                    <span>
                      {article.created_at &&
                        new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : localSearchQuery && !loading ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-light text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">다른 검색어를 시도해보세요.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-light text-gray-900 mb-2">
              검색어를 입력하세요
            </h3>
            <p className="text-gray-600">관심 있는 아티클을 찾아보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <SearchContent />
    </Suspense>
  );
}
