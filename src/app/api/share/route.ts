import { NextRequest, NextResponse } from "next/server";
import { recordShare } from "@/lib/supabase/shares";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { article_id, platform } = body;

    if (!article_id || !platform) {
      return NextResponse.json(
        { error: "article_id와 platform이 필요합니다." },
        { status: 400 }
      );
    }

    // 유효한 플랫폼 확인
    const validPlatforms = [
      "clipboard",
      "native",
      "kakao",
      "facebook",
      "twitter",
    ];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "유효하지 않은 플랫폼입니다." },
        { status: 400 }
      );
    }

    // 공유 기록
    await recordShare({
      article_id,
      platform,
    });

    return NextResponse.json({
      success: true,
      message: "공유가 기록되었습니다.",
    });
  } catch (error) {
    console.error("Share API error:", error);
    return NextResponse.json(
      { error: "공유 기록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
