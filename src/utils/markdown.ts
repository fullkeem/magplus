/**
 * 마크다운 텍스트를 plain text로 변환하는 유틸리티 함수
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return "";

  return (
    markdown
      // 제목 제거 (# ## ###)
      .replace(/^#{1,6}\s+/gm, "")
      // 볼드/이탤릭 제거 (**text** *text*)
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      // 링크 제거 [text](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // 인라인 코드 제거 `code`
      .replace(/`([^`]+)`/g, "$1")
      // 리스트 마커 제거 (- * +)
      .replace(/^[\s]*[-*+]\s+/gm, "")
      // 번호 리스트 제거 (1. 2. 3.)
      .replace(/^[\s]*\d+\.\s+/gm, "")
      // 블록 인용 제거 (>)
      .replace(/^>\s+/gm, "")
      // 여러 줄바꿈을 하나로 변환
      .replace(/\n\s*\n/g, "\n")
      // 앞뒤 공백 제거
      .trim()
  );
}

/**
 * 마크다운 텍스트를 지정된 길이로 자르는 함수
 */
export function truncateMarkdown(
  markdown: string,
  maxLength: number = 150
): string {
  const plainText = stripMarkdown(markdown);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + "...";
}
