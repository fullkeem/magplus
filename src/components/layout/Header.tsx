"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useFilters, useUI } from "@/hooks/useStores";
import { CATEGORIES } from "@/constants/categories";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useFilters();
  const { showSuccess } = useUI();

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

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-2xl font-light text-black tracking-wide hidden sm:block">
                MAG+
              </span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-10">
            <Link
              href="/"
              className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wide transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/articles"
              className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wide transition-colors"
            >
              ARTICLES
            </Link>
            <div className="relative group">
              <button className="text-gray-900 hover:text-gray-600 text-sm font-light tracking-wide transition-colors">
                CATEGORIES
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-2">
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors font-light"
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
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border-0 border-b border-gray-200 bg-transparent leading-5 placeholder-gray-400 focus:outline-none focus:border-black text-sm font-light"
                />
              </div>
            </form>
          </div>

          {/* 구독 버튼 */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSubscribe}
              className="hidden sm:inline-flex items-center px-6 py-2 border border-black text-sm font-light tracking-wide text-black bg-white hover:bg-black hover:text-white transition-all duration-200"
            >
              SUBSCRIBE
            </button>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 text-gray-400 hover:text-black focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
              {/* 모바일 검색 */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border-0 border-b border-gray-200 bg-transparent leading-5 placeholder-gray-400 focus:outline-none focus:border-black text-sm font-light"
                    />
                  </div>
                </form>
              </div>

              {/* 모바일 네비게이션 */}
              <Link
                href="/"
                className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-light tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </Link>
              <Link
                href="/articles"
                className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-light tracking-wide"
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
                    className="text-gray-600 hover:text-black block px-3 py-1 text-sm font-light"
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
                  className="w-full flex justify-center items-center px-6 py-2 border border-black text-sm font-light tracking-wide text-black bg-white hover:bg-black hover:text-white transition-all duration-200"
                >
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
