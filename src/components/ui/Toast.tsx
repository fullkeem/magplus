"use client";

import { useEffect } from "react";
import { useUI } from "@/hooks/useStores";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Toast() {
  const { toasts, removeToast } = useUI();

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration !== 0) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration || 5000);
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getAriaLabel = (type: string) => {
    switch (type) {
      case "success":
        return "성공 알림";
      case "error":
        return "오류 알림";
      case "warning":
        return "경고 알림";
      default:
        return "정보 알림";
    }
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2"
      role="region"
      aria-label="알림 메시지"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-sm p-4 border shadow-lg transition-all duration-300 ease-in-out flex items-start space-x-3 min-h-[64px]
            ${
              toast.type === "success"
                ? "bg-white border-gray-200 text-gray-900"
                : ""
            }
            ${toast.type === "error" ? "bg-black border-black text-white" : ""}
            ${
              toast.type === "warning"
                ? "bg-gray-100 border-gray-300 text-gray-900"
                : ""
            }
            ${
              toast.type === "info"
                ? "bg-gray-50 border-gray-200 text-gray-900"
                : ""
            }
          `}
          role="alert"
          aria-label={getAriaLabel(toast.type)}
          aria-describedby={`toast-message-${toast.id}`}
        >
          {/* 아이콘 */}
          <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
            {getToastIcon(toast.type)}
          </div>

          {/* 메시지 */}
          <div className="flex-1 min-w-0">
            <p
              id={`toast-message-${toast.id}`}
              className="text-sm font-light break-words"
            >
              {toast.message}
            </p>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-current hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 rounded-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`${getAriaLabel(toast.type)} 닫기`}
            type="button"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
