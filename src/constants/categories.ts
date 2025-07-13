export const CATEGORIES = [
  {
    id: "cafe",
    name: "카페",
    slug: "cafe",
    description: "트렌디한 카페와 커피 문화",
    color: "#8B4513",
    icon: "☕",
  },
  {
    id: "restaurant",
    name: "레스토랑",
    slug: "restaurant",
    description: "맛집과 다이닝 경험",
    color: "#FF6B6B",
    icon: "🍽️",
  },
  {
    id: "popup",
    name: "팝업스토어",
    slug: "popup",
    description: "한정적인 팝업 스토어와 이벤트",
    color: "#4ECDC4",
    icon: "🏪",
  },
  {
    id: "culture",
    name: "문화공간",
    slug: "culture",
    description: "갤러리, 박물관, 문화 시설",
    color: "#45B7D1",
    icon: "🎨",
  },
  {
    id: "shopping",
    name: "쇼핑몰",
    slug: "shopping",
    description: "쇼핑과 리테일 공간",
    color: "#96CEB4",
    icon: "🛍️",
  },
  {
    id: "exhibition",
    name: "전시회",
    slug: "exhibition",
    description: "전시회와 아트 이벤트",
    color: "#FECA57",
    icon: "🖼️",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type CategoryFilter = CategoryId | "all";
