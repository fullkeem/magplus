import type { Metadata } from "next";
import { getAllArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory, Category } from "@/lib/database.types";
import Link from "next/link";
import Image from "next/image";
import SubscriptionForm from "@/components/common/SubscriptionForm";

export const metadata: Metadata = {
  title: "MAG+ | MZ세대를 위한 핫플레이스 웹매거진",
  description:
    "서울의 숨겨진 보석들을 발견하는 프리미엄 라이프스타일 매거진. 트렌디한 카페부터 숨겨진 갤러리까지, 도시의 새로운 문화를 선도하는 공간들의 이야기",
  keywords: [
    "핫플레이스",
    "카페",
    "맛집",
    "팝업스토어",
    "문화공간",
    "MZ세대",
    "웹매거진",
    "서울",
    "라이프스타일",
  ],
  authors: [{ name: "MAG+ Team" }],
  openGraph: {
    title: "MAG+ | MZ세대를 위한 핫플레이스 웹매거진",
    description: "서울의 숨겨진 보석들을 발견하는 프리미엄 라이프스타일 매거진",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAG+ | MZ세대를 위한 핫플레이스 웹매거진",
    description: "서울의 숨겨진 보석들을 발견하는 프리미엄 라이프스타일 매거진",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  // 서버에서 데이터 로딩
  const [articles, categories] = await Promise.all([
    getAllArticles(),
    getCategories(),
  ]);

  // 카테고리 중복 제거 및 필터링
  const uniqueCategories = categories.filter(
    (category, index, self) =>
      index === self.findIndex((c) => c.name === category.name)
  );

  // 최신 아티클 (최대 6개)
  const latestArticles = articles
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  // 인기 아티클 (조회수 기준, 최대 3개)
  const popularArticles = articles
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  // 구조화된 데이터 (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MAG+",
    description: "MZ세대를 위한 핫플레이스 웹매거진",
    url: "/",
    publisher: {
      "@type": "Organization",
      name: "MAG+",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
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
      <div className="min-h-screen bg-white">
        {/* 히어로 섹션 */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 py-32 lg:py-40">
            <div className="text-center">
              <div className="mb-12">
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-extralight text-white mb-6 tracking-[0.02em] leading-none">
                  MAG
                  <span className="relative">
                    <span className="text-white">+</span>
                    <div className="absolute -top-3 -right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </span>
                </h1>
                <div className="w-16 h-px bg-white mx-auto opacity-40"></div>
              </div>

              <p className="text-xl md:text-2xl text-gray-200 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
                서울의 숨겨진 보석들을 발견하는 프리미엄 라이프스타일 매거진
              </p>

              <p className="text-base text-gray-300 mb-16 max-w-xl mx-auto leading-relaxed">
                트렌디한 카페부터 숨겨진 갤러리까지, 도시의 새로운 문화를
                선도하는 공간들의 이야기
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/articles"
                  className="group inline-flex items-center px-10 py-4 bg-white text-black rounded-full hover:bg-gray-50 transition-all duration-300 font-medium text-sm tracking-wide"
                >
                  아티클 탐색하기
                </Link>

                <Link
                  href="/categories"
                  className="group inline-flex items-center px-10 py-4 border border-white/20 text-white rounded-full hover:bg-white/5 transition-all duration-300 font-medium text-sm tracking-wide backdrop-blur-sm"
                >
                  카테고리 둘러보기
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" className="w-full h-16 fill-white">
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
            </svg>
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extralight text-black mb-8 tracking-wide">
                카테고리
              </h2>
              <p className="text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
                관심 있는 분야를 선택해서 더 깊이 있는 이야기를 만나보세요
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {uniqueCategories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group block text-center p-8 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300"
                >
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 최신 아티클 섹션 */}
        {latestArticles.length > 0 && (
          <section className="py-24 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-extralight text-black mb-6 tracking-wide">
                    최신 아티클
                  </h2>
                  <p className="text-lg text-gray-600 font-light max-w-lg leading-relaxed">
                    방금 업데이트된 새로운 이야기들을 가장 먼저 만나보세요
                  </p>
                </div>
                <Link
                  href="/articles"
                  className="hidden md:inline-flex items-center text-gray-700 hover:text-black transition-colors font-medium text-sm tracking-wide"
                >
                  모든 아티클 보기
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {latestArticles.map((article) => (
                  <article key={article.id} className="group">
                    <Link href={`/articles/${article.id}`}>
                      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500">
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                          {article.images && article.images.length > 0 ? (
                            <Image
                              src={article.images[0]}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <span className="text-gray-400 text-sm font-light">
                                이미지 준비중
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-8">
                          <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-wider mb-4">
                            <span className="px-3 py-1 bg-gray-100 rounded-full">
                              {article.category?.name}
                            </span>
                            {article.region && (
                              <span className="px-3 py-1 bg-gray-100 rounded-full">
                                {article.region}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-light text-black mb-4 group-hover:text-gray-700 transition-colors line-clamp-2 leading-relaxed">
                            {article.title}
                          </h3>

                          {article.excerpt && (
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>조회수 {article.views || 0}</span>
                            <span className="font-light">
                              {new Date(
                                article.created_at || ""
                              ).toLocaleDateString("ko-KR", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              <div className="text-center mt-16 md:hidden">
                <Link
                  href="/articles"
                  className="inline-flex items-center px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-sm tracking-wide"
                >
                  모든 아티클 보기
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 인기 아티클 섹션 */}
        {popularArticles.length > 0 && (
          <section className="py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-extralight text-black mb-8 tracking-wide">
                  인기 아티클
                </h2>
                <p className="text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
                  가장 많은 사람들이 선택한 특별한 이야기들
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {popularArticles.map((article, index) => (
                  <article key={article.id} className="group relative">
                    <div className="absolute -top-6 -left-6 z-10">
                      <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-light text-lg">
                        {index + 1}
                      </div>
                    </div>

                    <Link href={`/articles/${article.id}`}>
                      <div className="bg-gray-50 rounded-2xl overflow-hidden hover:bg-gray-100 transition-all duration-500 pt-8">
                        <div className="p-8">
                          <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-wider mb-4">
                            <span className="px-3 py-1 bg-white/80 rounded-full">
                              {article.category?.name}
                            </span>
                            {article.region && (
                              <span className="px-3 py-1 bg-white/80 rounded-full">
                                {article.region}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-light text-black mb-4 group-hover:text-gray-700 transition-colors line-clamp-2 leading-relaxed">
                            {article.title}
                          </h3>

                          {article.excerpt && (
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>조회수 {article.views || 0}</span>
                            <span className="font-light">
                              {new Date(
                                article.created_at || ""
                              ).toLocaleDateString("ko-KR", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 구독 섹션 */}
        <section className="relative py-32 bg-gradient-to-r from-black via-gray-900 to-black overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-8 tracking-wide">
              새로운 이야기를 놓치지 마세요
            </h2>
            <p className="text-lg text-gray-200 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
              매주 엄선된 서울의 새로운 공간들과 특별한 이야기들을 이메일로
              받아보세요
            </p>

            <div className="max-w-md mx-auto">
              <SubscriptionForm />
            </div>

            <p className="text-sm text-gray-400 mt-8 font-light">
              언제든지 구독을 해지할 수 있습니다. 스팸은 절대 보내지 않습니다.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
