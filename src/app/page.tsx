import type { Metadata } from "next";
import { getAllArticles } from "@/lib/supabase/articles";
import { getCategories } from "@/lib/supabase/categories";
import type { ArticleWithCategory, Category } from "@/lib/database.types";
import Link from "next/link";
import Image from "next/image";

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
        <section className="relative bg-white" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-8 sm:pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-black mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight">
                Discover Seoul's
                <br />
                <span className="italic">Hidden Gems</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-3xl mx-auto font-light leading-relaxed px-2">
                서울의 가장 흥미로운 카페, 레스토랑, 팝업스토어, 문화공간을
                큐레이션하여 매주 업데이트합니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto px-4">
                <Link
                  href="/articles"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-black text-sm sm:text-base font-light tracking-wide text-black bg-white hover:bg-black hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 min-h-[48px]"
                  aria-label="모든 아티클 보기"
                >
                  Explore Articles
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="ml-2 h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>

                <Link
                  href="#newsletter"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-light tracking-wide text-gray-600 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[48px]"
                  aria-label="뉴스레터 구독하기"
                >
                  Subscribe to Newsletter
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 카테고리 섹션 */}
        <section
          className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50"
          role="region"
          aria-labelledby="categories-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h2
                id="categories-heading"
                className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-3 sm:mb-4 tracking-wide"
              >
                Categories
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-light">
                관심 있는 카테고리를 탐색해보세요
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {uniqueCategories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group bg-white p-3 sm:p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] flex flex-col justify-center items-center transform hover:scale-105 hover:-translate-y-1"
                  aria-label={`${category.name} 카테고리 보기`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  >
                    {category.name === "카페"}
                    {category.name === "레스토랑"}
                    {category.name === "팝업스토어"}
                    {category.name === "문화공간"}
                    {category.name === "쇼핑"}
                    {category.name === "전시회"}
                    {
                      ![
                        "카페",
                        "레스토랑",
                        "팝업스토어",
                        "문화공간",
                        "쇼핑",
                        "전시회",
                      ].includes(category.name)
                    }
                  </div>
                  <h3 className="text-xs sm:text-sm font-light text-black group-hover:text-gray-600 transition-colors tracking-wide">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 최신 아티클 섹션 */}
        {latestArticles.length > 0 && (
          <section
            className="py-8 sm:py-12 md:py-16 lg:py-20"
            role="region"
            aria-labelledby="latest-heading"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-12 gap-4">
                <div>
                  <h2
                    id="latest-heading"
                    className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-2 tracking-wide"
                  >
                    Latest Articles
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 font-light">
                    가장 최근에 발행된 아티클들을 확인해보세요
                  </p>
                </div>
                <Link
                  href="/articles"
                  className="inline-flex items-center text-sm font-light text-gray-600 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-sm px-2 py-1"
                  aria-label="모든 아티클 보기"
                >
                  View All
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="ml-1 h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {latestArticles.map((article) => (
                  <article
                    key={article.id}
                    className="group bg-white border border-gray-100 hover:shadow-lg transition-all duration-200"
                  >
                    <Link
                      href={`/articles/${article.id}`}
                      className="block focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                      aria-label={`${article.title} 아티클 읽기`}
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        {article.images && article.images.length > 0 ? (
                          <Image
                            src={article.images[0]}
                            alt={`${article.title} 대표 이미지`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400 text-sm">
                              이미지 준비중
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="flex items-center text-xs text-gray-500 mb-2 font-light">
                          <span aria-hidden="true">
                            {article.category?.name === "카페" && "☕"}
                            {article.category?.name === "레스토랑" && "🍽️"}
                            {article.category?.name === "팝업스토어" && "📍"}
                            {article.category?.name === "문화공간" && "🎭"}
                            {article.category?.name === "쇼핑" && "🛍️"}
                            {article.category?.name === "전시회" && "🎨"}
                            {![
                              "카페",
                              "레스토랑",
                              "팝업스토어",
                              "문화공간",
                              "쇼핑",
                              "전시회",
                            ].includes(article.category?.name || "") && "📍"}
                          </span>
                          <span className="ml-1">{article.category?.name}</span>
                          <span className="mx-2" aria-hidden="true">
                            •
                          </span>
                          <time dateTime={article.created_at || ""}>
                            {new Date(
                              article.created_at || ""
                            ).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            })}
                          </time>
                        </div>

                        <h3 className="text-base sm:text-lg md:text-xl font-light text-black mb-2 group-hover:text-gray-600 transition-colors tracking-wide line-clamp-2">
                          {article.title}
                        </h3>

                        {article.excerpt && (
                          <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-3">
                            <span aria-label={`조회수 ${article.views || 0}회`}>
                              👁 {article.views || 0}
                            </span>
                          </div>
                          <span
                            className="truncate max-w-[120px]"
                            title={article.region || "서울"}
                          >
                            📍 {article.region || "서울"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 인기 아티클 섹션 */}
        {popularArticles.length > 0 && (
          <section
            className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50"
            role="region"
            aria-labelledby="popular-heading"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6 sm:mb-8 md:mb-12">
                <h2
                  id="popular-heading"
                  className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-2 tracking-wide"
                >
                  인기 아티클
                </h2>
                <p className="text-sm sm:text-base text-gray-600 font-light">
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

                    <Link
                      href={`/articles/${article.id}`}
                      className="block focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                      aria-label={`인기 아티클 ${index + 1}위: ${
                        article.title
                      } 읽기`}
                    >
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
                            <span aria-label={`조회수 ${article.views || 0}회`}>
                              조회수 {article.views || 0}
                            </span>
                            <time
                              dateTime={article.created_at || ""}
                              className="font-light"
                            >
                              {new Date(
                                article.created_at || ""
                              ).toLocaleDateString("ko-KR", {
                                month: "short",
                                day: "numeric",
                              })}
                            </time>
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
      </div>
    </>
  );
}
