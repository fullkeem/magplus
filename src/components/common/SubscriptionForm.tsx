"use client";

import { useState } from "react";
import { subscribe, isValidEmail } from "@/lib/supabase/subscriptions";
import { getCategories } from "@/lib/supabase/categories";
import { useEffect } from "react";
import type { Category } from "@/lib/database.types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface SubscriptionFormProps {
  className?: string;
  onSuccess?: () => void;
}

export default function SubscriptionForm({
  className = "",
  onSuccess,
}: SubscriptionFormProps) {
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await subscribe(email, selectedCategories);
      setSuccess(true);
      setEmail("");
      setSelectedCategories([]);
      onSuccess?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "구독 신청에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (success) {
    return (
      <div
        className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}
      >
        <div className="text-green-800">
          <h3 className="text-lg font-semibold mb-2">구독 신청 완료!</h3>
          <p className="text-sm">
            이메일로 인증 링크를 발송했습니다.
            <br />
            이메일을 확인하여 구독을 완료해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          MAG+ 뉴스레터 구독
        </h3>
        <p className="text-sm text-gray-600">
          최신 핫플레이스 정보를 이메일로 받아보세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          error={error}
          disabled={isSubmitting}
        />

        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              관심 카테고리 (선택사항)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                    disabled={isSubmitting}
                  />
                  <span className="text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "구독 신청 중..." : "구독하기"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          언제든지 구독을 해지할 수 있습니다.
        </p>
      </form>
    </div>
  );
}
