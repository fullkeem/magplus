import { supabase } from "./client";
import type { Share, ShareInsert } from "../database.types";

// 공유 기록 생성
export async function recordShare(shareData: {
  article_id: string;
  platform: string;
  anonymous_id?: string;
  referrer?: string;
  user_agent?: string;
}) {
  const { data, error } = await supabase
    .from("shares")
    .insert({
      ...shareData,
      shared_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error recording share:", error);
    throw new Error("공유 기록 생성에 실패했습니다.");
  }

  return data as Share;
}

// 아티클별 공유 통계 조회
export async function getShareStats(articleId: string) {
  const { data, error } = await supabase
    .from("article_total_shares")
    .select("*")
    .eq("article_id", articleId)
    .single();

  if (error) {
    console.error("Error fetching share stats:", error);
    return {
      total_shares: 0,
      platforms_count: 0,
    };
  }

  return data;
}

// 플랫폼별 공유 통계 조회
export async function getShareStatsByPlatform(articleId: string) {
  const { data, error } = await supabase
    .from("article_share_stats")
    .select("*")
    .eq("article_id", articleId)
    .order("share_count", { ascending: false });

  if (error) {
    console.error("Error fetching share stats by platform:", error);
    return [];
  }

  return data;
}

// 전체 공유 통계 조회 (관리자용)
export async function getAllShareStats(limit = 10) {
  const { data, error } = await supabase
    .from("article_total_shares")
    .select(
      `
      *,
      article:articles(title, slug)
    `
    )
    .order("total_shares", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching all share stats:", error);
    return [];
  }

  return data;
}

// 익명 ID 생성 (클라이언트 식별용)
export function generateAnonymousId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

// 공유 URL 생성
export function generateShareUrl(
  articleSlug: string,
  platform: string,
  baseUrl = typeof window !== "undefined" ? window.location.origin : ""
): string {
  const articleUrl = `${baseUrl}/articles/${articleSlug}`;

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        articleUrl
      )}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        articleUrl
      )}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        articleUrl
      )}`;
    case "kakao":
      // Kakao Share는 별도 SDK 필요
      return articleUrl;
    case "line":
      return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        articleUrl
      )}`;
    default:
      return articleUrl;
  }
}

// 클립보드에 URL 복사
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
