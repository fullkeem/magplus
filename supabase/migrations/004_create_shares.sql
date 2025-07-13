-- 공유 통계 테이블 생성
CREATE TABLE IF NOT EXISTS shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('facebook', 'twitter', 'kakao', 'instagram', 'naver', 'clipboard', 'other')),
  anonymous_id VARCHAR(255), -- 선택적 익명 식별자 (쿠키 기반)
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

-- 공유 통계 집계 뷰 생성
CREATE OR REPLACE VIEW article_share_stats AS
SELECT 
  article_id,
  platform,
  COUNT(*) as share_count,
  DATE_TRUNC('day', shared_at) as share_date
FROM shares 
GROUP BY article_id, platform, DATE_TRUNC('day', shared_at);

-- 아티클별 총 공유 수 뷰
CREATE OR REPLACE VIEW article_total_shares AS
SELECT 
  article_id,
  COUNT(*) as total_shares,
  COUNT(DISTINCT platform) as platforms_count
FROM shares 
GROUP BY article_id;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_shares_article ON shares(article_id);
CREATE INDEX IF NOT EXISTS idx_shares_platform ON shares(platform);
CREATE INDEX IF NOT EXISTS idx_shares_date ON shares(shared_at);
CREATE INDEX IF NOT EXISTS idx_shares_anonymous ON shares(anonymous_id);

-- 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_shares_article_platform ON shares(article_id, platform);
CREATE INDEX IF NOT EXISTS idx_shares_article_date ON shares(article_id, shared_at); 