"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "./ImageUpload";
import ArticleEditor from "./ArticleEditor";
import { CATEGORIES } from "@/constants/categories";
import { REGIONS } from "@/constants/regions";

interface ArticleFormData {
  title: string;
  subtitle: string;
  content: string;
  category: string;
  region: string;
  tags: string[];
  featuredImage: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: "draft" | "published";
}

interface ArticleFormProps {
  initialData?: Partial<ArticleFormData>;
  isEditing?: boolean;
}

export default function ArticleForm({
  initialData,
  isEditing = false,
}: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ArticleFormData>({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    region: initialData?.region || "",
    tags: initialData?.tags || [],
    featuredImage: initialData?.featuredImage || "",
    location: {
      name: initialData?.location?.name || "",
      address: initialData?.location?.address || "",
      coordinates: initialData?.location?.coordinates,
    },
    status: initialData?.status || "draft",
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "내용을 입력해주세요.";
    }

    if (!formData.category) {
      newErrors.category = "카테고리를 선택해주세요.";
    }

    if (!formData.region) {
      newErrors.region = "지역을 선택해주세요.";
    }

    if (!formData.location.name.trim()) {
      newErrors["location.name"] = "장소명을 입력해주세요.";
    }

    if (!formData.location.address.trim()) {
      newErrors["location.address"] = "주소를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = { ...formData, status };

      // 실제 구현에서는 API 호출
      console.log("Submitting article:", submitData);

      // 임시 지연 (API 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/admin/articles");
    } catch (error) {
      console.error("Submit error:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
  };

  const handleTagRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "아티클 수정" : "새 아티클 작성"}
        </h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={isSubmitting}
          >
            임시저장
          </Button>
          <Button
            onClick={() => handleSubmit("published")}
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "발행하기"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
            <div className="space-y-4">
              <Input
                label="제목"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                error={errors.title}
                placeholder="아티클 제목을 입력하세요"
              />

              <Input
                label="부제목"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                placeholder="부제목을 입력하세요 (선택사항)"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">내용</h2>
            <ArticleEditor
              value={formData.content}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, content }))
              }
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Location Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">장소 정보</h2>
            <div className="space-y-4">
              <Input
                label="장소명"
                value={formData.location.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, name: e.target.value },
                  }))
                }
                error={errors["location.name"]}
                placeholder="예: 성수동 카페 온더코너"
              />

              <Input
                label="주소"
                value={formData.location.address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value },
                  }))
                }
                error={errors["location.address"]}
                placeholder="예: 서울 성동구 성수동1가 123-45"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">대표 이미지</h2>
            <ImageUpload
              value={formData.featuredImage}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, featuredImage: url }))
              }
              onRemove={() =>
                setFormData((prev) => ({ ...prev, featuredImage: "" }))
              }
            />
          </div>

          {/* Category & Region */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">분류</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                >
                  <option value="">카테고리 선택</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지역
                </label>
                <select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, region: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                >
                  <option value="">지역 선택</option>
                  {REGIONS.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="mt-1 text-sm text-red-600">{errors.region}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">태그</h2>
            <div className="space-y-3">
              <Input
                placeholder="태그를 입력하고 Enter를 누르세요"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleTagAdd(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(index)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
