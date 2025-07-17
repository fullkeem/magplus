import { NextRequest, NextResponse } from "next/server";
import {
  getAllArticles,
  getArticlesByCategory,
  getArticlesByRegion,
} from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory } from "@/lib/database.types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const region = searchParams.get("region");
    const sortBy = searchParams.get("sort") || "latest";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let articles: ArticleWithCategory[] = [];

    // 카테고리별 필터링
    if (category) {
      const categories = await getCategories();
      const categoryObj = categories.find((cat) => cat.slug === category);

      if (categoryObj) {
        articles = await getArticlesByCategory(categoryObj.id);
      } else {
        return NextResponse.json(
          { error: "카테고리를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
    }
    // 지역별 필터링
    else if (region) {
      articles = await getArticlesByRegion(region);
    }
    // 전체 아티클 조회
    else {
      articles = await getAllArticles();
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

    return NextResponse.json({
      articles: paginatedArticles,
      total: totalArticles,
      category: category || null,
      region: region || null,
      sortBy,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalArticles,
      },
    });
  } catch (error) {
    console.error("Articles API error:", error);
    return NextResponse.json(
      { error: "아티클 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
