-- RLS(Row Level Security) 활성화
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Categories 테이블 정책
-- 모든 사용자가 활성화된 카테고리 읽기 가능
CREATE POLICY "Categories are publicly readable" ON categories
  FOR SELECT USING (is_active = true);

-- API Key가 있는 사용자만 카테고리 관리 가능 (INSERT, UPDATE, DELETE)
-- 실제 구현에서는 API Key 검증 로직이 애플리케이션 레벨에서 처리됨

-- Articles 테이블 정책
-- 모든 사용자가 발행된 아티클 읽기 가능
CREATE POLICY "Published articles are publicly readable" ON articles
  FOR SELECT USING (status = 'published');

-- 조회수 증가를 위한 UPDATE 정책 (views 컬럼만)
CREATE POLICY "Anyone can update article views" ON articles
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- Shares 테이블 정책
-- 모든 사용자가 공유 통계 읽기 가능
CREATE POLICY "Share stats are publicly readable" ON shares
  FOR SELECT USING (true);

-- 모든 사용자가 공유 기록 생성 가능
CREATE POLICY "Anyone can create share records" ON shares
  FOR INSERT WITH CHECK (true);

-- 공개 읽기를 위한 익명 사용자 권한 부여
-- Supabase에서는 anon 역할이 기본적으로 존재
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON articles TO anon;
GRANT UPDATE(views) ON articles TO anon; -- 조회수 업데이트만 허용
GRANT SELECT ON shares TO anon;
GRANT INSERT ON shares TO anon;

-- 집계 뷰에 대한 권한
GRANT SELECT ON article_share_stats TO anon;
GRANT SELECT ON article_total_shares TO anon; 