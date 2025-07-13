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
    // 이미 구독된 경우 카테고리 업데이트
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        is_active: true,
        subscribed_categories: categories,
        unsubscribed_at: null,
      })
      .eq("email", email)
      .select()
      .single();

    if (error) {
      console.error("Error updating subscription:", error);
      throw new Error("구독 업데이트에 실패했습니다.");
    }

    return data as Subscription;
  } else {
    // 새로운 구독 생성
    const verificationToken = generateVerificationToken();

    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        email,
        subscribed_categories: categories,
        verification_token: verificationToken,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating subscription:", error);
      throw new Error("구독 신청에 실패했습니다.");
    }

    // 실제 구현에서는 이메일 인증 메일 발송
    // await sendVerificationEmail(email, verificationToken);

    return data as Subscription;
  }
}

// 구독 해지
export async function unsubscribe(email: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("email", email)
    .select()
    .single();

  if (error) {
    console.error("Error unsubscribing:", error);
    throw new Error("구독 해지에 실패했습니다.");
  }

  return data as Subscription;
}

// 이메일 인증
export async function verifyEmail(token: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      is_verified: true,
      verified_at: new Date().toISOString(),
      verification_token: null,
    })
    .eq("verification_token", token)
    .select()
    .single();

  if (error) {
    console.error("Error verifying email:", error);
    throw new Error("이메일 인증에 실패했습니다.");
  }

  return data as Subscription;
}

// 구독 정보 조회
export async function getSubscription(email: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }

  return data as Subscription;
}

// 구독 카테고리 업데이트
export async function updateSubscriptionCategories(
  email: string,
  categories: string[]
) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      subscribed_categories: categories,
    })
    .eq("email", email)
    .select()
    .single();

  if (error) {
    console.error("Error updating subscription categories:", error);
    throw new Error("구독 카테고리 업데이트에 실패했습니다.");
  }

  return data as Subscription;
}

// 활성 구독자 목록 조회 (관리자용)
export async function getActiveSubscriptions(limit = 100, offset = 0) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("is_active", true)
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching active subscriptions:", error);
    throw new Error("구독자 목록을 불러오는데 실패했습니다.");
  }

  return data as Subscription[];
}

// 구독 통계 조회 (관리자용)
export async function getSubscriptionStats() {
  const { data: totalSubs, error: totalError } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true });

  const { data: activeSubs, error: activeError } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const { data: verifiedSubs, error: verifiedError } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", true);

  if (totalError || activeError || verifiedError) {
    console.error("Error fetching subscription stats");
    throw new Error("구독 통계를 불러오는데 실패했습니다.");
  }

  return {
    total: totalSubs?.length || 0,
    active: activeSubs?.length || 0,
    verified: verifiedSubs?.length || 0,
  };
}

// 인증 토큰 생성 함수
function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 이메일 유효성 검사
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
