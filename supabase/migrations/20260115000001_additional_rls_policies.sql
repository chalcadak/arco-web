-- ============================================================================
-- ARCO Additional RLS Policies
-- 추가 보안 정책 (categories, bookings, inquiries, stock_notifications, coupon_usage)
-- ============================================================================

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 카테고리 조회 가능
CREATE POLICY "Categories are viewable by everyone" 
  ON categories FOR SELECT 
  USING (true);

-- 관리자만 카테고리 관리 가능
CREATE POLICY "Admins can manage categories" 
  ON categories FOR ALL 
  USING ((auth.jwt()->>'role')::text = 'admin');

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 누구나 예약 생성 가능 (익명 사용자 포함)
CREATE POLICY "Anyone can create bookings" 
  ON bookings FOR INSERT 
  WITH CHECK (true);

-- 본인 이메일 또는 관리자만 예약 조회 가능
CREATE POLICY "Users can read own bookings" 
  ON bookings FOR SELECT 
  USING (
    customer_email = auth.jwt()->>'email' 
    OR (auth.jwt()->>'role')::text = 'admin'
  );

-- 관리자만 예약 수정/삭제 가능
CREATE POLICY "Admins can manage bookings" 
  ON bookings FOR ALL 
  USING ((auth.jwt()->>'role')::text = 'admin');

-- ============================================================================
-- INQUIRIES TABLE
-- ============================================================================
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 누구나 문의 생성 가능
CREATE POLICY "Anyone can create inquiries" 
  ON inquiries FOR INSERT 
  WITH CHECK (true);

-- 본인 이메일 또는 관리자만 문의 조회 가능
CREATE POLICY "Users can read own inquiries" 
  ON inquiries FOR SELECT 
  USING (
    email = auth.jwt()->>'email' 
    OR (auth.jwt()->>'role')::text = 'admin'
  );

-- 관리자만 문의 답변/관리 가능
CREATE POLICY "Admins can manage inquiries" 
  ON inquiries FOR UPDATE 
  USING ((auth.jwt()->>'role')::text = 'admin');

-- ============================================================================
-- STOCK_NOTIFICATIONS TABLE
-- ============================================================================
ALTER TABLE stock_notifications ENABLE ROW LEVEL SECURITY;

-- 누구나 재입고 알림 등록 가능
CREATE POLICY "Anyone can register stock notifications" 
  ON stock_notifications FOR INSERT 
  WITH CHECK (true);

-- 본인 또는 관리자만 알림 조회 가능
CREATE POLICY "Users can view own notifications" 
  ON stock_notifications FOR SELECT 
  USING (
    user_id = auth.uid() 
    OR (auth.jwt()->>'role')::text = 'admin'
  );

-- 관리자만 알림 관리 가능
CREATE POLICY "Admins can manage notifications" 
  ON stock_notifications FOR ALL 
  USING ((auth.jwt()->>'role')::text = 'admin');

-- ============================================================================
-- COUPON_USAGE TABLE
-- ============================================================================
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- 시스템(인증된 사용자)만 쿠폰 사용 기록 생성
CREATE POLICY "System can record coupon usage" 
  ON coupon_usage FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- 본인 또는 관리자만 사용 내역 조회
CREATE POLICY "Users can view own usage" 
  ON coupon_usage FOR SELECT 
  USING (
    user_id = auth.uid() 
    OR (auth.jwt()->>'role')::text = 'admin'
  );

-- 관리자만 사용 내역 관리 가능
CREATE POLICY "Admins can manage usage" 
  ON coupon_usage FOR ALL 
  USING ((auth.jwt()->>'role')::text = 'admin');

-- ============================================================================
-- COUPONS TABLE (읽기 정책 추가)
-- ============================================================================
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 활성화된 쿠폰은 모두 조회 가능
CREATE POLICY "Active coupons are viewable by everyone" 
  ON coupons FOR SELECT 
  USING (is_active = TRUE OR (auth.jwt()->>'role')::text = 'admin');

-- 관리자만 쿠폰 관리 가능
CREATE POLICY "Admins can manage coupons" 
  ON coupons FOR ALL 
  USING ((auth.jwt()->>'role')::text = 'admin');

-- ============================================================================
-- COMPLETE
-- ============================================================================

COMMENT ON POLICY "Categories are viewable by everyone" ON categories 
  IS '모든 사용자가 카테고리를 조회할 수 있습니다';

COMMENT ON POLICY "Anyone can create bookings" ON bookings 
  IS '익명 사용자를 포함한 모든 사용자가 예약을 생성할 수 있습니다';

COMMENT ON POLICY "Anyone can create inquiries" ON inquiries 
  IS '익명 사용자를 포함한 모든 사용자가 문의를 생성할 수 있습니다';

COMMENT ON POLICY "Active coupons are viewable by everyone" ON coupons 
  IS '활성화된 쿠폰은 모든 사용자가 조회할 수 있습니다';
