import { Metadata } from "next";
import ArticlesPageClient from "./ArticlesPageClient";

export const metadata: Metadata = {
  title: "모든 아티클 | MAG+",
  description:
    "MAG+에서 큐레이션한 모든 핫플레이스 아티클을 확인해보세요. 서울의 트렌디한 카페, 레스토랑, 팝업스토어, 문화공간 정보를 한눈에 만나보세요.",
  keywords: [
    "핫플레이스",
    "아티클",
    "MAG+",
    "웹매거진",
    "서울",
    "카페",
    "레스토랑",
    "팝업스토어",
    "문화공간",
  ],
  authors: [{ name: "MAG+ Team" }],
  openGraph: {
    title: "모든 아티클 | MAG+",
    description: "MAG+에서 큐레이션한 모든 핫플레이스 아티클을 확인해보세요.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "모든 아티클 | MAG+",
    description: "MAG+에서 큐레이션한 모든 핫플레이스 아티클을 확인해보세요.",
  },
  alternates: {
    canonical: "/articles",
  },
};

export default function ArticlesPage() {
  // 구조화된 데이터 (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "모든 아티클 - MAG+",
    description: "MAG+에서 큐레이션한 모든 핫플레이스 아티클",
    url: "/articles",
    publisher: {
      "@type": "Organization",
      name: "MAG+",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ArticlesPageClient />
    </>
  );
}
