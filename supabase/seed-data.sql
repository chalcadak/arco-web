-- ============================================
-- ARCO 샘플 데이터 시딩
-- ============================================

-- 1. 카테고리 데이터
INSERT INTO public.categories (name, slug, description) VALUES
('의류', 'clothing', '반려견을 위한 프리미엄 의류'),
('액세서리', 'accessories', '스타일리시한 반려견 액세서리'),
('아웃도어', 'outdoor', '야외 활동을 위한 기능성 제품'),
('홈웨어', 'homewear', '집에서 편안한 반려견 의류'),
('특별한날', 'special', '특별한 날을 위한 의상')
ON CONFLICT (slug) DO NOTHING;

-- 2. 상품 데이터 (20개)
INSERT INTO public.products (
  name, slug, description, price, category_id, images, sizes, colors, 
  stock_quantity, is_active, tags
) VALUES
-- 의류 카테고리
(
  '프리미엄 울 니트 스웨터',
  'premium-wool-knit-sweater',
  '100% 메리노 울로 제작된 프리미엄 니트 스웨터입니다. 부드럽고 따뜻하며 세련된 디자인으로 반려견을 더욱 돋보이게 합니다.',
  85000,
  (SELECT id FROM categories WHERE slug = 'clothing' LIMIT 1),
  ARRAY['/products/wool-sweater-1.jpg', '/products/wool-sweater-2.jpg'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Beige', 'Gray', 'Navy'],
  50,
  true,
  ARRAY['신상품', '베스트셀러']
),
(
  '방수 레인코트',
  'waterproof-raincoat',
  '완벽한 방수 기능의 레인코트로 비 오는 날에도 산책을 즐길 수 있습니다. 반사 스트립으로 야간 안전성도 확보했습니다.',
  65000,
  (SELECT id FROM categories WHERE slug = 'clothing' LIMIT 1),
  ARRAY['/products/raincoat-1.jpg', '/products/raincoat-2.jpg'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Yellow', 'Red', 'Blue'],
  40,
  true,
  ARRAY['신상품']
),
(
  '캐시미어 카디건',
  'cashmere-cardigan',
  '최고급 캐시미어로 제작된 럭셔리 카디건입니다. 극도로 부드러운 촉감과 우아한 실루엣이 특징입니다.',
  125000,
  (SELECT id FROM categories WHERE slug = 'clothing' LIMIT 1),
  ARRAY['/products/cashmere-cardigan-1.jpg', '/products/cashmere-cardigan-2.jpg'],
  ARRAY['S', 'M', 'L'],
  ARRAY['White', 'Pink', 'Black'],
  25,
  true,
  ARRAY['베스트셀러']
),
(
  '데님 재킷',
  'denim-jacket',
  '클래식한 데님 재킷으로 반려견에게 트렌디한 스타일을 선사합니다. 내구성이 뛰어나고 활동하기 편합니다.',
  75000,
  (SELECT id FROM categories WHERE slug = 'clothing' LIMIT 1),
  ARRAY['/products/denim-jacket-1.jpg'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Blue', 'Black'],
  35,
  true,
  ARRAY[]
),
(
  '후드 티셔츠',
  'hoodie-tshirt',
  '편안한 코튼 소재의 후드 티셔츠입니다. 캐주얼한 스타일과 실용성을 겸비했습니다.',
  45000,
  (SELECT id FROM categories WHERE slug = 'homewear' LIMIT 1),
  ARRAY['/products/hoodie-1.jpg', '/products/hoodie-2.jpg'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Gray', 'Black', 'Navy', 'Pink'],
  60,
  true,
  ARRAY['베스트셀러']
),

-- 액세서리 카테고리
(
  '실크 리본 목걸이',
  'silk-ribbon-necklace',
  '프리미엄 실크로 제작된 우아한 리본 목걸이입니다. 특별한 날을 더욱 빛나게 합니다.',
  35000,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1),
  ARRAY['/products/silk-ribbon-1.jpg'],
  ARRAY['One Size'],
  ARRAY['Pink', 'White', 'Red'],
  45,
  true,
  ARRAY['신상품']
),
(
  '가죽 하네스 세트',
  'leather-harness-set',
  '이탈리아산 천연 가죽으로 제작된 프리미엄 하네스와 리드줄 세트입니다.',
  95000,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1),
  ARRAY['/products/leather-harness-1.jpg', '/products/leather-harness-2.jpg'],
  ARRAY['S', 'M', 'L'],
  ARRAY['Brown', 'Black', 'Tan'],
  30,
  true,
  ARRAY['베스트셀러']
),
(
  '보석 장식 목걸이',
  'jeweled-collar',
  '스와로브스키 크리스탈로 장식된 럭셔리 목걸이입니다. 특별한 이벤트에 완벽합니다.',
  155000,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1),
  ARRAY['/products/jeweled-collar-1.jpg'],
  ARRAY['S', 'M'],
  ARRAY['Silver', 'Gold'],
  15,
  true,
  ARRAY[]
),
(
  '모자 컬렉션',
  'hat-collection',
  '다양한 스타일의 모자 컬렉션입니다. 햇빛 차단과 패션을 동시에!',
  32000,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1),
  ARRAY['/products/hat-collection-1.jpg', '/products/hat-collection-2.jpg'],
  ARRAY['S', 'M', 'L'],
  ARRAY['Beige', 'Navy', 'Pink'],
  50,
  true,
  ARRAY['신상품']
),
(
  '나비넥타이 세트',
  'bow-tie-set',
  '포멀한 자리를 위한 클래식 나비넥타이 세트입니다. 5가지 디자인 포함.',
  28000,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1),
  ARRAY['/products/bow-tie-1.jpg'],
  ARRAY['One Size'],
  ARRAY['Black', 'Navy', 'Red'],
  70,
  true,
  ARRAY[]
),

