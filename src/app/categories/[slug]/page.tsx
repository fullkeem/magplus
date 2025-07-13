"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CATEGORIES } from "@/constants/categories";
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
    id: "4",
    title: "강남 모던 카페 MINIMAL",
    excerpt: "미니멀한 디자인과 완벽한 커피의 조화",
    category: "cafe",
    region: "seoul",
    image: "/images/articles/cafe-minimal.jpg",
    publishedAt: "2024-01-12",
    readTime: 4,
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
];

export default function CategoryPage() {
  const params = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    const categorySlug = params.slug as string;
    const foundCategory = CATEGORIES.find((cat) => cat.slug === categorySlug);
    setCategory(foundCategory);

    // 임시로 모킹된 데이터 로드 및 필터링
    setTimeout(() => {
      const filteredArticles = MOCK_ARTICLES.filter(
        (article) => article.category === foundCategory?.id
      );
      setArticles(filteredArticles);
      setLoading(false);
    }, 1000);
  }, [params.slug]);

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
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <span className="text-4xl mr-4">{category.icon}</span>
          <h1 className="text-4xl md:text-5xl font-light text-black tracking-tight">
            {category.name}
          </h1>
        </div>
        <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
          {category.description}
        </p>
        <div className="mt-8">
          <span className="text-sm text-gray-500 tracking-wide">
            {articles.length}개의 아티클
          </span>
        </div>
      </div>

      {/* 아티클 그리드 */}
      {articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-light">
            이 카테고리에는 아직 아티클이 없습니다.
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
                  <span className="uppercase">{category.name}</span>
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
                  {new Date(article.publishedAt).toLocaleDateString("ko-KR", {
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
      {articles.length > 0 && (
        <div className="text-center mt-16">
          <button className="px-8 py-3 border border-gray-300 text-sm font-light tracking-wide text-gray-600 hover:border-black hover:text-black transition-colors">
            LOAD MORE
          </button>
        </div>
      )}
    </div>
  );
}
