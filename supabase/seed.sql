-- ARCO Database Seed Data
-- Sample data for development and testing
-- Created: 2026-01-10

-- ============================================================================
-- SAMPLE PRODUCTS (판매상품)
-- ============================================================================

INSERT INTO products (name, description, price, stock_quantity, category_id, slug, sizes, colors, tags, is_active) VALUES
(
  '클래식 코튼 티셔츠',
  '부드러운 코튼 소재로 제작된 일상용 티셔츠입니다. 사계절 착용 가능하며 세탁이 간편합니다.',
  35000,
  50,
  2, -- 이너웨어
  'classic-cotton-tshirt',
  '["S", "M", "L", "XL"]'::jsonb,
  '["White", "Black", "Navy"]'::jsonb,
  '["베스트셀러", "기본템"]'::jsonb,
  TRUE
),
(
  '프리미엄 패딩 재킷',
  '겨울철 필수 아이템! 보온성이 뛰어난 고급 패딩 재킷입니다.',
  89000,
  30,
  1, -- 아우터
  'premium-padding-jacket',
  '["S", "M", "L", "XL"]'::jsonb,
  '["Black", "Beige", "Navy"]'::jsonb,
  '["신상품", "겨울필수"]'::jsonb,
  TRUE
),
(
  '레인코트',
  '비오는 날에도 멋지게! 방수 기능이 있는 레인코트입니다.',
  45000,
  40,
  1, -- 아우터
  'raincoat',
  '["S", "M", "L", "XL"]'::jsonb,
  '["Yellow", "Red", "Blue"]'::jsonb,
  '["실용적", "방수"]'::jsonb,
  TRUE
),
(
  '리본 스카프',
  '목 주변을 따뜻하고 스타일리시하게 연출할 수 있는 스카프입니다.',
  15000,
  100,
  3, -- 액세서리
  'ribbon-scarf',
  '["Free"]'::jsonb,
  '["Pink", "Blue", "Beige"]'::jsonb,
  '["액세서리", "선물추천"]'::jsonb,
  TRUE
);

-- ============================================================================
-- SAMPLE PHOTOSHOOT LOOKS (촬영룩)
-- ============================================================================

INSERT INTO photoshoot_looks (name, description, price, duration_minutes, category_id, slug, sizes, tags, included_items, requirements, is_active) VALUES
(
  '빈티지 에디토리얼',
  '클래식하고 우아한 빈티지 감성의 촬영입니다. 고급스러운 의상과 소품으로 특별한 순간을 기록하세요.',
  150000,
  90,
  5, -- 에디토리얼
  'vintage-editorial',
  '["S", "M", "L", "XL"]'::jsonb,
  '["빈티지", "클래식", "우아함"]'::jsonb,
  '["빈티지 의상", "소품", "보정 15장", "원본 전체"]'::jsonb,
  '촬영 1주일 전 예약 필수. 반려견의 미용 상태를 깨끗하게 해주세요.',
  TRUE
),
(
  '봄날의 피크닉',
  '봄 시즌 한정! 꽃과 함께하는 밝고 화사한 피크닉 콘셉트 촬영입니다.',
  120000,
  60,
  6, -- 시즌 스페셜
  'spring-picnic',
  '["S", "M", "L"]'::jsonb,
  '["봄", "시즌한정", "화사함"]'::jsonb,
  '["봄 의상", "꽃 소품", "피크닉 세트", "보정 10장"]'::jsonb,
  '야외 촬영으로 날씨에 따라 일정 변경 가능. 3-5월 한정.',
  TRUE
),
(
  '생일파티 스페셜',
  '반려견의 생일을 특별하게! 파티 콘셉트의 화려한 촬영입니다.',
  100000,
  60,
  7, -- 특별한 날
  'birthday-party-special',
  '["S", "M", "L", "XL"]'::jsonb,
  '["생일", "파티", "축하"]'::jsonb,
  '["파티 의상", "생일 모자", "케이크 소품", "보정 10장"]'::jsonb,
  '생일 케이크(반려견용)는 별도 옵션입니다.',
  TRUE
);

-- ============================================================================
-- SAMPLE ADMIN USER
-- ============================================================================

-- Note: This should be linked to an actual Supabase Auth user
-- In production, create the user through Supabase Auth first, then link here

INSERT INTO users (id, email, name, phone) VALUES
(
  '00000000-0000-0000-0000-000000000001', -- Replace with actual UUID from Supabase Auth
  'admin@arco.com',
  'ARCO 관리자',
  '010-0000-0000'
);

INSERT INTO admin_users (id, role, is_active) VALUES
(
  '00000000-0000-0000-0000-000000000001', -- Same UUID as above
  'super_admin',
  TRUE
);

-- ============================================================================
-- SEED DATA COMPLETE
-- ============================================================================

-- Display summary
DO $$
BEGIN
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'ARCO Database Seed Data - Complete';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'Products inserted: %', (SELECT COUNT(*) FROM products);
  RAISE NOTICE 'Photoshoot looks inserted: %', (SELECT COUNT(*) FROM photoshoot_looks);
  RAISE NOTICE 'Categories: %', (SELECT COUNT(*) FROM categories);
  RAISE NOTICE 'Admin users: %', (SELECT COUNT(*) FROM admin_users);
  RAISE NOTICE '=================================================';
END $$;
