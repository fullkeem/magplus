"use client";

import { useState, useEffect } from "react";
import { useFilters } from "@/hooks/useStores";
import { CATEGORIES } from "@/constants/categories";
import { REGIONS } from "@/constants/regions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// 임시 아티클 데이터 타입
interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  region: string;
  image: string;
  publishedAt: string;
  readTime: number;
}

// 임시 데이터
const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "성수동 숨은 카페 BREW",
    excerpt: "산업 지역 속 숨겨진 스페셜티 커피의 성지",
    category: "cafe",
    region: "seoul",
    image: "/images/articles/cafe-brew.jpg",
    publishedAt: "2024-01-15",
    readTime: 5,
  },
  {
    id: "2",
    title: "을지로 레트로 바 VINYL",
    excerpt: "LP와 함께하는 특별한 밤의 경험",
    category: "restaurant",
    region: "seoul",
    image: "/images/articles/bar-vinyl.jpg",
    publishedAt: "2024-01-14",
    readTime: 7,
  },
  {
    id: "3",
    title: "홍대 팝업스토어 SPACE X",
    excerpt: "아티스트와 브랜드가 만나는 창작 공간",
    category: "popup",
    region: "seoul",
    image: "/images/articles/popup-spacex.jpg",
    publishedAt: "2024-01-13",
    readTime: 4,
  },
];

export default function ArticlesPage() {
  const { selectedCategory, selectedRegion, searchQuery } = useFilters();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    // 임시로 모킹된 데이터 로드
    setTimeout(() => {
      setArticles(MOCK_ARTICLES);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = articles;

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
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
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, selectedRegion, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 헤더 */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
          All Articles
        </h1>
        <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
          Discover Seoul's most interesting places, from hidden cafes to
          cultural spaces
        </p>
      </div>

      {/* 필터 상태 표시 */}
      {(selectedCategory !== "all" ||
        selectedRegion !== "all" ||
        searchQuery) && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Filtered by:</span>
            {selectedCategory !== "all" && (
              <span className="px-3 py-1 bg-black text-white text-xs tracking-wide">
                {CATEGORIES.find((cat) => cat.id === selectedCategory)?.name}
              </span>
            )}
            {selectedRegion !== "all" && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs tracking-wide">
                {REGIONS.find((region) => region.id === selectedRegion)?.name}
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs tracking-wide">
                "{searchQuery}"
              </span>
            )}
          </div>
        </div>
      )}

      {/* 아티클 그리드 */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-light">
            No articles found matching your criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article key={article.id} className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gray-100 mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs tracking-wide text-gray-500">
                  <span className="uppercase">
                    {
                      CATEGORIES.find((cat) => cat.id === article.category)
                        ?.name
                    }
                  </span>
                  <span>•</span>
                  <span>{article.readTime} min read</span>
                </div>

                <h2 className="text-xl font-light text-black group-hover:text-gray-600 transition-colors">
                  {article.title}
                </h2>

                <p className="text-gray-600 font-light leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="text-xs text-gray-400 tracking-wide">
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 로드 더 버튼 */}
      <div className="text-center mt-16">
        <button className="px-8 py-3 border border-gray-300 text-sm font-light tracking-wide text-gray-600 hover:border-black hover:text-black transition-colors">
          LOAD MORE
        </button>
      </div>
    </div>
  );
}
