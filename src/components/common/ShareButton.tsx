"use client";

import { useState } from "react";
import {
  ShareIcon,
  ClipboardIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useUI } from "@/hooks/useStores";
import Button from "@/components/ui/Button";

interface ShareButtonProps {
  articleId: string;
  title: string;
  excerpt?: string;
  url?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ShareButton({
  articleId,
  title,
  excerpt,
  url,
  className = "",
  variant = "outline",
  size = "md",
  showLabel = true,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const { showSuccess, showError } = useUI();

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const recordShareStat = async (platform: string) => {
    try {
      await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article_id: articleId,
          platform,
        }),
      });
    } catch (error) {
      console.error("Failed to record share stat:", error);
    }
  };

  const handleNativeShare = async () => {
    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: excerpt || title,
          url: shareUrl,
        });

        await recordShareStat("native");
        showSuccess("공유가 완료되었습니다!");
      } else {
        // 폴백: 클립보드 복사
        await handleClipboardCopy();
      }
    } catch (error: any) {
      // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
        showError("공유에 실패했습니다.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleClipboardCopy = async () => {
    setIsSharing(true);

    try {
      await navigator.clipboard.writeText(shareUrl);
      setJustCopied(true);

      await recordShareStat("clipboard");
      showSuccess("링크가 클립보드에 복사되었습니다!");

      // 2초 후 아이콘 원래대로 복귀
      setTimeout(() => {
        setJustCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      showError("링크 복사에 실패했습니다.");
    } finally {
      setIsSharing(false);
    }
  };

  const isNativeShareSupported =
    typeof window !== "undefined" && "share" in navigator;

  const handleShare = async () => {
    // 네이티브 공유 API가 지원되는 경우 우선 사용
    if (isNativeShareSupported) {
      await handleNativeShare();
    } else {
      // 폴백: 클립보드 복사
      await handleClipboardCopy();
    }
  };

  const getIcon = () => {
    if (justCopied) {
      return <CheckIcon className="h-4 w-4" aria-hidden="true" />;
    }

    if (isNativeShareSupported) {
      return <ShareIcon className="h-4 w-4" aria-hidden="true" />;
    }

    return <ClipboardIcon className="h-4 w-4" aria-hidden="true" />;
  };

  const getLabel = () => {
    if (justCopied) {
      return "복사됨!";
    }

    if (isNativeShareSupported) {
      return "공유";
    }

    return "링크 복사";
  };

  const getAriaLabel = () => {
    if (justCopied) {
      return "링크가 복사되었습니다";
    }

    if (isNativeShareSupported) {
      return `${title} 공유하기`;
    }

    return `${title} 링크 복사하기`;
  };

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      disabled={isSharing}
      loading={isSharing}
      className={`${className} ${
        justCopied ? "!text-green-600 !border-green-600" : ""
      }`}
      aria-label={getAriaLabel()}
    >
      {getIcon()}
      {showLabel && <span className="ml-2">{getLabel()}</span>}
    </Button>
  );
}
