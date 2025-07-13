"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { getArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory, Category } from "@/lib/database.types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDashboard() {
  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData] = await Promise.all([
        getArticles(),
        getCategories(),
      ]);

      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 통계 계산
  const publishedArticles = articles.filter(
    (article) => article.status === "published"
  );
  const draftArticles = articles.filter(
    (article) => article.status === "draft"
  );
  const totalViews = articles.reduce(
    (sum, article) => sum + (article.views || 0),
    0
  );

  const stats = [
    {
      name: "총 아티클",
      value: articles.length.toString(),
      icon: DocumentTextIcon,
    },
    {
      name: "발행된 아티클",
      value: publishedArticles.length.toString(),
      icon: EyeIcon,
    },
    {
      name: "초안",
      value: draftArticles.length.toString(),
      icon: PencilIcon,
    },
  ];

  // 최근 아티클 목록 (최대 5개)
  const recentArticles = articles
    .sort(
      (a, b) =>
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">웹 매거진 관리 현황을 확인하세요</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          <PlusIcon className="h-4 w-4 mr-2" />새 아티클 작성
        </Link>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {item.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 아티클 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                최근 아티클
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                최근에 작성된 아티클 목록입니다
              </p>
            </div>
            <Link
              href="/admin/articles"
              className="text-sm font-medium text-black hover:text-gray-600"
            >
              모두 보기
            </Link>
          </div>
        </div>

        {recentArticles.length === 0 ? (
          <div className="px-4 py-5 text-center text-gray-500">
            아직 작성된 아티클이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentArticles.map((article) => (
              <li key={article.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {article.title}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {article.status === "published" ? "발행됨" : "초안"}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{article.category?.name}</span>
                        <span>•</span>
                        <span>
                          {article.created_at
                            ? new Date(article.created_at).toLocaleDateString()
                            : "-"}
                        </span>
                        <span>•</span>
                        <span>
                          {(article.views || 0).toLocaleString()} 조회
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        편집
                      </Link>
                      <Link
                        href={`/articles/${article.id}`}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        보기
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 추가 통계 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              카테고리별 아티클 수
            </h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const count = articles.filter(
                  (article) => article.category_id === category.id
                ).length;
                return (
                  <div key={category.id} className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {category.name}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {count}개
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              주요 지표
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">총 조회수</span>
                <span className="text-sm font-medium text-gray-900">
                  {totalViews.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">평균 조회수</span>
                <span className="text-sm font-medium text-gray-900">
                  {articles.length > 0
                    ? Math.round(totalViews / articles.length).toLocaleString()
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">발행률</span>
                <span className="text-sm font-medium text-gray-900">
                  {articles.length > 0
                    ? Math.round(
                        (publishedArticles.length / articles.length) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
