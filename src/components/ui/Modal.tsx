"use client";

import { ReactNode, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 포커스 트래핑을 위한 포커스 가능한 요소들 찾기
  const getFocusableElements = () => {
    if (!modalRef.current) return [];

    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
      "[contenteditable]",
    ].join(", ");

    return Array.from(
      modalRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  };

  useEffect(() => {
    if (isOpen) {
      // 현재 포커스된 요소 저장
      previousFocusRef.current = document.activeElement as HTMLElement;

      // 모달이 열릴 때 첫 번째 포커스 가능한 요소에 포커스
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else if (modalRef.current) {
        modalRef.current.focus();
      }

      // 스크롤 방지
      document.body.style.overflow = "hidden";
      document.body.setAttribute("aria-hidden", "true");
    } else {
      // 모달이 닫힐 때 원래 포커스 복원
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      document.body.style.overflow = "unset";
      document.body.removeAttribute("aria-hidden");
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.removeAttribute("aria-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // ESC 키로 모달 닫기
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
        return;
      }

      // TAB 키로 포커스 트래핑
      if (e.key === "Tab") {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab (뒤로)
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab (앞으로)
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby="modal-content"
    >
      {/* 오버레이 */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* 모달 컨텐츠 */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-none shadow-2xl mx-4 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto focus:outline-none`}
        tabIndex={-1}
        role="document"
      >
        {/* 헤더 */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2
              id="modal-title"
              className="text-xl font-light text-black tracking-wide"
            >
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm min-h-[44px] min-w-[44px]"
                aria-label="모달 닫기"
                type="button"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* 닫기 버튼 (타이틀이 없는 경우) */}
        {!title && showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm min-h-[44px] min-w-[44px]"
            aria-label="모달 닫기"
            type="button"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        {/* 바디 */}
        <div id="modal-content" className={title ? "p-6" : "p-6 pt-12"}>
          {children}
        </div>
      </div>
    </div>
  );
}
