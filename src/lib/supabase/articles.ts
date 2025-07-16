import { supabase } from "./client";
import type { ArticleWithCategory } from "../database.types";

// 슬러그 생성 함수
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "") // 특수문자 제거
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/-+/g, "-") // 연속 하이픈 정리
    .trim();
}

// 페이지네이션 타입 정의
export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// 페이지네이션과 함께 아티클 조회
export async function getArticlesPaginated(
  page: number = 1,
  pageSize: number = 12,
  options: {
    categoryId?: string;
    region?: string;
    searchQuery?: string;
    sortBy?: "latest" | "popular" | "oldest";
    showAll?: boolean; // 모든 아티클 보기 옵션 추가
  } = {}
): Promise<PaginationResult<ArticleWithCategory>> {
  try {
    const {
      categoryId,
      region,
      searchQuery,
      sortBy = "latest",
      showAll = false,
    } = options;

    // 필터가 없고 showAll이 true이면 모든 아티클을 보여줌
    const hasFilters = !!(categoryId || region || searchQuery);
    const shouldShowAll = showAll && !hasFilters;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    console.log("🔍 Supabase 쿼리 실행:", {
      page,
      pageSize,
      from,
      to,
      options,
      shouldShowAll,
      hasFilters,
    });

    let query = supabase
      .from("articles")
      .select(
        `
        *,
        category:categories(*)
      `,
        { count: "exact" }
      )
      .eq("status", "published");

    // 필터 적용
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (region) {
      query = query.eq("region", region);
    }

    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%, excerpt.ilike.%${searchQuery}%`
      );
    }

    // 정렬 적용
    switch (sortBy) {
      case "latest":
        query = query.order("created_at", { ascending: false });
        break;
      case "popular":
        query = query.order("views", { ascending: false });
        break;
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
    }

    // 페이지네이션 적용 (showAll이 아닐 때만)
    if (!shouldShowAll) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    console.log("📊 Supabase 쿼리 결과:", {
      data: data?.length,
      error,
      count,
      totalPages: shouldShowAll ? 1 : Math.ceil((count || 0) / pageSize),
      shouldShowAll,
    });

    if (error) {
      console.error("Error fetching articles with pagination:", error);
      throw new Error("아티클을 불러오는데 실패했습니다.");
    }

    const total = count || 0;
    const totalPages = shouldShowAll ? 1 : Math.ceil(total / pageSize);

    return {
      data: data || [],
      total,
      page: shouldShowAll ? 1 : page,
      pageSize: shouldShowAll ? total : pageSize,
      totalPages,
      hasMore: shouldShowAll ? false : page < totalPages,
    };
  } catch (error) {
    console.error("Error in getArticlesPaginated:", error);
    throw error;
  }
}

// 모든 아티클 조회 (발행된 것만) - 기존 함수 개선
export async function getAllArticles(): Promise<ArticleWithCategory[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      throw new Error("아티클을 불러오는데 실패했습니다.");
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllArticles:", error);
    throw error;
  }
}

// 특정 아티클 조회
export async function getArticleById(
  id: string
): Promise<ArticleWithCategory | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Error fetching article:", error);
    return null;
  }

  return data;
}

// 카테고리별 아티클 조회
export async function getArticlesByCategory(
  categoryId: string
): Promise<ArticleWithCategory[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("category_id", categoryId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles by category:", error);
    return [];
  }

  return data || [];
}

// 지역별 아티클 조회
export async function getArticlesByRegion(
  region: string
): Promise<ArticleWithCategory[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("region", region)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles by region:", error);
    return [];
  }

  return data || [];
}

// 검색
export async function searchArticles(
  query: string
): Promise<ArticleWithCategory[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .or(
      `title.ilike.%${query}%, content.ilike.%${query}%, excerpt.ilike.%${query}%`
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching articles:", error);
    return [];
  }

  return data || [];
}

// 관련 아티클 조회 (같은 카테고리의 다른 아티클들)
export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  limit: number = 3
): Promise<ArticleWithCategory[]> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("category_id", categoryId)
    .neq("id", articleId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }

  return data || [];
}

// 조회수 증가
export async function incrementViews(id: string) {
  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("views")
    .eq("id", id)
    .single();

  if (fetchError || !article) {
    console.error("Error fetching article for views increment:", fetchError);
    return;
  }

  const { error } = await supabase
    .from("articles")
    .update({ views: (article.views || 0) + 1 })
    .eq("id", id);

  if (error) {
    console.error("Error incrementing views:", error);
    throw error;
  }
}

// 아티클 생성 (관리자용)
export async function createArticle(articleData: {
  title: string;
  content: string;
  excerpt?: string;
  images?: string[];
  category_id: string;
  region?: string;
  status?: "draft" | "published";
  meta_title?: string;
  meta_description?: string;
}) {
  const slug = generateSlug(articleData.title);

  const { data, error } = await supabase
    .from("articles")
    .insert([
      {
        ...articleData,
        slug,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating article:", error);
    throw new Error("아티클 생성에 실패했습니다.");
  }

  return data;
}

// 아티클 수정 (관리자용)
export async function updateArticle(
  id: string,
  updates: Partial<{
    title: string;
    content: string;
    excerpt: string;
    images: string[];
    category_id: string;
    region: string;
    status: "draft" | "published";
    meta_title: string;
    meta_description: string;
    slug: string;
  }>
) {
  // 제목이 변경되면 슬러그도 업데이트
  const finalUpdates = { ...updates };
  if (updates.title) {
    finalUpdates.slug = generateSlug(updates.title);
  }

  const { data, error } = await supabase
    .from("articles")
    .update(finalUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating article:", error);
    throw new Error("아티클 수정에 실패했습니다.");
  }

  return data;
}

// 아티클 삭제
export async function deleteArticle(id: string) {
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting article:", error);
    throw new Error("아티클 삭제에 실패했습니다.");
  }
}
