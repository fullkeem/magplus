"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CATEGORIES } from "@/constants/categories";
import { useFilters } from "@/hooks/useStores";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Input from "@/components/ui/Input";

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery } = useFilters();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setLocalSearchQuery(query);
    setSearchQuery(query);
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      // 임시로 모킹된 검색 결과
      setTimeout(() => {
        const filteredArticles = MOCK_ARTICLES.filter(
          (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setArticles(filteredArticles);
        setLoading(false);
      }, 800);
    } else {
      setArticles([]);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 검색 헤더 */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-light text-black mb-8 tracking-tight">
          Search
        </h1>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="카페, 레스토랑, 팝업스토어 등을 검색해보세요..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              variant="minimal"
              className="text-center text-lg py-4"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* 검색 결과 */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <LoadingSpinner size="lg" />
        </div>
      ) : searchQuery ? (
        <div>
          {/* 검색 결과 헤더 */}
          <div className="mb-8">
            <h2 className="text-xl font-light text-black mb-2">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-gray-500 text-sm">
              {articles.length}개의 결과를 찾았습니다.
            </p>
          </div>

          {/* 검색 결과 목록 */}
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg font-light mb-4">
                검색 결과가 없습니다.
              </p>
              <p className="text-gray-400 text-sm">
                다른 키워드로 검색해보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
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
                      {new Date(article.publishedAt).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* 로드 더 버튼 */}
          {articles.length > 0 && (
            <div className="text-center mt-16">
              <button className="px-8 py-3 border border-gray-300 text-sm font-light tracking-wide text-gray-600 hover:border-black hover:text-black transition-colors">
                LOAD MORE
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-light">
            검색어를 입력해주세요.
          </p>
        </div>
      )}
    </div>
  );
}
