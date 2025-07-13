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

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-sm p-4 border shadow-lg transition-all duration-300 ease-in-out
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
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-light">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-current hover:opacity-70 transition-opacity"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
