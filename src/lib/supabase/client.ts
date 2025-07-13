import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 개발 환경에서 환경 변수가 없을 때 임시 처리
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
❌ Supabase 환경 변수가 설정되지 않았습니다!

다음 환경 변수를 .env.local 파일에 추가해주세요:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

실제 Supabase 프로젝트를 생성한 후 올바른 값으로 교체해주세요.
  `);

  // 개발 중에는 더미 클라이언트 생성하여 앱이 크래시되지 않도록 함
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요."
    );
  }

  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // 인증 없는 시스템이므로 세션 비활성화
  },
});

// 타입 안전성을 위한 헬퍼 타입들
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
