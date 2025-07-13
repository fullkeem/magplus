-- 이메일 기반 구독 테이블 생성
CREATE TABLE IF NOT EXISTS subscriptions (
  email VARCHAR(255) PRIMARY KEY,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  subscribed_categories TEXT[] DEFAULT '{}',
  verification_token VARCHAR(255),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions 테이블에 업데이트 트리거 적용
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 구독 해지 시 unsubscribed_at 자동 설정 트리거
CREATE OR REPLACE FUNCTION set_unsubscribed_at()
RETURNS TRIGGER AS $$
BEGIN
  -- is_active가 false로 변경될 때 unsubscribed_at 설정
  IF NEW.is_active = false AND OLD.is_active = true THEN
    NEW.unsubscribed_at = NOW();
  -- is_active가 true로 변경될 때 unsubscribed_at 초기화
  ELSIF NEW.is_active = true AND OLD.is_active = false THEN
    NEW.unsubscribed_at = NULL;
  END IF;
  
  -- is_verified가 true로 변경될 때 verified_at 설정
  IF NEW.is_verified = true AND OLD.is_verified = false THEN
    NEW.verified_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_subscriptions_status_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION set_unsubscribed_at();

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_verified ON subscriptions(is_verified);
CREATE INDEX IF NOT EXISTS idx_subscriptions_token ON subscriptions(verification_token);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created ON subscriptions(created_at); 