-- 아웃도어 카테고리
(
  '등산 조끼',
  'hiking-vest',
  '통기성과 보온성을 겸비한 등산용 조끼입니다. 포켓 수납 공간 포함.',
  68000,
  (SELECT id FROM categories WHERE slug = 'outdoor' LIMIT 1),
  ARRAY['/products/hiking-vest-1.jpg', '/products/hiking-vest-2.jpg'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Orange', 'Green', 'Gray'],
  40,
  true,
  ARRAY['신상품']
),
(
  '방한 패딩 점퍼',
  'winter-padding-jumper',
  '겨울철 필수 아이템! 오리털 충전재로 최고의 보온성을 제공합니다.',
  98000,
  (SELECT id FROM categories WHERE slug = 'outdoor' LIMIT 1),
  ARRAY['/products/padding-jumper-1.jpg', '/products/padding-jumper-2.jpg'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Navy', 'Red'],
  55,
  true,
  ARRAY['베스트셀러']
),
(
  '여름 쿨링 조끼',
  'summer-cooling-vest',
  '특수 쿨링 소재로 더운 여름에도 시원하게! 물에 적셔 사용하는 기능성 조끼입니다.',
  42000,
  (SELECT id FROM categories WHERE slug = 'outdoor' LIMIT 1),
  ARRAY['/products/cooling-vest-1.jpg'],
  ARRAY['S', 'M', 'L'],
  ARRAY['Blue', 'Green'],
  38,
  true,
  ARRAY[]
),
(
  'LED 안전 조끼',
  'led-safety-vest',
  'LED 라이트가 내장된 야간 산책용 안전 조끼입니다. USB 충전식.',
  55000,
  (SELECT id FROM categories WHERE slug = 'outdoor' LIMIT 1),
  ARRAY['/products/led-vest-1.jpg', '/products/led-vest-2.jpg'],
  ARRAY['M', 'L', 'XL'],
  ARRAY['Orange', 'Yellow'],
  30,
  true,
  ARRAY['신상품']
),

-- 홈웨어 카테고리
(
  '코튼 파자마 세트',
  'cotton-pajama-set',
  '100% 순면 소재의 편안한 파자마 세트입니다. 집에서 편안하게!',
  38000,
  (SELECT id FROM categories WHERE slug = 'homewear' LIMIT 1),
  ARRAY['/products/pajama-1.jpg', '/products/pajama-2.jpg'],
  ARRAY['S', 'M', 'L'],
  ARRAY['White', 'Pink', 'Blue'],
  45,
  true,
  ARRAY[]
),
(
  '플리스 가운',
  'fleece-gown',
  '부드러운 플리스 소재의 가운입니다. 목욕 후나 휴식 시간에 완벽합니다.',
  48000,
  (SELECT id FROM categories WHERE slug = 'homewear' LIMIT 1),
  ARRAY['/products/fleece-gown-1.jpg'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Beige', 'Gray', 'Pink'],
  40,
  true,
  ARRAY['베스트셀러']
),

-- 특별한날 카테고리
(
  '웨딩 턱시도',
  'wedding-tuxedo',
  '결혼식을 위한 격식있는 턱시도입니다. 나비넥타이와 커머번드 포함.',
  145000,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/products/tuxedo-1.jpg', '/products/tuxedo-2.jpg'],
  ARRAY['S', 'M', 'L'],
  ARRAY['Black', 'Navy'],
  20,
  true,
  ARRAY[]
),
(
  '생일 파티 드레스',
  'birthday-party-dress',
  '생일 파티를 위한 화려한 드레스입니다. 반짝이는 장식과 레이스가 특징입니다.',
  78000,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/products/party-dress-1.jpg', '/products/party-dress-2.jpg'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Pink', 'Purple', 'White'],
  35,
  true,
  ARRAY['신상품']
),
(
  '할로윈 코스튬 세트',
  'halloween-costume-set',
  '다양한 할로윈 코스튬 세트입니다. 모자와 액세서리 포함.',
  52000,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/products/halloween-1.jpg'],
  ARRAY['S', 'M', 'L'],
  ARRAY['Orange', 'Black', 'Purple'],
  25,
  true,
  ARRAY[]
),
(
  '크리스마스 산타 의상',
  'christmas-santa-costume',
  '크리스마스를 위한 귀여운 산타 의상입니다. 모자와 벨트 포함.',
  58000,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/products/santa-costume-1.jpg', '/products/santa-costume-2.jpg'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Red', 'Green'],
  45,
  true,
  ARRAY[]
);

-- 3. 촬영룩 데이터 (10개)
INSERT INTO public.photoshoot_looks (
  name, slug, description, price, duration_minutes, category_id, 
  images, included_items, is_active, tags
) VALUES
(
  '클래식 포트레이트 룩',
  'classic-portrait-look',
  '타임리스한 클래식 스타일의 포트레이트 촬영입니다. 전문 조명과 배경으로 품격있는 사진을 완성합니다.',
  250000,
  60,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/photoshoots/classic-portrait-1.jpg', '/photoshoots/classic-portrait-2.jpg'],
  ARRAY['전문 촬영 60분', '보정 사진 20장', '원본 파일 제공', '액자 1개'],
  true,
  ARRAY['인기', '신규']
),
(
  '야외 자연 촬영',
  'outdoor-nature-shoot',
  '아름다운 자연을 배경으로 한 야외 촬영입니다. 계절의 아름다움과 함께하는 특별한 순간을 담습니다.',
  320000,
  90,
  (SELECT id FROM categories WHERE slug = 'outdoor' LIMIT 1),
  ARRAY['/photoshoots/outdoor-nature-1.jpg', '/photoshoots/outdoor-nature-2.jpg'],
  ARRAY['전문 촬영 90분', '보정 사진 30장', '원본 파일 제공', '포토북 1권'],
  true,
  ARRAY['인기']
),
(
  '스튜디오 패션 촬영',
  'studio-fashion-shoot',
  '패션 화보 스타일의 스튜디오 촬영입니다. 다양한 포즈와 의상 체인지를 포함합니다.',
  380000,
  120,
  (SELECT id FROM categories WHERE slug = 'clothing' LIMIT 1),
  ARRAY['/photoshoots/fashion-shoot-1.jpg', '/photoshoots/fashion-shoot-2.jpg'],
  ARRAY['전문 촬영 120분', '의상 3벌 포함', '보정 사진 40장', '원본 파일 제공', '대형 액자 1개'],
  true,
  ARRAY['신규']
),
(
  '가족 단체 촬영',
  'family-group-shoot',
  '온 가족이 함께하는 따뜻한 촬영입니다. 반려견과 함께하는 행복한 순간을 담습니다.',
  420000,
  90,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/photoshoots/family-shoot-1.jpg'],
  ARRAY['전문 촬영 90분', '보정 사진 35장', '원본 파일 제공', '포토북 2권'],
  true,
  ARRAY['인기']
),
(
  '반려견 프로필 촬영',
  'pet-profile-shoot',
  '반려견만을 위한 집중 프로필 촬영입니다. SNS 프로필이나 명함 제작에 완벽합니다.',
  180000,
  45,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1),
  ARRAY['/photoshoots/profile-shoot-1.jpg', '/photoshoots/profile-shoot-2.jpg'],
  ARRAY['전문 촬영 45분', '보정 사진 15장', '원본 파일 제공'],
  true,
  ARRAY['신규']
),
(
  '크리스마스 테마 촬영',
  'christmas-theme-shoot',
  '크리스마스 분위기가 가득한 특별 촬영입니다. 산타 의상과 크리스마스 소품 포함.',
  290000,
  75,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/photoshoots/christmas-shoot-1.jpg', '/photoshoots/christmas-shoot-2.jpg'],
  ARRAY['전문 촬영 75분', '크리스마스 의상 포함', '보정 사진 25장', '원본 파일 제공', '크리스마스 카드 10장'],
  true,
  ARRAY['인기']
),
(
  '생일 파티 촬영',
  'birthday-party-shoot',
  '생일을 기념하는 특별한 촬영입니다. 파티 소품과 케이크 포함.',
  260000,
  60,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/photoshoots/birthday-shoot-1.jpg'],
  ARRAY['전문 촬영 60분', '파티 소품 제공', '보정 사진 20장', '원본 파일 제공'],
  true,
  ARRAY[]
),
(
  '비치 섬머 촬영',
  'beach-summer-shoot',
  '시원한 바다를 배경으로 한 여름 촬영입니다. 상쾌하고 활기찬 분위기를 담습니다.',
  350000,
  90,
  (SELECT id FROM categories WHERE slug = 'outdoor' LIMIT 1),
  ARRAY['/photoshoots/beach-shoot-1.jpg', '/photoshoots/beach-shoot-2.jpg'],
  ARRAY['전문 촬영 90분', '보정 사진 30장', '원본 파일 제공', '포토북 1권'],
  true,
  ARRAY['인기']
),
(
  '웨딩 커플 촬영',
  'wedding-couple-shoot',
  '결혼식 전 예비 부부와 반려견이 함께하는 웨딩 촬영입니다.',
  480000,
  120,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/photoshoots/wedding-shoot-1.jpg', '/photoshoots/wedding-shoot-2.jpg'],
  ARRAY['전문 촬영 120분', '웨딩 의상 포함', '보정 사진 50장', '원본 파일 제공', '대형 액자 2개', '포토북 2권'],
  true,
  ARRAY['신규']
),
(
  '한복 전통 촬영',
  'hanbok-traditional-shoot',
  '아름다운 한복을 입고 진행하는 전통 촬영입니다. 한국의 미를 담습니다.',
  320000,
  75,
  (SELECT id FROM categories WHERE slug = 'special' LIMIT 1),
  ARRAY['/photoshoots/hanbok-shoot-1.jpg'],
  ARRAY['전문 촬영 75분', '한복 의상 포함', '보정 사진 25장', '원본 파일 제공', '전통 액자 1개'],
  true,
  ARRAY[]
);

