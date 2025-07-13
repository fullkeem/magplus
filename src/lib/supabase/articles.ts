import { supabase } from "./client";
import type {
  Article,
  ArticleInsert,
  ArticleUpdate,
  ArticleWithCategory,
} from "../database.types";

// 슬러그 생성 함수
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "") // 특수문자 제거
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/-+/g, "-") // 연속 하이픈 정리
    .trim();
}

// 아티클 목록 조회 (필터링 지원)
export async function getArticles(params?: {
  category?: string;
  region?: string;
  search?: string;
  status?: "draft" | "published";
  limit?: number;
  offset?: number;
  orderBy?: "created_at" | "views" | "likes" | "updated_at";
}) {
  let query = supabase.from("articles").select(
    `
      *,
      category:categories(*)
    `
  );

  // 필터 적용
  if (params?.category && params.category !== "all") {
    query = query.eq("category_id", params.category);
  }

  if (params?.region && params.region !== "all") {
    query = query.eq("region", params.region);
  }

  if (params?.status) {
    query = query.eq("status", params.status);
  } else {
    // 기본적으로 발행된 아티클만 조회
    query = query.eq("status", "published");
  }

  if (params?.search) {
    query = query.or(
      `title.ilike.%${params.search}%,excerpt.ilike.%${params.search}%,content.ilike.%${params.search}%`
    );
  }

  // 정렬 적용
  const orderBy = params?.orderBy || "created_at";
  const ascending = orderBy === "created_at" ? false : false; // 최신순/높은순으로 정렬
  query = query.order(orderBy, { ascending });

  // 페이지네이션
  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(
      params.offset,
      params.offset + (params?.limit || 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }

  return data as ArticleWithCategory[];
}

// 아티클 상세 조회
export async function getArticle(id: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching article:", error);
    throw new Error("아티클을 찾을 수 없습니다.");
  }

  return data as ArticleWithCategory;
}

// 슬러그로 아티클 조회
export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Error fetching article by slug:", error);
    throw new Error("아티클을 찾을 수 없습니다.");
  }

  return data as ArticleWithCategory;
}

// 아티클 생성
export async function createArticle(
  articleData: Omit<ArticleInsert, "id" | "slug" | "created_at" | "updated_at">
) {
  const slug = generateSlug(articleData.title);

  const { data, error } = await supabase
    .from("articles")
    .insert({
      ...articleData,
      slug,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating article:", error);
    throw new Error("아티클 생성에 실패했습니다.");
  }

  return data as Article;
}

// 아티클 수정
export async function updateArticle(id: string, updates: ArticleUpdate) {
  // 제목이 변경되면 슬러그도 업데이트
  if (updates.title) {
    updates.slug = generateSlug(updates.title);
  }

  const { data, error } = await supabase
    .from("articles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating article:", error);
    throw new Error("아티클 수정에 실패했습니다.");
  }

  return data as Article;
}

// 아티클 삭제
export async function deleteArticle(id: string) {
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting article:", error);
    throw new Error("아티클 삭제에 실패했습니다.");
  }
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
  }
}

// 좋아요 증가
export async function incrementLikes(id: string) {
  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("likes")
    .eq("id", id)
    .single();

  if (fetchError || !article) {
    console.error("Error fetching article for likes increment:", fetchError);
    return;
  }

  const { error } = await supabase
    .from("articles")
    .update({ likes: (article.likes || 0) + 1 })
    .eq("id", id);

  if (error) {
    console.error("Error incrementing likes:", error);
  }
}

// 관련 아티클 조회
export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  limit = 3
) {
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
    .neq("id", articleId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }

  return data as ArticleWithCategory[];
}
