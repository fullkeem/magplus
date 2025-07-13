export const REGIONS = [
  { id: "seoul", name: "서울", code: "SEL" },
  { id: "busan", name: "부산", code: "BSN" },
  { id: "daegu", name: "대구", code: "DGU" },
  { id: "incheon", name: "인천", code: "ICN" },
  { id: "gwangju", name: "광주", code: "GWJ" },
  { id: "daejeon", name: "대전", code: "DJN" },
  { id: "ulsan", name: "울산", code: "USN" },
  { id: "sejong", name: "세종", code: "SJG" },
  { id: "gyeonggi", name: "경기", code: "GGI" },
  { id: "gangwon", name: "강원", code: "GWN" },
  { id: "chungbuk", name: "충북", code: "CBK" },
  { id: "chungnam", name: "충남", code: "CNM" },
  { id: "jeonbuk", name: "전북", code: "JBK" },
  { id: "jeonnam", name: "전남", code: "JNM" },
  { id: "gyeongbuk", name: "경북", code: "GBK" },
  { id: "gyeongnam", name: "경남", code: "GNM" },
  { id: "jeju", name: "제주", code: "JJU" },
] as const;

export type RegionId = (typeof REGIONS)[number]["id"];
export type RegionFilter = RegionId | "all";
