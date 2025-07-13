import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">M</span>
              </div>
              <span className="text-2xl font-light text-white tracking-wide">
                MAG+
              </span>
            </div>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              A minimal magazine for discovering Seoul's most interesting spaces
              and places.
            </p>
          </div>

          {/* 카테고리 */}
          <div>
            <h3 className="text-sm font-light tracking-wide text-white mb-6 uppercase">
              Categories
            </h3>
            <ul className="space-y-3">
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm font-light"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 링크 */}
          <div>
            <h3 className="text-sm font-light tracking-wide text-white mb-6 uppercase">
              Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/articles"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-light"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/subscription"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-light"
                >
                  Subscribe
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-xs font-light tracking-wide">
            © 2024 MAG+. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
