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
      <Header />

      <main className="flex-1">
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
