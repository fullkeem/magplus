import ArticleForm from "@/components/admin/ArticleForm";

interface EditArticlePageProps {
  params: {
    id: string;
  };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  // 실제 구현에서는 ID로 아티클 데이터를 가져옴
  // 지금은 임시 데이터 사용
  const articleData = {
    title: "성수동 핫플레이스 베스트 5",
    subtitle: "트렌디한 성수동의 숨은 명소들을 소개합니다",
    content: `# 성수동 핫플레이스 베스트 5

성수동은 최근 몇 년간 **서울의 대표적인 핫플레이스**로 자리잡았습니다. 

## 1. 카페 온더코너
- 위치: 성수동1가 123-45
- 특징: 미니멀한 인테리어와 맛있는 커피

## 2. 갤러리 아트스페이스
- 위치: 성수동2가 67-89
- 특징: 독립 아티스트들의 작품 전시

*더 많은 정보는 직접 방문해서 확인해보세요!*`,
    category: "lifestyle",
    region: "seoul",
    tags: ["성수동", "핫플레이스", "카페", "갤러리"],
    featuredImage: "",
    location: {
      name: "성수동 일대",
      address: "서울 성동구 성수동",
    },
    status: "published" as const,
  };

  return <ArticleForm initialData={articleData} isEditing={true} />;
}
