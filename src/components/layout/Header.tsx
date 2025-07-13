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
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
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

  return (
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
              href="/"
              className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm px-2 py-1"
            >
              HOME
            </Link>
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
              className="md:hidden inline-flex items-center justify-center p-2 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-sm min-h-[44px] min-w-[44px]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
          role="navigation"
          aria-label="모바일 네비게이션"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
            {/* 모바일 검색 */}
            <div className="px-3 py-2">
              <form
                onSubmit={handleSearch}
                role="search"
                aria-label="모바일 아티클 검색"
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
                    aria-label="모바일 검색어 입력"
                  />
                </div>
              </form>
            </div>

            {/* 모바일 네비게이션 */}
            <Link
              href="/"
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-light tracking-wide focus:outline-none focus:bg-gray-50 focus:text-black transition-colors rounded-sm min-h-[44px] flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              HOME
            </Link>
            <Link
              href="/articles"
              className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-light tracking-wide focus:outline-none focus:bg-gray-50 focus:text-black transition-colors rounded-sm min-h-[44px] flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ARTICLES
            </Link>

            {/* 모바일 카테고리 */}
            <div className="px-3 py-2">
              <div className="text-gray-500 text-sm font-light tracking-wide mb-2">
                CATEGORIES
              </div>
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="text-gray-600 hover:text-black block px-3 py-1 text-sm font-light focus:outline-none focus:bg-gray-50 focus:text-black transition-colors rounded-sm min-h-[44px] flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* 모바일 구독 버튼 */}
            <div className="px-3 py-2">
              <button
                onClick={() => {
                  handleSubscribe();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-black text-sm font-light tracking-wide text-black bg-white hover:bg-black hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                aria-label="뉴스레터 구독하기"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
