import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/supabase/articles";
import ArticleDetailClient from "./ArticleDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return {
      title: "아티클을 찾을 수 없습니다 | MAG+",
    };
  }

  return {
    title: `${article.title} | MAG+`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images:
        article.images && article.images.length > 0 ? [article.images[0]] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return <ArticleDetailClient article={article} />;
}
