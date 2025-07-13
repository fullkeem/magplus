"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useFilters, useUI } from "@/hooks/useStores";
import { CATEGORIES } from "@/constants/categories";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useFilters();
  const { showSuccess } = useUI();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSubscribe = () => {
    showSuccess("구독 페이지로 이동합니다");
    window.location.href = "/subscription";
  };

  // 키보드 네비게이션 개선
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // 모바일 메뉴 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                <span className="text-2xl font-light text-black tracking-wide hidden sm:block">
                  MAG+
                </span>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav
              className="hidden md:flex space-x-10"
              role="navigation"
              aria-label="메인 네비게이션"
            >
              <Link
                href="/articles"
                className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm px-2 py-1"
              >
                ARTICLES
              </Link>
              <div className="relative" ref={categoryMenuRef}>
                <button
                  className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm px-2 py-1"
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () =>
                      setIsCategoryMenuOpen(!isCategoryMenuOpen)
                    )
                  }
                  aria-expanded={isCategoryMenuOpen}
                  aria-haspopup="true"
                  aria-controls="desktop-category-menu"
                >
                  CATEGORIES
                </button>
                <div
                  id="desktop-category-menu"
                  className={`absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg transition-all duration-200 z-10 ${
                    isCategoryMenuOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                  role="menu"
                  aria-labelledby="categories-button"
                >
                  <div className="py-2">
                    {CATEGORIES.map((category, index) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors font-light focus:outline-none focus:bg-gray-50 focus:text-black"
                        role="menuitem"
                        tabIndex={isCategoryMenuOpen ? 0 : -1}
                        onClick={() => setIsCategoryMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* 검색바 */}
            <div className="flex-1 max-w-md mx-8 hidden sm:block">
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
                    placeholder="검색어를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border-0 border-b border-gray-200 bg-transparent leading-5 placeholder-gray-400 focus:outline-none focus:border-black text-sm font-light focus:ring-0"
                    aria-label="검색어 입력"
                  />
                </div>
              </form>
            </div>

            {/* 구독 버튼 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSubscribe}
                className="hidden sm:inline-flex items-center px-6 py-2 border border-black text-sm font-light tracking-wide text-black bg-white hover:bg-black hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                aria-label="뉴스레터 구독하기"
              >
                SUBSCRIBE
              </button>

              {/* 모바일 메뉴 버튼 */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm min-h-[44px] min-w-[44px] relative z-[60]"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              >
                <div className="relative w-6 h-6">
                  <Bars3Icon
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen
                        ? "opacity-0 rotate-180 scale-75"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                    aria-hidden="true"
                  />
                  <XMarkIcon
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-180 scale-75"
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      <div
        className={`md:hidden fixed inset-0 z-[55] ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        {/* 배경 오버레이 */}
        <div
          className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* 메뉴 패널 */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="absolute inset-0 bg-white shadow-2xl transform translate-y-0 transition-transform duration-300 ease-in-out"
          role="navigation"
          aria-label="모바일 네비게이션"
        >
          <div className="h-full overflow-y-auto pt-16">
            <div className="px-6 py-8 space-y-8">
              {/* 모바일 검색 */}
              <div className="pb-6 border-b border-gray-100">
                <form
                  onSubmit={(e) => {
                    handleSearch(e);
                    setIsMobileMenuOpen(false);
                  }}
                  role="search"
                  aria-label="모바일 아티클 검색"
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
                      className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg bg-gray-50 leading-5 placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white text-base font-light transition-all duration-200"
                      aria-label="모바일 검색어 입력"
                    />
                  </div>
                </form>
              </div>

              {/* 메인 네비게이션 */}
              <div className="space-y-6">
                <Link
                  href="/"
                  className="block text-2xl font-light text-black hover:text-gray-600 transition-colors duration-200 py-3 border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link
                  href="/articles"
                  className="block text-2xl font-light text-black hover:text-gray-600 transition-colors duration-200 py-3 border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
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
                      onClick={() => setIsMobileMenuOpen(false)}
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
              <div className="pt-6">
                <button
                  onClick={() => {
                    handleSubscribe();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-8 py-4 border-2 border-black text-lg font-light tracking-wide text-black bg-white hover:bg-black hover:text-white transition-all duration-300 rounded-lg"
                  aria-label="뉴스레터 구독하기"
                >
                  SUBSCRIBE
                </button>
              </div>

              {/* 추가 여백 */}
              <div className="h-20"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
