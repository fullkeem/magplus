import { supabase } from "./client";
import type {
  Subscription,
  SubscriptionInsert,
  SubscriptionUpdate,
} from "../database.types";

// 이메일 구독 신청
export async function subscribe(email: string, categories: string[] = []) {
  // 이미 구독된 이메일인지 확인
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) {
    if (existing.is_active) {
      throw new Error("이미 구독된 이메일입니다.");
    } else {
      // 비활성화된 구독을 다시 활성화
      const { error } = await supabase
        .from("subscriptions")
        .update({
          is_active: true,
          subscribed_categories: categories,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (error) {
        throw new Error(`구독 재활성화 실패: ${error.message}`);
      }

      return { success: true, message: "구독이 재활성화되었습니다." };
    }
  }

  // 새로운 구독 생성
  const verificationToken = generateVerificationToken();
  const subscriptionData: SubscriptionInsert = {
    email,
    subscribed_categories: categories,
    verification_token: verificationToken,
    is_verified: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("subscriptions")
    .insert(subscriptionData);

  if (error) {
    throw new Error(`구독 신청 실패: ${error.message}`);
  }

  // 개발 환경에서는 콘솔에 인증 링크 출력
  if (process.env.NODE_ENV === "development") {
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}`;
    console.log("📧 이메일 인증 링크:", verificationUrl);
  }

  return {
    success: true,
    message: "구독 신청이 완료되었습니다. 이메일을 확인해주세요.",
  };
}

// 구독 해지
export async function unsubscribe(email: string) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email);

  if (error) {
    throw new Error(`구독 해지 실패: ${error.message}`);
  }

  return { success: true, message: "구독이 해지되었습니다." };
}

// 이메일 인증
export async function verifyEmail(token: string) {
  const { data: subscription, error: selectError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("verification_token", token)
    .single();

  if (selectError || !subscription) {
    throw new Error("유효하지 않은 인증 토큰입니다.");
  }

  if (subscription.is_verified) {
    throw new Error("이미 인증된 이메일입니다.");
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      is_verified: true,
      verification_token: null,
      updated_at: new Date().toISOString(),
    })
    .eq("verification_token", token);

  if (error) {
    throw new Error(`이메일 인증 실패: ${error.message}`);
  }

  return { success: true, message: "이메일 인증이 완료되었습니다." };
}

// 구독 정보 조회
export async function getSubscription(email: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    throw new Error(`구독 정보 조회 실패: ${error.message}`);
  }

  return data;
}

// 구독 카테고리 업데이트
export async function updateSubscriptionCategories(
  email: string,
  categories: string[]
) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      subscribed_categories: categories,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email);

  if (error) {
    throw new Error(`구독 카테고리 업데이트 실패: ${error.message}`);
  }

  return { success: true, message: "구독 카테고리가 업데이트되었습니다." };
}

// 활성 구독자 목록 조회
export async function getActiveSubscriptions(limit = 100, offset = 0) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("is_active", true)
    .eq("is_verified", true)
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`구독자 목록 조회 실패: ${error.message}`);
  }

  return data || [];
}

// 구독 통계 조회
export async function getSubscriptionStats() {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("is_active, is_verified, subscribed_categories");

  if (error) {
    throw new Error(`구독 통계 조회 실패: ${error.message}`);
  }

  const stats = {
    total: data?.length || 0,
    active: data?.filter((s) => s.is_active).length || 0,
    verified: data?.filter((s) => s.is_verified).length || 0,
    unverified: data?.filter((s) => !s.is_verified).length || 0,
  };

  return stats;
}

// 인증 토큰 생성
function generateVerificationToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// 이메일 유효성 검사
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
