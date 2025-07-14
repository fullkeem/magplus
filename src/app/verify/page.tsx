"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/supabase/subscriptions";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("인증 토큰이 없습니다.");
      return;
    }

    handleVerification(token);
  }, [searchParams]);

  const handleVerification = async (token: string) => {
    try {
      await verifyEmail(token);
      setStatus("success");
      setMessage("이메일 인증이 완료되었습니다! 환영 이메일을 확인해주세요.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "인증에 실패했습니다."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">이메일 인증</h1>

          {status === "loading" && (
            <div className="flex flex-col items-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">인증을 처리하고 있습니다...</p>
            </div>
          )}

          {status === "success" && (
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
              <Button
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                홈으로 이동
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-600 mb-6">{message}</p>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="w-full"
              >
                홈으로 돌아가기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
