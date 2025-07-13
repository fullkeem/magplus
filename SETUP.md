# 🚀 웹 매거진 프로젝트 설정 가이드

## 📋 필수 환경 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 로그인
2. 새 프로젝트 생성
3. 프로젝트 설정에서 API 키 확인

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ 중요:**

- `your-project-id`를 실제 Supabase 프로젝트 ID로 교체
- `your-anon-key-here`를 실제 anon/public 키로 교체

### 3. 데이터베이스 마이그레이션

Supabase 프로젝트의 SQL 편집기에서 다음 마이그레이션 파일들을 순서대로 실행:

1. `supabase/migrations/002_create_articles.sql`
2. `supabase/migrations/003_create_subscriptions.sql`
3. `supabase/migrations/004_create_shares.sql`
4. `supabase/migrations/005_setup_rls_policies.sql`
5. `supabase/migrations/006_seed_initial_data.sql`

### 4. 개발 서버 실행

```bash
pnpm install
pnpm dev
```

## 🔧 문제 해결

### "Invalid URL" 오류 발생 시

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 값이 올바른지 확인
3. 개발 서버 재시작: `pnpm dev`

### TypeScript 오류 발생 시

```bash
pnpm build
```

타입 오류가 있다면 수정 후 다시 실행

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js 13+ App Router
├── components/          # React 컴포넌트
├── lib/                # 라이브러리 및 유틸리티
│   └── supabase/       # Supabase 관련 코드
├── stores/             # Zustand 상태 관리
└── types/              # TypeScript 타입 정의
```

## 🚀 배포

환경 변수를 배포 플랫폼에 설정한 후:

```bash
pnpm build
```
