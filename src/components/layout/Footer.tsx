import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 섹션 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">M</span>
              </div>
              <span className="text-2xl font-light tracking-wide">MAG+</span>
            </div>
            <p className="text-gray-300 text-sm font-light leading-relaxed max-w-md">
              한국의 다양한 문화와 라이프스타일을 소개하는 웹 매거진입니다.
              카페, 레스토랑, 팝업스토어, 전시회 등 흥미로운 공간과 경험을
              발견해보세요.
            </p>
          </div>

          {/* 네비게이션 */}
          <div>
            <h3 className="text-sm font-light tracking-wide text-white mb-6 uppercase">
              탐색
            </h3>
            <nav role="navigation" aria-label="푸터 네비게이션">
              <ul className="space-y-3" role="list">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                  >
                    아티클
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                  >
                    검색
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* 정보 */}
          <div>
            <h3 className="text-sm font-light tracking-wide text-white mb-6 uppercase">
              정보
            </h3>
            <nav role="navigation" aria-label="푸터 정보 네비게이션">
              <ul className="space-y-3" role="list">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                  >
                    매거진 소개
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                  >
                    문의하기
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subscribe"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                  >
                    구독하기
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-white transition-colors text-sm font-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                  >
                    개인정보 처리방침
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm font-light">
            © 2024 MAG+. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
