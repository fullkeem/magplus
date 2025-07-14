import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | MAG+",
  description: "요청하신 페이지를 찾을 수 없습니다.",
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="space-y-6">
        <h1 className="text-6xl font-light text-gray-900">404</h1>
        <h2 className="text-2xl font-light text-gray-600">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-500 leading-relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL을 확인하시거나 홈페이지로 돌아가 주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-black text-black bg-white hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            아티클 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
