-- 샘플 아티클 데이터 삽입
-- 먼저 카테고리 ID를 가져와서 사용

DO $$
DECLARE
  cafe_id UUID;
  restaurant_id UUID;
  popup_id UUID;
  culture_id UUID;
  shopping_id UUID;
  exhibition_id UUID;
BEGIN
  -- 카테고리 ID 조회
  SELECT id INTO cafe_id FROM categories WHERE slug = 'cafe';
  SELECT id INTO restaurant_id FROM categories WHERE slug = 'restaurant';
  SELECT id INTO popup_id FROM categories WHERE slug = 'popup-store';
  SELECT id INTO culture_id FROM categories WHERE slug = 'culture';
  SELECT id INTO shopping_id FROM categories WHERE slug = 'shopping';
  SELECT id INTO exhibition_id FROM categories WHERE slug = 'exhibition';

  -- 카페 카테고리 샘플 아티클
  INSERT INTO articles (title, slug, content, excerpt, images, category_id, region, status, meta_title, meta_description) VALUES
  (
    '성수동 핫플레이스 카페 BEST 5',
    'seongsu-cafe-best-5',
    '성수동의 트렌디한 카페들을 소개합니다. 인더스트리얼한 분위기와 맛있는 커피가 만나는 곳들을 엄선했습니다...',
    '성수동에서 꼭 가봐야 할 트렌디한 카페 5곳을 소개합니다.',
    ARRAY['https://example.com/cafe1.jpg', 'https://example.com/cafe2.jpg'],
    cafe_id,
    '서울',
    'published',
    '성수동 핫플레이스 카페 BEST 5 | MAG+',
    '성수동 트렌디한 카페 추천, 인더스트리얼 분위기 카페'
  ),
  (
    '제주도 감성 카페 투어',
    'jeju-cafe-tour',
    '제주도 여행에서 빼놓을 수 없는 감성 카페들을 소개합니다. 바다뷰와 함께 즐기는 특별한 커피 타임...',
    '제주도의 아름다운 바다뷰와 함께 즐기는 감성 카페들',
    ARRAY['https://example.com/jeju1.jpg', 'https://example.com/jeju2.jpg'],
    cafe_id,
    '제주',
    'published',
    '제주도 감성 카페 투어 | MAG+',
    '제주도 바다뷰 카페, 감성 카페 추천'
  );

  -- 레스토랑 카테고리 샘플 아티클
  INSERT INTO articles (title, slug, content, excerpt, images, category_id, region, status, meta_title, meta_description) VALUES
  (
    '강남 맛집 탐방: 숨겨진 맛집 3선',
    'gangnam-hidden-restaurants',
    '강남의 숨겨진 맛집들을 발굴했습니다. 현지인들만 아는 진짜 맛집들을 소개합니다...',
    '강남 현지인들만 아는 진짜 맛집 3곳을 공개합니다.',
    ARRAY['https://example.com/restaurant1.jpg', 'https://example.com/restaurant2.jpg'],
    restaurant_id,
    '서울',
    'published',
    '강남 숨겨진 맛집 3선 | MAG+',
    '강남 맛집 추천, 현지인 맛집, 강남 숨은 맛집'
  ),
  (
    '부산 해운대 맛집 완전정복',
    'busan-haeundae-restaurants',
    '부산 해운대의 대표 맛집들을 총정리했습니다. 신선한 해산물부터 전통 음식까지...',
    '부산 해운대에서 꼭 먹어봐야 할 맛집들을 모았습니다.',
    ARRAY['https://example.com/busan1.jpg', 'https://example.com/busan2.jpg'],
    restaurant_id,
    '부산',
    'published',
    '부산 해운대 맛집 완전정복 | MAG+',
    '부산 해운대 맛집, 부산 해산물 맛집 추천'
  );

  -- 팝업스토어 카테고리 샘플 아티클
  INSERT INTO articles (title, slug, content, excerpt, images, category_id, region, status, meta_title, meta_description) VALUES
  (
    '홍대 한정판 팝업스토어 오픈',
    'hongdae-limited-popup-store',
    '홍대에 특별한 한정판 팝업스토어가 오픈했습니다. 놓치면 후회할 아이템들이 가득...',
    '홍대 한정판 팝업스토어에서만 만날 수 있는 특별한 아이템들',
    ARRAY['https://example.com/popup1.jpg', 'https://example.com/popup2.jpg'],
    popup_id,
    '서울',
    'published',
    '홍대 한정판 팝업스토어 | MAG+',
    '홍대 팝업스토어, 한정판 굿즈, 홍대 쇼핑'
  );

  -- 문화공간 카테고리 샘플 아티클
  INSERT INTO articles (title, slug, content, excerpt, images, category_id, region, status, meta_title, meta_description) VALUES
  (
    '서울 현대미술관 특별전시',
    'seoul-modern-art-exhibition',
    '서울 현대미술관에서 진행 중인 특별전시를 소개합니다. 현대 미술의 새로운 트렌드를 만나보세요...',
    '서울 현대미술관의 화제의 특별전시를 미리 만나보세요.',
    ARRAY['https://example.com/art1.jpg', 'https://example.com/art2.jpg'],
    culture_id,
    '서울',
    'published',
    '서울 현대미술관 특별전시 | MAG+',
    '서울 현대미술관, 특별전시, 현대미술 전시회'
  );

  -- 쇼핑몰 카테고리 샘플 아티클
  INSERT INTO articles (title, slug, content, excerpt, images, category_id, region, status, meta_title, meta_description) VALUES
  (
    '명동 쇼핑 완전정복 가이드',
    'myeongdong-shopping-guide',
    '명동 쇼핑의 모든 것을 담았습니다. 브랜드 매장부터 숨겨진 편집샵까지...',
    '명동에서 놓치면 안 될 쇼핑 스팟들을 총정리했습니다.',
    ARRAY['https://example.com/shopping1.jpg', 'https://example.com/shopping2.jpg'],
    shopping_id,
    '서울',
    'published',
    '명동 쇼핑 완전정복 가이드 | MAG+',
    '명동 쇼핑, 명동 편집샵, 명동 브랜드 매장'
  );

  -- 전시회 카테고리 샘플 아티클
  INSERT INTO articles (title, slug, content, excerpt, images, category_id, region, status, meta_title, meta_description) VALUES
  (
    '코엑스 대형 전시회 미리보기',
    'coex-major-exhibition-preview',
    '코엑스에서 열리는 대형 전시회를 미리 살펴봅니다. 놓치면 안 될 하이라이트들...',
    '코엑스 대형 전시회의 주요 볼거리들을 미리 확인해보세요.',
    ARRAY['https://example.com/exhibition1.jpg', 'https://example.com/exhibition2.jpg'],
    exhibition_id,
    '서울',
    'published',
    '코엑스 대형 전시회 미리보기 | MAG+',
    '코엑스 전시회, 서울 전시회, 대형 전시 이벤트'
  );

END $$;

-- 샘플 구독자 데이터 (테스트용)
INSERT INTO subscriptions (email, is_verified, subscribed_categories) VALUES
  ('test@example.com', true, ARRAY['cafe', 'restaurant']),
  ('demo@example.com', true, ARRAY['popup-store', 'culture'])
ON CONFLICT (email) DO NOTHING; 