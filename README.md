# MAG+ 웹매거진

MAG+ (Magazine Plus)는 MZ세대를 위한 핫플레이스 웹매거진입니다. 서울의 숨겨진 보석들을 발견하고, 트렌디한 카페부터 독특한 팝업스토어까지 다양한 문화 공간을 소개합니다.

## 🎯 프로젝트 개요

- **제품명**: MAG+ (Magazine Plus)
- **목적**: MZ세대를 위한 핫플레이스 큐레이션 웹매거진
- **타겟**: 20-35세 MZ세대, 경험 중심 소비자
- **콘셉트**: 평범한 공간이 아닌 새로운 경험과 즐거움을 제공하는 공간 소개

## 🚀 기술 스택

### 프론트엔드

- **Next.js**: 15.3.5 (App Router, React 19)
- **TypeScript**: 5.x (Strict mode)
- **Tailwind CSS**: 4.x
- **Zustand**: 5.0.6 (상태 관리)
- **React Markdown**: 마크다운 렌더링
- **Heroicons**: 아이콘

### 백엔드

- **Supabase**: 데이터베이스, 인증, 실시간 기능
- **PostgreSQL**: 데이터베이스
- **Next.js API Routes**: 서버 API

### 개발 도구

- **패키지 매니저**: pnpm
- **린터**: ESLint (Next.js 설정)
- **타입 체크**: TypeScript
- **배포**: Vercel

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── api/               # API 라우트
│   │   ├── articles/      # 아티클 API
│   │   ├── categories/    # 카테고리 API
│   │   ├── search/        # 검색 API
│   │   └── share/         # 공유 API
│   ├── articles/          # 아티클 페이지
│   ├── categories/        # 카테고리 페이지
│   ├── search/            # 검색 페이지
│   └── layout.tsx         # 루트 레이아웃
├── components/            # React 컴포넌트
│   ├── article/          # 아티클 관련 컴포넌트
│   ├── category/         # 카테고리 관련 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   └── ui/               # 기본 UI 컴포넌트
├── lib/                  # 라이브러리 및 유틸리티
│   └── supabase/         # Supabase 관련 함수
├── stores/               # Zustand 상태 관리
├── hooks/                # 커스텀 React 훅
├── constants/            # 상수 정의
├── types/                # TypeScript 타입
└── utils/                # 유틸리티 함수
```

## 🗄️ 데이터베이스 구조

### 주요 테이블

- **articles**: 아티클 콘텐츠 및 메타데이터
- **categories**: 카테고리 분류 (카페, 레스토랑, 팝업스토어 등)
- **shares**: 공유 통계 및 분석 데이터

### 카테고리 분류

- **카페** (cafe): 트렌디한 카페와 커피 문화
- **레스토랑** (restaurant): 맛있는 레스토랑과 다이닝
- **팝업스토어** (popup): 한정적인 팝업 스토어와 이벤트
- **문화생활** (culture): 전시회, 공연, 문화 이벤트
- **쇼핑** (shopping): 쇼핑몰, 브랜드, 패션
- **전시회** (exhibition): 아트 갤러리와 전시회

## 🏗️ 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd web_magazine
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 설정을 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 5. 빌드 및 배포

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 실행
pnpm start
```

## 📱 주요 기능

### 1. 홈페이지

- 최신 아티클 피드
- 카테고리별 탐색
- 인기 아티클 추천
- 구조화된 데이터 (SEO)

### 2. 아티클 관리

- 마크다운 기반 콘텐츠
- 이미지 갤러리
- 카테고리 및 지역 분류
- 조회수 통계

### 3. 필터링 시스템

- 카테고리별 필터 (6개 주요 카테고리)
- 지역별 필터 (17개 시도)
- 정렬 옵션 (최신순, 인기순, 오래된순)
- URL 기반 필터 상태 관리

### 4. 검색 기능

