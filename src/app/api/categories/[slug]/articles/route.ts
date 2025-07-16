import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/supabase/categories";
import { getArticlesByCategory } from "@/lib/supabase/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sort") || "latest";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 카테고리 찾기
    const categories = await getCategories();
    const category = categories.find((cat) => cat.slug === slug);

    if (!category) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 해당 카테고리의 아티클 조회
    let articles = await getArticlesByCategory(category.id);

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
      category,
      articles: paginatedArticles,
      total: totalArticles,
      sortBy,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < totalArticles,
      },
    });
  } catch (error) {
    console.error("Category articles API error:", error);
    return NextResponse.json(
      { error: "카테고리별 아티클 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
