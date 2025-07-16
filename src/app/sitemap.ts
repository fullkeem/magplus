import { getAllArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mag-plus.com";

  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/subscribe`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];

  try {
    // 동적 페이지들
    const [articles, categories] = await Promise.all([
      getAllArticles(),
      getCategories(),
    ]);

    // 아티클 페이지들
    const articlePages = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.id}`,
      lastModified: article.updated_at
        ? new Date(article.updated_at)
        : new Date(article.created_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // 카테고리 페이지들
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...articlePages, ...categoryPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
