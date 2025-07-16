import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import { CATEGORIES } from "@/constants/categories";
import CategoryPageClient from "./CategoryPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const categories = await getCategories();
    const category = categories.find((cat) => cat.slug === slug);

    if (!category) {
      return {
        title: "카테고리를 찾을 수 없습니다 | MAG+",
        description: "요청하신 카테고리를 찾을 수 없습니다.",
      };
    }

    const categoryInfo = CATEGORIES.find((cat) => cat.slug === slug);
    const title = `${category.name} | MAG+`;
    const description = `${category.name} 카테고리의 최신 핫플레이스와 트렌드를 확인해보세요. MAG+에서 큐레이션한 ${category.name} 관련 아티클들을 만나보세요.`;

    return {
      title,
      description,
      keywords: [
        category.name,
        "핫플레이스",
        "MAG+",
        "웹매거진",
        "서울",
        "트렌드",
      ],
      authors: [{ name: "MAG+ Team" }],
      openGraph: {
        title,
        description,
        type: "website",
        locale: "ko_KR",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      alternates: {
        canonical: `/categories/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "카테고리를 찾을 수 없습니다 | MAG+",
      description: "요청하신 카테고리를 찾을 수 없습니다.",
    };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  try {
    const categories = await getCategories();
    const category = categories.find((cat) => cat.slug === slug);

    if (!category) {
      notFound();
    }

    const articles = await getAllArticles();

    // 구조화된 데이터 (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${category.name} - MAG+`,
      description: `${category.name} 카테고리의 최신 핫플레이스와 트렌드`,
      url: `/categories/${slug}`,
      publisher: {
        "@type": "Organization",
        name: "MAG+",
        logo: {
          "@type": "ImageObject",
          url: "/logo.png",
        },
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: articles.length,
        itemListElement: articles.map((article: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Article",
            headline: article.title,
            description: article.excerpt || article.title,
            image:
              article.images && article.images.length > 0
                ? article.images[0]
                : undefined,
            datePublished: article.created_at,
            author: {
              "@type": "Organization",
              name: "MAG+ Team",
            },
          },
        })),
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
        <CategoryPageClient category={category} articles={articles} />
      </>
    );
  } catch (error) {
    console.error("Error loading category data:", error);
    notFound();
  }
}
