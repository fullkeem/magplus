"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { unsubscribe } from "@/lib/supabase/subscriptions";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("이메일을 입력해주세요.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await unsubscribe(email);
      setStatus("success");
      setMessage("구독이 성공적으로 해지되었습니다.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "구독 해지에 실패했습니다."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">구독 해지</h1>
          <p className="text-gray-600">
            K-웹매거진 뉴스레터 구독을 해지하시겠습니까?
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-green-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-4">
              언제든지 다시 구독하실 수 있습니다.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              홈으로 이동
            </Button>
          </div>
        ) : (
          <form onSubmit={handleUnsubscribe} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                이메일 주소
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
                required
                disabled={status === "loading"}
              />
            </div>

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{message}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="flex-1"
                disabled={status === "loading"}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <div className="flex items-center">
                    <LoadingSpinner />
                    <span className="ml-2">처리 중...</span>
                  </div>
                ) : (
                  "구독 해지"
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            문의사항이 있으시면 언제든지 연락해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
