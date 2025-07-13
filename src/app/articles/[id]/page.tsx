"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  getArticle,
  incrementViews,
  incrementLikes,
} from "@/lib/supabase/articles";
import { recordShare } from "@/lib/supabase/shares";
import type { ArticleWithCategory } from "@/lib/database.types";
import Link from "next/link";

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<ArticleWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    loadArticle();
  }, [params.id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const articleId = params.id as string;
      const articleData = await getArticle(articleId);

      if (articleData) {
        setArticle(articleData);
        setLikeCount(articleData.likes || 0);

        // 조회수 증가
        await incrementViews(articleId);
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform: string = "clipboard") => {
    if (!article) return;

    try {
      // 공유 통계 기록
      await recordShare({
        article_id: article.id,
        platform: platform as any,
      });

      if (navigator.share && platform === "native") {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: window.location.href,
        });
      } else {
        // 폴백: 클립보드에 복사
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 클립보드에 복사되었습니다!");
      }
    } catch (error) {
      console.log("Share cancelled or failed:", error);
    }
  };

  const handleLike = async () => {
    if (!article) return;

    try {
      if (!isLiked) {
        await incrementLikes(article.id);
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 실제로는 로컬 스토리지나 사용자 데이터에 저장
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

  if (!article) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg font-light">Article not found</p>
        <Link
          href="/articles"
          className="text-black hover:text-gray-600 transition-colors mt-4 inline-block"
        >
          ← Back to articles
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 아티클 헤더 */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 uppercase tracking-wide mb-4">
          <span>{article.category?.name}</span>
          {article.region && (
            <>
              <span>•</span>
              <span>{article.region}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-6 leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
            {article.excerpt}
          </p>
        )}

        {/* 메타 정보 */}
        <div className="flex items-center justify-between border-t border-b border-gray-100 py-4">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              <span>{(article.views || 0) + 1} views</span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="h-4 w-4" />
              <span>{likeCount} likes</span>
            </div>
            {article.published_at && (
              <span>{new Date(article.published_at).toLocaleDateString()}</span>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-400 hover:text-red-500"
              }`}
              title="Like"
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? "text-blue-500 hover:text-blue-600"
                  : "text-gray-400 hover:text-blue-500"
              }`}
              title="Bookmark"
            >
              {isBookmarked ? (
                <BookmarkIconSolid className="h-5 w-5" />
              ) : (
                <BookmarkIcon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => handleShare("clipboard")}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              title="Share"
            >
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 아티클 이미지 */}
      {article.images && article.images.length > 0 && (
        <div className="mb-12">
          <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
            <img
              src={article.images[0]}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* 아티클 내용 */}
      <div className="prose prose-lg max-w-none">
        <div
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: article.content.replace(/\n/g, "<br/>"),
          }}
        />
      </div>

      {/* 추가 이미지들 */}
      {article.images && article.images.length > 1 && (
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.images.slice(1).map((image, index) => (
              <div
                key={index}
                className="aspect-[4/3] bg-gray-100 overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${article.title} - Image ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 하단 액션 */}
      <div className="mt-16 pt-8 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span>{likeCount}</span>
            </button>

            <button
              onClick={() => handleShare("clipboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

          <Link
            href="/articles"
            className="text-gray-600 hover:text-black transition-colors"
          >
            ← Back to articles
          </Link>
        </div>
      </div>
    </article>
  );
}
