"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { CATEGORIES } from "@/constants/categories";
import { REGIONS } from "@/constants/regions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// 임시 아티클 데이터 타입
interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  region: string;
  images: string[];
  publishedAt: string;
  readTime: number;
  author: string;
  tags: string[];
  location: {
    address: string;
    coordinates: [number, number];
  };
  viewCount: number;
  likeCount: number;
}

// 임시 데이터
const MOCK_ARTICLE: Article = {
  id: "1",
  title: "성수동 숨은 카페 BREW",
  content: `
    <p>성수동 골목 깊숙한 곳에 자리한 BREW는 단순한 카페가 아닌, 커피에 대한 철학이 담긴 공간입니다.</p>
    
    <h2>공간의 매력</h2>
    <p>산업 지역의 특성을 그대로 살린 인테리어가 인상적입니다. 높은 천장과 콘크리트 벽면, 그리고 빈티지한 가구들이 조화를 이루며 독특한 분위기를 연출합니다.</p>
    
    <h2>시그니처 메뉴</h2>
    <p>로스터리 카페답게 다양한 원두를 직접 로스팅하여 제공합니다. 특히 에티오피아 예가체프와 콜롬비아 수프리모를 블렌딩한 하우스 블렌드는 꼭 맛봐야 할 메뉴입니다.</p>
    
    <h2>방문 팁</h2>
    <p>평일 오후 2-4시가 가장 여유로운 시간대입니다. 주말에는 웨이팅이 있을 수 있으니 미리 전화로 문의하시는 것을 추천합니다.</p>
  `,
  category: "cafe",
  region: "seoul",
  images: [
    "/images/articles/cafe-brew-1.jpg",
    "/images/articles/cafe-brew-2.jpg",
    "/images/articles/cafe-brew-3.jpg",
  ],
  publishedAt: "2024-01-15",
  readTime: 5,
  author: "김에디터",
  tags: ["스페셜티커피", "로스터리", "성수동", "힙한카페"],
  location: {
    address: "서울 성동구 성수동2가 123-45",
    coordinates: [127.0557, 37.5444],
  },
  viewCount: 1247,
  likeCount: 89,
};

const RELATED_ARTICLES = [
  {
    id: "2",
    title: "을지로 레트로 바 VINYL",
    category: "restaurant",
    image: "/images/articles/bar-vinyl.jpg",
  },
  {
    id: "3",
    title: "홍대 팝업스토어 SPACE X",
    category: "popup",
    image: "/images/articles/popup-spacex.jpg",
  },
];

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // 임시로 모킹된 데이터 로드
    setTimeout(() => {
      setArticle(MOCK_ARTICLE);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // 폴백: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다!");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg font-light">Article not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 뒤로가기 버튼 */}
      <Link
        href="/articles"
        className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-8"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        <span className="text-sm font-light tracking-wide">
          BACK TO ARTICLES
        </span>
      </Link>

      {/* 아티클 헤더 */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-black text-white text-xs tracking-wide uppercase">
            {CATEGORIES.find((cat) => cat.id === article.category)?.name}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs tracking-wide">
            {REGIONS.find((region) => region.id === article.region)?.name}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>By {article.author}</span>
            <span>•</span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString("ko-KR")}
            </span>
            <span>•</span>
            <span>{article.readTime} min read</span>
            <span>•</span>
            <span>{article.viewCount.toLocaleString()} views</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-black transition-colors"
            >
              <ShareIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleBookmark}
              className="p-2 text-gray-400 hover:text-black transition-colors"
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="h-5 w-5" />
              ) : (
                <BookmarkIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 메인 이미지 */}
      <div className="aspect-[16/9] bg-gray-100 mb-12 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-400">Main Image</span>
        </div>
      </div>

      {/* 아티클 내용 */}
      <div className="prose prose-lg max-w-none mb-12">
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* 위치 정보 */}
      <div className="bg-gray-50 p-6 mb-12">
        <h3 className="text-lg font-light text-black mb-4">Location</h3>
        <p className="text-gray-600 mb-4">{article.location.address}</p>
        <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Map</span>
        </div>
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-12">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 관련 아티클 */}
      <section>
        <h2 className="text-2xl font-light text-black mb-8">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RELATED_ARTICLES.map((relatedArticle) => (
            <Link
              key={relatedArticle.id}
              href={`/articles/${relatedArticle.id}`}
              className="group"
            >
              <div className="aspect-[4/3] bg-gray-100 mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image</span>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs tracking-wide text-gray-500 uppercase">
                  {
                    CATEGORIES.find((cat) => cat.id === relatedArticle.category)
                      ?.name
                  }
                </span>
                <h3 className="text-lg font-light text-black group-hover:text-gray-600 transition-colors">
                  {relatedArticle.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
