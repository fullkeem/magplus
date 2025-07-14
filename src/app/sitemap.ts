import { MetadataRoute } from "next";
import { getArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";

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
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/verify`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/unsubscribe`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  try {
    // 카테고리 페이지들
    const categories = await getCategories();
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(
        category.updated_at || category.created_at || new Date()
      ),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // 기사 페이지들
    const articles = await getArticles({ status: "published" });
    const articlePages = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.id}`,
      lastModified: new Date(
        article.updated_at || article.created_at || new Date()
      ),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...categoryPages, ...articlePages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
