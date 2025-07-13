"use client";

import { useState, useRef } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

interface ArticleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ArticleEditor({
  value,
  onChange,
  placeholder = "아티클 내용을 작성하세요...",
  className = "",
}: ArticleEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatButtons = [
    {
      icon: BoldIcon,
      title: "굵게",
      action: () => insertText("**", "**"),
    },
    {
      icon: ItalicIcon,
      title: "기울임",
      action: () => insertText("*", "*"),
    },
    {
      icon: UnderlineIcon,
      title: "밑줄",
      action: () => insertText("<u>", "</u>"),
    },
    {
      icon: ListBulletIcon,
      title: "글머리 기호",
      action: () => insertText("\n- ", ""),
    },
    {
      icon: NumberedListIcon,
      title: "번호 목록",
      action: () => insertText("\n1. ", ""),
    },
    {
      icon: LinkIcon,
      title: "링크",
      action: () => insertText("[", "](https://)"),
    },
    {
      icon: PhotoIcon,
      title: "이미지",
      action: () => insertText("![", "](이미지_URL)"),
    },
  ];

  const renderPreview = (text: string) => {
    // 간단한 마크다운 렌더링
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li>$1. $2</li>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank">$1</a>'
      )
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />'
      )
      .replace(/\n/g, "<br>");
  };

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2">
        <div className="flex items-center space-x-1">
          {formatButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              title={button.title}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
            >
              <button.icon className="h-4 w-4 text-gray-600" />
            </button>
          ))}

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              isPreview
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isPreview ? "편집" : "미리보기"}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-[400px]">
        {isPreview ? (
          <div
            className="p-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[400px] p-4 border-none resize-none focus:outline-none"
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 bg-gray-50 px-4 py-2">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            마크다운 문법을 지원합니다. **굵게**, *기울임*, [링크](URL),
            ![이미지](URL)
          </div>
          <div>{value.length} 글자</div>
        </div>
      </div>
    </div>
  );
}
