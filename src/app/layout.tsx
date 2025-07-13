import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MAG+ | MZ세대를 위한 핫플레이스 웹매거진",
  description:
    "트렌디한 카페부터 숨겨진 맛집까지, 새로운 경험을 찾는 당신을 위한 큐레이션",
  keywords: [
    "핫플레이스",
    "카페",
    "맛집",
    "팝업스토어",
    "문화공간",
    "MZ세대",
    "웹매거진",
  ],
  authors: [{ name: "MAG+ Team" }],
  openGraph: {
    title: "MAG+ | MZ세대를 위한 핫플레이스 웹매거진",
    description:
      "트렌디한 카페부터 숨겨진 맛집까지, 새로운 경험을 찾는 당신을 위한 큐레이션",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAG+ | MZ세대를 위한 핫플레이스 웹매거진",
    description:
      "트렌디한 카페부터 숨겨진 맛집까지, 새로운 경험을 찾는 당신을 위한 큐레이션",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="font-sans antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
