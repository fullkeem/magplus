# MAG+ 데이터베이스 스키마

## 개요

MAG+ 웹매거진을 위한 PostgreSQL 데이터베이스 스키마입니다. 인증 없는 공개 읽기 시스템과 이메일 기반 구독 시스템을 지원합니다.

## 테이블 구조

### 1. Categories (카테고리)

- 아티클 카테고리 관리
- 기본 카테고리: 카페, 레스토랑, 팝업스토어, 문화공간, 쇼핑몰, 전시회

### 2. Articles (아티클)

- 매거진 아티클 관리
- 이미지 배열, 지역 정보, 조회수/좋아요 수 포함
- 발행 상태 관리 (draft/published)
- SEO 메타데이터 지원

### 3. Subscriptions (구독)

- **이메일 기반 구독 시스템** (인증 없음)
- 이메일 인증 토큰 관리
- 카테고리별 구독 설정
- 구독/해지 상태 추적

### 4. Shares (공유)

- **익명 공유 통계** 수집
- 플랫폼별 공유 수 집계
- 사용자 에이전트, 리퍼러 정보

## RLS 정책

### 공개 읽기 정책

- **Categories**: 활성화된 카테고리 공개 읽기
- **Articles**: 발행된 아티클 공개 읽기
- **Shares**: 공유 통계 공개 읽기
- **Subscriptions**: 구독 신청 가능, 토큰 기반 수정

### 관리자 권한

- API Key 기반 아티클/카테고리 관리
- 애플리케이션 레벨에서 권한 검증

## 마이그레이션 실행

### 1. 개별 파일 실행

```sql
-- Supabase SQL Editor에서 순서대로 실행
\i migrations/001_create_categories.sql
\i migrations/002_create_articles.sql
\i migrations/003_create_subscriptions.sql
\i migrations/004_create_shares.sql
\i migrations/005_setup_rls_policies.sql
```

### 2. 통합 스크립트 실행

```sql
-- run-migrations.sql 파일을 Supabase SQL Editor에서 실행
\i run-migrations.sql
```

### 3. 실제 데이터 추가

실제 아티클 데이터는 Supabase MCP를 통해 추가되었습니다:

- 13개의 실제 아티클 (5개 카테고리)
- 지역별 분포 (서울, 부산, 대구, 인천, 광주)
- 구독자 데이터 (10명)
- 공유 통계 데이터 (39건)

## 주요 특징

### ✅ 인증 없는 공개 시스템

- 모든 콘텐츠 공개 접근
- 사용자 등록/로그인 불필요

### ✅ 이메일 기반 구독

- 이메일 주소만으로 구독 가능
- 토큰 기반 이메일 인증
- 카테고리별 구독 설정

### ✅ 익명 통계 수집

- 개인정보 없는 공유 통계
- 플랫폼별 집계 데이터

### ✅ SEO 최적화

- 메타 태그 지원
- 슬러그 기반 URL
- 전체 텍스트 검색 인덱스

## 인덱스 최적화

- 슬러그 기반 빠른 조회
- 카테고리별 필터링
- 지역별 검색
- 전체 텍스트 검색 (한국어)
- 공유 통계 집계

## 뷰 (Views)

### article_share_stats

- 아티클별 플랫폼별 공유 통계
- 일별 집계 데이터

### article_total_shares

- 아티클별 총 공유 수
- 플랫폼 수 집계