- 제목, 내용, 요약 검색
- 카테고리 및 지역 조합 검색
- 검색 결과 페이지네이션

### 5. 소셜 공유

- 페이스북, 트위터, 카카오톡 공유
- 클립보드 복사
- 공유 통계 추적
- 오픈 그래프 메타데이터

### 6. 반응형 디자인

- 모바일 우선 설계
- 터치 친화적 UI
- 다양한 디바이스 지원

## 🔧 상태 관리

### Zustand 스토어

#### filters.ts

```typescript
// 필터링 상태 관리
const useFilters = () => ({
  selectedCategory: string | null,
  selectedRegion: string | null,
  sortBy: 'latest' | 'popular' | 'oldest',
  setCategory: (category: string | null) => void,
  setRegion: (region: string | null) => void,
  setSortBy: (sort: string) => void,
  clearFilters: () => void,
});
```

#### ui.ts

```typescript
// UI 상태 관리
const useUI = () => ({
  isMenuOpen: boolean,
  toggleMenu: () => void,
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
});
```

## 📡 API 엔드포인트

### 아티클 API

- `GET /api/articles` - 아티클 목록 조회
- `GET /api/articles?category=cafe` - 카테고리별 필터링
- `GET /api/articles?region=seoul` - 지역별 필터링
- `GET /api/articles?sort=popular` - 정렬 옵션

### 카테고리 API

- `GET /api/categories` - 카테고리 목록 조회

### 검색 API

- `GET /api/search?q=카페` - 텍스트 검색
- `GET /api/search?q=카페&category=cafe` - 조합 검색

### 공유 API

- `POST /api/share` - 공유 통계 기록

## 🎨 UI/UX 특징

### 디자인 시스템

- **미니멀한 디자인**: 깔끔하고 현대적인 인터페이스
- **타이포그래피**: 가독성 중심의 폰트 시스템
- **색상 팔레트**: 고급스러운 모노크롬 베이스
- **그리드 시스템**: 반응형 카드 레이아웃

### 접근성

- ARIA 레이블 적용
- 키보드 네비게이션 지원
- 시멘틱 HTML 구조
- 스크린 리더 호환성

### 성능 최적화

- React 19 업그레이드 완료
- 이미지 최적화 (Next.js Image 컴포넌트)
- 페이지네이션 성능 개선
- 데이터베이스 쿼리 최적화

### 버그 수정

- 카테고리 필터링 동작 수정
- URL 파라미터 동기화 개선
- 반응형 레이아웃 안정화

## 🛠️ 개발 가이드

### 코딩 스타일

- TypeScript Strict Mode 적용
- ESLint + Prettier 설정
- 함수형 컴포넌트 사용
- 커스텀 훅 활용

### 컴포넌트 구조

```typescript
// 컴포넌트 예시
interface Props {
  article: ArticleWithCategory;
}

export default function ArticleCard({ article }: Props) {
  return (
    <article className="group">
      {/* 컴포넌트 내용 */}
    </article>
  );
}
```

### 상태 관리 패턴

```typescript
// Zustand 스토어 사용
const { selectedCategory, setCategory } = useFilters();
const { showSuccess } = useUI();
```

## 📊 성능 및 최적화

### 렌더링 최적화

- 서버 사이드 렌더링 (SSR)
- 정적 사이트 생성 (SSG)
- 동적 임포트 사용
- 이미지 지연 로딩

### SEO 최적화

- 메타데이터 관리
- 구조화된 데이터 (JSON-LD)
- 사이트맵 자동 생성
- 오픈 그래프 최적화

## 📈 분석 및 모니터링

### 기본 통계

- 아티클 조회수 추적
- 카테고리별 인기도
- 공유 플랫폼 분석
- 사용자 행동 패턴

### 성능 모니터링

- Core Web Vitals 측정
- 로딩 시간 최적화
- 에러 추적 및 로깅

---

**MAG+** - Discover Seoul's Hidden Gems 🏙️✨
