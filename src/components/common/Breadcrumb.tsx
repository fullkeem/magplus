"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="브레드크럼 네비게이션"
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
    >
      <Link
        href="/"
        className="hover:text-gray-900 transition-colors"
        aria-label="홈으로 이동"
      >
        홈
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRightIcon
            className="w-4 h-4 text-gray-400"
            aria-hidden="true"
          />
          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
