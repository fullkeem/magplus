import Link from "next/link";
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  // 임시 통계 데이터
  const stats = [
    { name: "총 아티클", value: "24", icon: DocumentTextIcon },
    { name: "발행된 아티클", value: "18", icon: EyeIcon },
    { name: "초안", value: "6", icon: PencilIcon },
  ];

  // 최근 아티클 목록 (임시 데이터)
  const recentArticles = [
    {
      id: "1",
      title: "성수동 핫플레이스 베스트 5",
      status: "published",
      createdAt: "2024-01-15",
      views: 1250,
    },
    {
      id: "2",
      title: "강남 신상 카페 탐방기",
      status: "draft",
      createdAt: "2024-01-14",
      views: 0,
    },
    {
      id: "3",
      title: "홍대 팝업스토어 가이드",
      status: "published",
      createdAt: "2024-01-13",
      views: 890,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
        >
          <PlusIcon className="h-4 w-4 mr-2" />새 아티클 작성
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            최근 아티클
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            최근에 작성된 아티클 목록입니다.
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentArticles.map((article) => (
            <li key={article.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {article.createdAt} • {article.views} 조회
                    </p>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {article.status === "published" ? "발행됨" : "초안"}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    편집
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 px-4 py-3 text-right">
          <Link
            href="/admin/articles"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            모든 아티클 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
