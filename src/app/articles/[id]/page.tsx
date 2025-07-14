import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/supabase/articles";
import ArticleDetailClient from "./ArticleDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const article = await getArticle(id);

    if (!article) {
      return {
        title: "기사를 찾을 수 없습니다 | MAG+",
        description: "요청하신 기사를 찾을 수 없습니다.",
      };
    }

    const title = `${article.title} | MAG+`;
    const description = article.excerpt || article.title;
    const images =
      article.images && article.images.length > 0 ? [article.images[0]] : [];

    return {
      title,
      description,
      keywords: [
        article.title,
        article.category?.name || "",
        article.region || "",
        "핫플레이스",
        "MAG+",
        "웹매거진",
      ].filter(Boolean),
      authors: [{ name: "MAG+ Team" }],
      openGraph: {
        title,
        description,
        type: "article",
        locale: "ko_KR",
        images,
        publishedTime: article.created_at || undefined,
        modifiedTime: article.updated_at || undefined,
        tags: [article.category?.name || "", article.region || ""].filter(
          Boolean
        ),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images,
      },
      alternates: {
        canonical: `/articles/${id}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "기사를 찾을 수 없습니다 | MAG+",
      description: "요청하신 기사를 찾을 수 없습니다.",
    };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;

  try {
    const article = await getArticle(id);

    if (!article) {
      notFound();
    }

    // 구조화된 데이터 (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt || article.title,
      image:
        article.images && article.images.length > 0
          ? article.images
          : undefined,
      datePublished: article.created_at,
      dateModified: article.updated_at || article.created_at,
      author: {
        "@type": "Organization",
        name: "MAG+ Team",
      },
      publisher: {
        "@type": "Organization",
        name: "MAG+",
        logo: {
          "@type": "ImageObject",
          url: "/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `/articles/${id}`,
      },
      articleSection: article.category?.name,
      keywords: [
        article.title,
        article.category?.name || "",
        article.region || "",
        "핫플레이스",
        "MAG+",
      ]
        .filter(Boolean)
        .join(", "),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <ArticleDetailClient article={article} />
      </>
    );
  } catch (error) {
    console.error("Error loading article:", error);
    notFound();
  }
}
