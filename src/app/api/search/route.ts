import { NextRequest, NextResponse } from "next/server";
import { getAllArticles, searchArticles } from "@/lib/supabase/articles";
import type { ArticleWithCategory } from "@/lib/database.types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const region = searchParams.get("region");
    const sortBy = searchParams.get("sort") || "latest";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let articles: ArticleWithCategory[] = [];

    // 검색어가 있는 경우 검색 함수 사용
    if (query && query.trim()) {
      articles = await searchArticles(query.trim());
    } else {
      // 전체 아티클 조회
      articles = await getAllArticles();
    }

    // 카테고리 필터
    if (category) {
      articles = articles.filter(
        (article) => article.category?.slug === category
      );
    }

    // 지역 필터
    if (region) {
      articles = articles.filter((article) => article.region === region);
    }

    // 정렬
    articles.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "oldest":
          return (
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
          );
        case "latest":
        default:
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
      }
    });

    // 페이지네이션
    const totalArticles = articles.length;
    const paginatedArticles = articles.slice(offset, offset + limit);

    // 응답 데이터
    const response = {
      articles: paginatedArticles,
      total: totalArticles,
      query: query || null,
      category: category || null,
      region: region || null,
      sortBy,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalArticles,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
