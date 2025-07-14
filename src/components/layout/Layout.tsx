"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Toast from "../ui/Toast";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useUI } from "@/hooks/useStores";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  const { isPageLoading } = useUI();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 스킵 링크 - 키보드 접근성을 위한 메인 콘텐츠 바로가기 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        메인 콘텐츠로 이동
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        {isPageLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          children
        )}
      </main>

      {showFooter && <Footer />}

      {/* Toast 알림 */}
      <Toast />
    </div>
  );
}
