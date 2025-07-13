import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";

export default function Footer() {
  return (
    <footer
      className="bg-black border-t border-gray-800 mt-20"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div
                className="w-8 h-8 bg-white flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-black font-bold text-sm">M</span>
              </div>
              <span className="text-2xl font-light text-white tracking-wide">
                MAG+
              </span>
            </div>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              서울의 가장 흥미로운 공간과 장소를 발견하는 미니멀 매거진입니다.
            </p>
          </div>

          {/* 카테고리 */}
          <div>
            <h3 className="text-sm font-light tracking-wide text-white mb-6 uppercase">
              카테고리
            </h3>
            <nav role="navigation" aria-label="푸터 카테고리 네비게이션">
              <ul className="space-y-3" role="list">
                {CATEGORIES.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-gray-300 hover:text-white transition-colors text-sm font-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 링크 */}
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

        {/* 하단 정보 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-xs font-light">
              © 2024 MAG+. 모든 권리 보유.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                aria-label="인스타그램에서 MAG+ 팔로우하기 (새 창에서 열림)"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.321-1.291c-.875-.802-1.366-1.927-1.366-3.196c0-1.297.49-2.448 1.291-3.321c.802-.875 1.927-1.366 3.196-1.366c1.297 0 2.448.49 3.321 1.291c.875.802 1.366 1.927 1.366 3.196c0 1.297-.49 2.448-1.291 3.321c-.802.875-1.927 1.366-3.196 1.366zm7.138 0c-1.297 0-2.448-.49-3.321-1.291c-.875-.802-1.366-1.927-1.366-3.196c0-1.297.49-2.448 1.291-3.321c.802-.875 1.927-1.366 3.196-1.366c1.297 0 2.448.49 3.321 1.291c.875.802 1.366 1.927 1.366 3.196c0 1.297-.49 2.448-1.291 3.321c-.802.875-1.927 1.366-3.196 1.366z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                aria-label="트위터에서 MAG+ 팔로우하기 (새 창에서 열림)"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="mailto:contact@magplus.com"
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1 py-1"
                aria-label="MAG+ 이메일로 문의하기"
              >
                <span className="sr-only">Email</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
