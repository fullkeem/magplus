"use client";

import { useState, useEffect } from "react";
import { ShareIcon, EyeIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/components/common/Breadcrumb";
import { incrementViews } from "@/lib/supabase/articles";
import { recordShare } from "@/lib/supabase/shares";
import type { ArticleWithCategory } from "@/lib/database.types";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  article: ArticleWithCategory;
}

export default function ArticleDetailClient({ article }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 조회수 증가
    incrementViews(article.id);
    // 클라이언트 사이드 렌더링 확인
    setIsClient(true);
  }, [article.id]);

  const handleShare = async (platform: string = "clipboard") => {
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

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 브레드크럼 네비게이션 */}
      <Breadcrumb
        items={[
          { label: "아티클", href: "/articles" },
          { label: article.title, href: `/articles/${article.id}` },
        ]}
        className="mb-8"
      />

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
            {article.published_at && (
              <time dateTime={article.published_at}>
                {new Date(article.published_at).toLocaleDateString("ko-KR")}
              </time>
            )}
          </div>

          {/* 공유 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShare("clipboard")}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              title="Share"
              aria-label="공유"
            >
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 아티클 이미지 */}
      {article.images && article.images.length > 0 && (
        <div className="mb-12">
          <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
            <Image
              src={article.images[0]}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        </div>
      )}

      {/* 아티클 내용 */}
      <div className="prose prose-lg max-w-none">
        <div className="text-gray-800 leading-relaxed">
          {isClient ? (
            <ReactMarkdown
              key={article.id}
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-black mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h2: ({ children }) => (
                  <h3 className="text-xl font-semibold text-black mt-6 mb-3">
                    {children}
                  </h3>
                ),
                h3: ({ children }) => (
                  <h4 className="text-lg font-semibold text-black mt-5 mb-2">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-gray-800 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-800 leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-black">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-700">{children}</em>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          ) : (
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          )}
        </div>
      </div>

      {/* 추가 이미지들 */}
      {article.images && article.images.length > 1 && (
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.images.slice(1).map((image, index) => (
              <div
                key={index}
                className="aspect-[4/3] bg-gray-100 overflow-hidden relative"
              >
                <Image
                  src={image}
                  alt={`${article.title} - Image ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
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
              onClick={() => handleShare("clipboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="공유"
            >
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

          <Link
            href="/articles"
            className="text-gray-600 hover:text-black transition-colors"
            aria-label="아티클 목록으로 돌아가기"
          >
            ← Back to articles
          </Link>
        </div>
      </div>
    </article>
  );
}
