"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import { getArticle } from "@/lib/supabase/articles";
import type { ArticleWithCategory } from "@/lib/database.types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface EditArticlePageProps {
  params: { id: string };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const [article, setArticle] = useState<ArticleWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticle();
  }, [params.id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const articleData = await getArticle(params.id);

      if (articleData) {
        setArticle(articleData);
      } else {
        setError("아티클을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("Error loading article:", error);
      setError("아티클을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-lg mb-4">
          {error || "아티클을 찾을 수 없습니다."}
        </p>
        <a
          href="/admin/articles"
          className="text-black hover:text-gray-600 transition-colors"
        >
          ← 아티클 목록으로 돌아가기
        </a>
      </div>
    );
  }

  // ArticleForm에서 사용할 수 있는 형태로 데이터 변환
  const initialData = {
    title: article.title,
    subtitle: article.excerpt || "",
    content: article.content,
    category: article.category_id,
    region: article.region || "",
    tags: [], // 현재 스키마에는 tags가 없으므로 빈 배열
    featuredImage: article.images?.[0] || "",
    location: {
      name: "",
      address: "",
    },
    status: article.status as "draft" | "published",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">아티클 편집</h1>
        <p className="text-gray-600">아티클 정보를 수정하세요</p>
      </div>

      <ArticleForm initialData={initialData} isEditing={true} />
    </div>
  );
}
