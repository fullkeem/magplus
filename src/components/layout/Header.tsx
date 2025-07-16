"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useFilters, useUI } from "@/hooks/useStores";
import { CATEGORIES } from "@/constants/categories";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useFilters();
  const { showSuccess } = useUI();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ESC 키로 모바일 메뉴 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className="bg-white border-b border-gray-100 sticky top-0 z-50"
        role="banner"
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* 로고 */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm"
                aria-label="MAG+ 홈페이지로 이동"
              >
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <span
                    className="text-white font-bold text-sm"
                    aria-hidden="true"
                  >
                    M
                  </span>
                </div>
                <span className="text-2xl font-light text-black tracking-wide">
                  MAG+
                </span>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav
              className="hidden lg:flex flex-1 justify-center"
              role="navigation"
              aria-label="메인 메뉴"
            >
              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-base font-light text-black hover:text-gray-600 transition-colors duration-200 py-2"
                >
                  HOME
                </Link>
                <Link
                  href="/articles"
                  className="text-base font-light text-black hover:text-gray-600 transition-colors duration-200 py-2"
                >
                  ARTICLES
                </Link>

                {/* 카테고리 드롭다운 */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-1 text-base font-light text-black hover:text-gray-600 transition-colors duration-200 py-2"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span>CATEGORIES</span>
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-2">
                        {CATEGORIES.map((category) => (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="flex items-center space-x-3 px-4 py-2 text-black hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <span className="text-base">
                              {category.slug === "cafe" && "☕"}
                              {category.slug === "restaurant" && "🍽️"}
                              {category.slug === "popup" && "🏪"}
                              {category.slug === "culture" && "🎭"}
                              {category.slug === "shopping" && "🛍️"}
                              {category.slug === "exhibition" && "🎨"}
                            </span>
                            <span className="text-sm font-light">
                              {category.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>

            {/* 데스크톱 검색바 및 구독 버튼 */}
            <div className="hidden lg:flex flex-shrink-0 items-center space-x-4">
              {/* 검색바 */}
              <form
                onSubmit={handleSearch}
                role="search"
                aria-label="아티클 검색"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon
                      className="h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="search"
                    placeholder="검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-200"
                    aria-label="검색어 입력"
                  />
                </div>
              </form>
            </div>

            {/* 모바일 햄버거 메뉴 버튼 */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 text-gray-900 hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm min-h-[44px] min-w-[44px] relative z-[110]"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              >
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* 데스크톱 드롭다운 닫기용 오버레이 */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsDropdownOpen(false)}
            aria-hidden="true"
          />
        )}
      </header>

      {/* 모바일 풀스크린 오버레이 메뉴 */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-white z-[100] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        role="navigation"
        aria-label="모바일 메뉴"
      >
        <div className="h-full overflow-y-auto">
          {/* 모바일 메뉴 헤더 */}
          <div className="flex justify-between items-center h-20 px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <span
                  className="text-white font-bold text-sm"
                  aria-hidden="true"
                >
                  M
                </span>
              </div>
              <span className="text-2xl font-light text-black tracking-wide">
                MAG+
              </span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="inline-flex items-center justify-center p-2 text-gray-900 hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm min-h-[44px] min-w-[44px]"
              aria-label="메뉴 닫기"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* 모바일 메뉴 내용 */}
          <div className="px-6 py-8 space-y-8">
            {/* 검색바 */}
            <div className="pb-6 border-b border-gray-100">
              <form
                onSubmit={(e) => {
                  handleSearch(e);
                  closeMobileMenu();
                }}
                role="search"
                aria-label="아티클 검색"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="search"
                    placeholder="검색어를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg bg-gray-50 leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white text-base font-light transition-all duration-200"
                    aria-label="검색어 입력"
                  />
                </div>
              </form>
            </div>

            {/* 메인 네비게이션 */}
            <div className="space-y-6">
              <Link
                href="/"
                className="block text-2xl font-light text-black hover:text-gray-600 transition-colors duration-200 py-3 border-b border-gray-100"
                onClick={closeMobileMenu}
              >
                HOME
              </Link>
              <Link
                href="/articles"
                className="block text-2xl font-light text-black hover:text-gray-600 transition-colors duration-200 py-3 border-b border-gray-100"
                onClick={closeMobileMenu}
              >
                ARTICLES
              </Link>
            </div>

            {/* 카테고리 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-light text-gray-500 tracking-wide uppercase">
                Categories
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex items-center space-x-3 py-3 px-2 text-black hover:text-gray-600 transition-colors duration-200 border-b border-gray-100"
                    onClick={closeMobileMenu}
                  >
                    <span className="text-lg">
                      {category.slug === "cafe" && "☕"}
                      {category.slug === "restaurant" && "🍽️"}
                      {category.slug === "popup" && "🏪"}
                      {category.slug === "culture" && "🎭"}
                      {category.slug === "shopping" && "🛍️"}
                      {category.slug === "exhibition" && "🎨"}
                    </span>
                    <span className="text-base font-light">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 구독 버튼 */}

            {/* 추가 여백 */}
            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </>
  );
}
