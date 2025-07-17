-- MAG+ 웹매거진 데이터베이스 마이그레이션 실행 스크립트
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. Categories 테이블 생성 및 기본 데이터
\i 001_create_categories.sql

-- 2. Articles 테이블 생성
\i 002_create_articles.sql

-- 3. Shares 테이블 생성 (익명 공유 통계)
\i 004_create_shares.sql

-- 4. RLS 정책 설정 (공개 읽기)
\i 005_setup_rls_policies.sql

-- 실제 데이터는 Supabase MCP를 통해 추가됨 