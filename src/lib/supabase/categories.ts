import { supabase } from "./client";
import type {
  Category,
  CategoryInsert,
  CategoryUpdate,
} from "../database.types";

// 모든 활성 카테고리 조회
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error("카테고리를 불러오는데 실패했습니다.");
  }

  return data as Category[];
}

// 특정 카테고리 조회
export async function getCategory(id: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    throw new Error("카테고리를 찾을 수 없습니다.");
  }

  return data as Category;
}

// 슬러그로 카테고리 조회
export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching category by slug:", error);
    throw new Error("카테고리를 찾을 수 없습니다.");
  }

  return data as Category;
}

// 카테고리별 아티클 수 조회
export async function getCategoriesWithCount() {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      articles:articles(count)
    `
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories with count:", error);
    throw new Error("카테고리를 불러오는데 실패했습니다.");
  }

  return data;
}

// 카테고리 생성 (관리자용)
export async function createCategory(
  categoryData: Omit<CategoryInsert, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("categories")
    .insert(categoryData)
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw new Error("카테고리 생성에 실패했습니다.");
  }

  return data as Category;
}

// 카테고리 수정 (관리자용)
export async function updateCategory(id: string, updates: CategoryUpdate) {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    throw new Error("카테고리 수정에 실패했습니다.");
  }

  return data as Category;
}

// 카테고리 삭제 (관리자용)
export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error("카테고리 삭제에 실패했습니다.");
  }
}