-- 4. 쿠폰 데이터
INSERT INTO public.coupons (
  code, name, description, discount_type, discount_value, 
  min_order_amount, max_discount_amount, usage_limit, 
  valid_from, valid_until, is_active, applicable_to
) VALUES
(
  'WELCOME10',
  '신규 회원 환영 쿠폰',
  '첫 구매 시 10% 할인 혜택을 드립니다!',
  'percentage',
  10,
  0,
  50000,
  100,
  NOW(),
  NOW() + INTERVAL '30 days',
  true,
  'all'
),
(
  'SUMMER2024',
  '여름 시즌 특별 할인',
  '여름 시즌 전 상품 15% 할인!',
  'percentage',
  15,
  50000,
  100000,
  50,
  NOW(),
  NOW() + INTERVAL '60 days',
  true,
  'all'
),
(
  'FIRSTORDER',
  '첫 주문 5만원 할인',
  '첫 주문 시 5만원 즉시 할인!',
  'fixed',
  50000,
  200000,
  NULL,
  30,
  NOW(),
  NOW() + INTERVAL '90 days',
  true,
  'all'
),
(
  'PHOTO20',
  '촬영 서비스 20% 할인',
  '촬영 예약 시 20% 특별 할인 쿠폰',
  'percentage',
  20,
  100000,
  80000,
  20,
  NOW(),
  NOW() + INTERVAL '45 days',
  true,
  'photoshoots'
),
(
  'VIP100',
  'VIP 고객 10만원 할인',
  'VIP 고객님을 위한 특별 할인 쿠폰',
  'fixed',
  100000,
  500000,
  NULL,
  10,
  NOW(),
  NOW() + INTERVAL '180 days',
  true,
  'all'
);

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ 샘플 데이터 시딩 완료!';
  RAISE NOTICE '- 카테고리: 5개';
  RAISE NOTICE '- 상품: 20개';
  RAISE NOTICE '- 촬영룩: 10개';
  RAISE NOTICE '- 쿠폰: 5개';
END $$;
