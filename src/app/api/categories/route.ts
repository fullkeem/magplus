import { NextResponse } from "next/server";
import { getCategories } from "@/lib/supabase/categories";

export async function GET() {
  try {
    const categories = await getCategories();

    return NextResponse.json({
      categories,
      total: categories.length,
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "카테고리 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
