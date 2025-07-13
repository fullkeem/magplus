# MAG+ 웹매거진

MAG+ (Magazine Plus)는 평범한 공간이나 놀거리가 아닌 새로운 경험이나 즐거움을 찾는 사람들을 위한 웹매거진입니다.

## 🎯 프로젝트 개요

- **제품명**: MAG+ (Magazine Plus)
- **목적**: 사람들이 잘 모르는 공간과 놀거리를 소개하여 좋은 정보의 즐거움 제공
- **타겟**: MZ세대 중심 (20-35세)의 경험 중심 소비자

## 🚀 기술 스택

### 프론트엔드

- **Next.js**: 15.3.5 (App Router)
- **React**: 19.x
- **TypeScript**: 5.8.3
- **Tailwind CSS**: 4.1.x
- **Zustand**: 5.0.6 (상태 관리)

### 백엔드

- **PostgreSQL**: 데이터베이스
- **Next.js API Routes**: 서버 API

### 개발 도구

- **패키지 매니저**: pnpm
- **배포**: Vercel
- **린팅**: ESLint
- **타입 체크**: TypeScript strict mode

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js App Router 페이지
├── components/          # React 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   ├── article/        # 아티클 관련 컴포넌트
│   ├── category/       # 카테고리 관련 컴포넌트
│   └── common/         # 공통 컴포넌트
├── lib/                # 라이브러리 설정
├── stores/             # Zustand 상태 관리 스토어
├── hooks/              # 커스텀 React 훅
├── utils/              # 유틸리티 함수
├── types/              # TypeScript 타입 정의
└── constants/          # 상수 정의
```

## 🏗️ 설치 및 실행

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 데이터베이스 설정을 입력하세요.

```bash
cp .env.example .env.local
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 4. 빌드

```bash
pnpm build
```

### 5. 프로덕션 실행

```bash
pnpm start
```

## 📝 주요 기능

### 1. 매거진 아티클 관리

- 리치 에디터를 통한 콘텐츠 작성
- 이미지/비디오 업로드 및 관리
- 아티클 상태 관리 (초안/발행/비공개)
- 예약 발행 기능

### 2. 카테고리별 분류

- 카페, 레스토랑, 팝업스토어, 문화공간, 쇼핑몰, 전시회
- 지역별 필터링 (17개 시도)
- 태그 시스템

### 3. SNS 공유 기능

- 페이스북, 인스타그램, 트위터, 카카오톡 공유
- 오픈 그래프 메타데이터 최적화
- 공유 통계 추적

### 4. 이메일 구독 서비스

- 이메일 주소 기반 구독 (회원가입 불필요)
- 새 콘텐츠 알림
- 카테고리별 맞춤 알림
- 구독 해지 기능

### 5. 사용자 경험 기능

- 북마크 기능 (로컬 저장)
- 읽기 기록 관리
- 반응형 디자인
- 다크/라이트 테마

## 🔧 상태 관리

### Zustand 스토어

- **filters**: 필터링 및 검색 상태
- **ui**: 모달, 로딩, 테마 등 UI 상태
- **subscription**: 구독, 북마크, 읽기 기록 관리

### 사용 예시

```typescript
import { useFilters, useUI, useSubscription } from '@/hooks/useStores';

// 필터링 상태 사용
const { selectedCategory, setCategory } = useFilters();

// UI 상태 사용
const { isMenuOpen, toggleMenu } = useUI();

// 구독 상태 사용
const { isSubscribed, subscribe } = useSubscription();
```

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: 브랜드 메인 컬러
- **Secondary**: 보조 컬러
- **Accent**: 강조 컬러
- **Neutral**: 텍스트 및 배경 컬러

### 컴포넌트

- **Button**: 다양한 크기와 스타일의 버튼
- **Card**: 아티클 카드 컴포넌트
- **Modal**: 모달 컴포넌트
- **Toast**: 알림 컴포넌트

## 📱 반응형 디자인

### 브레이크포인트

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### 최적화

- 모바일 우선 설계
- 터치 친화적 인터페이스
- 빠른 로딩 속도
- 접근성 준수

## 🚀 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

- `DATABASE_URL`: 데이터베이스 연결 URL
- `NEXTAUTH_SECRET`: 세션 암호화 키
- `NEXTAUTH_URL`: 배포 URL

## 🧪 테스트

### 단위 테스트

```bash
pnpm test
```

### E2E 테스트

```bash
pnpm test:e2e
```

### 테스트 커버리지

```bash
pnpm test:coverage
```

## 📊 성능 최적화

### 이미지 최적화

- Next.js Image 컴포넌트 사용
- WebP 형식 지원
- 지연 로딩 적용

### 코드 분할

- 동적 import 사용
- 페이지별 코드 분할
- 컴포넌트 지연 로딩

### 캐싱

- 정적 자산 캐싱
- API 응답 캐싱
- 브라우저 캐싱 활용

## 🔒 보안

### 데이터 보호

- 입력 검증
- SQL 인젝션 방지
- XSS 방지

### API 보안

- CORS 설정
- 레이트 리미팅
- 환경 변수 보호

## 📈 분석 및 모니터링

### 성능 분석

- Vercel Analytics
- Google Analytics
- Core Web Vitals

### 에러 추적

- Sentry 통합
- 로그 모니터링
- 알림 설정

## 🤝 기여 가이드

### 개발 환경 설정

1. 저장소 클론
2. 의존성 설치
3. 환경 변수 설정
4. 개발 서버 실행

### 코드 스타일

- ESLint 규칙 준수
- Prettier 포맷팅
- TypeScript strict mode

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 및 설정 변경
```

## 📄 라이선스

MIT License

## 📞 문의

- 이메일: contact@magplus.com
- 웹사이트: https://magplus.com
- GitHub: https://github.com/magplus/web-magazine
