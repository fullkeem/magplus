"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory, Category } from "@/lib/database.types";
import Link from "next/link";

export default function CategoryPage() {
  const params = useParams();
  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadData();
  }, [params.slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      const categorySlug = params.slug as string;

      // 모든 카테고리를 가져와서 현재 카테고리 찾기
      const categories = await getCategories();
      const foundCategory = categories.find((cat) => cat.slug === categorySlug);

      if (foundCategory) {
        setCategory(foundCategory);

        // 해당 카테고리의 아티클들 가져오기
        const categoryArticles = await getArticles({
          category: foundCategory.id,
          status: "published",
        });
        setArticles(categoryArticles);
      }
    } catch (error) {
      console.error("Error loading category data:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg font-light">Category not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 카테고리 헤더 */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{getCategoryIcon(category.slug)}</span>
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
        <p className="text-sm text-gray-500">
          {articles.length} {articles.length === 1 ? "article" : "articles"} in
          this category
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
                    {article.published_at && (
                      <span>
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
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
