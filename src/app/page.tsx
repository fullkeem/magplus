"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CATEGORIES, type CategoryId } from "@/constants/categories";
import { useFilters } from "@/hooks/useStores";

export default function HomePage() {
  const { setCategory } = useFilters();

  const handleCategoryClick = (categoryId: CategoryId) => {
    setCategory(categoryId);
  };

  return (
    <div className="bg-white">
      {/* 히어로 섹션 */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-light text-black mb-8 tracking-tight">
              Discover Seoul's
              <br />
              <span className="italic">Hidden Gems</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              A curated collection of the city's most interesting cafes,
              restaurants, pop-up stores, and cultural spaces, updated weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/articles"
                className="inline-flex items-center px-8 py-3 border border-black text-sm font-light tracking-wide text-black bg-white hover:bg-black hover:text-white transition-all duration-200"
              >
                EXPLORE NOW
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/subscription"
                className="inline-flex items-center px-8 py-3 text-sm font-light tracking-wide text-gray-600 hover:text-black transition-colors"
              >
                SUBSCRIBE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light text-black mb-4 tracking-wide">
              Categories
            </h2>
            <p className="text-gray-600 font-light">Explore by type</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => handleCategoryClick(category.id)}
                className="group bg-white border border-gray-100 p-8 hover:bg-gray-50 transition-all duration-200 text-center"
              >
                <h3 className="text-sm font-light text-black group-hover:text-gray-600 transition-colors tracking-wide">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 아티클 섹션 */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-black mb-2 tracking-wide">
                Featured Places
              </h2>
              <p className="text-gray-600 font-light">
                This week's most interesting discoveries
              </p>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center text-black hover:text-gray-600 font-light text-sm tracking-wide"
            >
              VIEW ALL
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* 임시 아티클 카드들 - 실제로는 API에서 가져올 예정 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors"
              >
                <div className="aspect-video bg-gray-100"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-xs font-light tracking-wide text-gray-500 uppercase">
                      Cafe
                    </span>
                    <span className="ml-3 text-xs text-gray-400">Gangnam</span>
                  </div>
                  <h3 className="text-lg font-light text-black mb-3 tracking-wide">
                    Sample Article Title {i}
                  </h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed mb-4">
                    This is a wonderful place with amazing interior design and
                    great atmosphere...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-400 space-x-4">
                      <span>1,234 views</span>
                      <span>89 likes</span>
                    </div>
                    <Link
                      href={`/articles/${i}`}
                      className="text-black hover:text-gray-600 font-light text-xs tracking-wide"
                    >
                      READ MORE
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 구독 유도 섹션 */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="border border-gray-200 p-12 md:p-16">
            <h2 className="text-2xl md:text-3xl font-light text-black mb-6 tracking-wide">
              Stay Updated
            </h2>
            <p className="text-gray-600 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
              Get weekly updates on Seoul's most interesting new places, curated
              by our editorial team.
            </p>

            <div className="border border-gray-200 p-1 max-w-md mx-auto mb-6">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 text-black placeholder-gray-400 focus:outline-none font-light text-sm"
                />
                <button className="px-6 py-3 bg-black text-white font-light text-sm tracking-wide hover:bg-gray-800 transition-colors">
                  SUBSCRIBE
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-light tracking-wide">
              Free subscription • Unsubscribe anytime • No spam
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
