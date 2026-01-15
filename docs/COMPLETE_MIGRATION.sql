-- ARCO Database Schema Migration
-- Initial schema for premium dog fashion platform
-- Created: 2026-01-10

-- Note: PostgreSQL 13+ has gen_random_uuid() built-in, no extension needed
-- But we keep uuid-ossp for compatibility if needed elsewhere
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE users IS '회원 정보';

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('product', 'photoshoot')) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE categories IS '카테고리 (판매상품/촬영룩)';

-- Insert default categories
INSERT INTO categories (name, slug, type, display_order) VALUES
  ('아우터', 'outer', 'product', 1),
  ('이너웨어', 'innerwear', 'product', 2),
  ('액세서리', 'accessories', 'product', 3),
  ('신발', 'shoes', 'product', 4),
  ('에디토리얼', 'editorial', 'photoshoot', 1),
  ('시즌 스페셜', 'season-special', 'photoshoot', 2),
  ('특별한 날', 'special-day', 'photoshoot', 3);

-- ============================================================================
-- PRODUCTS TABLE (판매상품)
-- ============================================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- 원 단위
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- 이미지/미디어
  thumbnail_url TEXT,
  images JSONB, -- [{url, alt, order}]
  video_url TEXT,
  
  -- 메타데이터
  sizes JSONB, -- ["S", "M", "L", "XL"]
  colors JSONB, -- ["Black", "Blue"]
  tags JSONB, -- ["베스트셀러", "신상품"]
  
  -- SEO
  slug VARCHAR(200) UNIQUE NOT NULL,
  meta_title VARCHAR(100),
  meta_description TEXT,
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE products IS '판매상품';

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- ============================================================================
-- PHOTOSHOOT_LOOKS TABLE (촬영룩)
-- ============================================================================
CREATE TABLE photoshoot_looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- 촬영 가격
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- 이미지/미디어
  thumbnail_url TEXT,
  images JSONB,
  video_url TEXT,
  
  -- 촬영 안내
  included_items JSONB, -- ["의상", "소품", "보정 10장"]
  requirements TEXT,
  
  -- 메타데이터
  sizes JSONB,
  tags JSONB,
  slug VARCHAR(200) UNIQUE NOT NULL,
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE photoshoot_looks IS '촬영룩';

CREATE INDEX idx_photoshoot_looks_category ON photoshoot_looks(category_id);
CREATE INDEX idx_photoshoot_looks_slug ON photoshoot_looks(slug);
CREATE INDEX idx_photoshoot_looks_is_active ON photoshoot_looks(is_active);

-- ============================================================================
-- ORDERS TABLE (주문)
-- ============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- 주문자 정보
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- 배송 정보
  shipping_name VARCHAR(100) NOT NULL,
  shipping_phone VARCHAR(20) NOT NULL,
  shipping_postcode VARCHAR(10) NOT NULL,
  shipping_address VARCHAR(255) NOT NULL,
  shipping_address_detail VARCHAR(255),
  shipping_memo TEXT,
  
  -- 금액
  total_amount INTEGER NOT NULL,
  shipping_fee INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  final_amount INTEGER NOT NULL,
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  
  -- 결제 정보
  payment_method VARCHAR(50),
  payment_data JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- 배송 정보
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- 취소/환불
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE orders IS '주문';

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================================================
-- ORDER_ITEMS TABLE (주문 상품)
-- ============================================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  
  -- 주문 당시 정보 (스냅샷)
  product_name VARCHAR(200) NOT NULL,
  product_thumbnail TEXT,
  
  -- 옵션
  size VARCHAR(20),
  color VARCHAR(50),
  
  -- 금액
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE order_items IS '주문 상품';

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- BOOKINGS TABLE (촬영 예약)
-- ============================================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  photoshoot_look_id UUID REFERENCES photoshoot_looks(id),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- 예약자 정보
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- 반려견 정보
  pet_name VARCHAR(100) NOT NULL,
  pet_breed VARCHAR(100),
  pet_age INTEGER,
  pet_weight DECIMAL(5,2),
  pet_size VARCHAR(20),
  pet_notes TEXT,
  
  -- 예약 일시
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'paid', 'completed', 'cancelled')),
  
  -- 결제 정보
  price INTEGER NOT NULL,
  payment_method VARCHAR(50),
  payment_data JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- 촬영 완료
  completed_at TIMESTAMP WITH TIME ZONE,
  photographer_notes TEXT,
  
  -- 취소
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE bookings IS '촬영 예약';

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_photoshoot_look_id ON bookings(photoshoot_look_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================================================
-- GALLERIES TABLE (납품 갤러리)
-- ============================================================================
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- 토큰 기반 접근
  access_token VARCHAR(100) UNIQUE NOT NULL,
  
  -- 갤러리 정보
  title VARCHAR(200),
  description TEXT,
  
  -- 접근 제어
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  password VARCHAR(255),
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  
  -- 고객 알림
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE galleries IS '납품 갤러리';

CREATE INDEX idx_galleries_booking_id ON galleries(booking_id);
CREATE INDEX idx_galleries_access_token ON galleries(access_token);
CREATE INDEX idx_galleries_is_active ON galleries(is_active);

-- ============================================================================
-- GALLERY_IMAGES TABLE (갤러리 이미지)
-- ============================================================================
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  
  -- 이미지 정보
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  filename VARCHAR(255) NOT NULL,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  format VARCHAR(20),
  
  -- 메타데이터
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- 통계
  download_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE gallery_images IS '갤러리 이미지';

CREATE INDEX idx_gallery_images_gallery_id ON gallery_images(gallery_id);
CREATE INDEX idx_gallery_images_display_order ON gallery_images(gallery_id, display_order);

-- ============================================================================
-- ADMIN_USERS TABLE (관리자)
-- ============================================================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES users(id),
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'staff')),
  permissions JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE admin_users IS '관리자';

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  new_number VARCHAR(50);
BEGIN
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Function to generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  new_number VARCHAR(50);
BEGIN
  new_number := 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('booking_number_seq')::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS booking_number_seq START 1;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photoshoot_looks_updated_at BEFORE UPDATE ON photoshoot_looks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON galleries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA COMPLETE
-- ============================================================================
-- ARCO Database RLS Policies
-- Row Level Security for data access control
-- Created: 2026-01-10

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PUBLIC READ ACCESS (Products, Photoshoot Looks, Categories)
-- ============================================================================

-- Anyone can view active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

-- Anyone can view active photoshoot looks
CREATE POLICY "Public can view active photoshoot looks"
  ON photoshoot_looks FOR SELECT
  USING (is_active = TRUE);

-- Anyone can view categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (TRUE);

-- ============================================================================
-- USER POLICIES (Own Data Access)
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own order items
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- GALLERY POLICIES (Token-based Access)
-- ============================================================================

-- Public can view active galleries (token validation in application)
CREATE POLICY "Public can view active galleries"
  ON galleries FOR SELECT
  USING (is_active = TRUE);

-- Public can view gallery images if gallery is active
CREATE POLICY "Public can view gallery images"
  ON gallery_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = gallery_images.gallery_id
      AND galleries.is_active = TRUE
    )
  );

-- ============================================================================
-- ADMIN POLICIES (Full Access)
-- ============================================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admins can do everything on products
CREATE POLICY "Admins have full access to products"
  ON products FOR ALL
  USING (is_admin());

-- Admins can do everything on photoshoot_looks
CREATE POLICY "Admins have full access to photoshoot_looks"
  ON photoshoot_looks FOR ALL
  USING (is_admin());

-- Admins can do everything on orders
CREATE POLICY "Admins have full access to orders"
  ON orders FOR ALL
  USING (is_admin());

-- Admins can do everything on order_items
CREATE POLICY "Admins have full access to order_items"
  ON order_items FOR ALL
  USING (is_admin());

-- Admins can do everything on bookings
CREATE POLICY "Admins have full access to bookings"
  ON bookings FOR ALL
  USING (is_admin());

-- Admins can do everything on galleries
CREATE POLICY "Admins have full access to galleries"
  ON galleries FOR ALL
  USING (is_admin());

-- Admins can do everything on gallery_images
CREATE POLICY "Admins have full access to gallery_images"
  ON gallery_images FOR ALL
  USING (is_admin());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (is_admin());

-- Admins can view all categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- ============================================================================
-- INSERT POLICIES (Anonymous Users)
-- ============================================================================

-- Anonymous users can create orders (non-member purchase)
CREATE POLICY "Anonymous users can create orders"
  ON orders FOR INSERT
  WITH CHECK (TRUE);

-- Anonymous users can create order items
CREATE POLICY "Anonymous users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (TRUE);

-- Anonymous users can create bookings (non-member booking)
CREATE POLICY "Anonymous users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (TRUE);

-- ============================================================================
-- RLS POLICIES COMPLETE
-- ============================================================================
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 주문 정보
  order_number VARCHAR(20) UNIQUE NOT NULL,
  
  -- 고객 정보
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- 배송 정보
  shipping_address TEXT NOT NULL,
  shipping_zipcode VARCHAR(10),
  shipping_request TEXT,
  
  -- 주문 상품 (JSON 배열)
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- 금액 정보
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping_fee INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL DEFAULT 0,
  
  -- 결제 정보
  payment_key VARCHAR(255),
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP,
  
  -- 주문 상태
  status VARCHAR(20) DEFAULT 'pending',
  -- pending: 결제 대기
  -- paid: 결제 완료
  -- preparing: 배송 준비
  -- shipping: 배송 중
  -- delivered: 배송 완료
  -- cancelled: 취소
  
  -- 배송 정보
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  -- 메타
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Users can read their own orders" ON orders;
DROP POLICY IF EXISTS "Admins have full access to orders" ON orders;

-- Policies
-- 1. Anyone can create orders (for checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- 2. Users can read their own orders (by email)
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  USING (customer_email = auth.jwt()->>'email');

-- 3. Admins have full access (simplified - check JWT claim)
-- Note: Admin role should be set in JWT claims by auth system
CREATE POLICY "Admins have full access to orders"
  ON orders FOR ALL
  USING (
    (auth.jwt()->>'role')::text = 'admin'
  );

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_order_number TEXT;
  order_count INTEGER;
BEGIN
  -- Get today's order count
  SELECT COUNT(*) INTO order_count
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Generate order number: YYYYMMDD-XXXX
  new_order_number := TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((order_count + 1)::TEXT, 4, '0');
  
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Update updated_at on update
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_orders_updated_at ON orders;
CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
-- Add video_uid column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_uid VARCHAR(255);

-- Add video_uid column to photoshoot_looks table
ALTER TABLE photoshoot_looks ADD COLUMN IF NOT EXISTS video_uid VARCHAR(255);

-- Add comments
COMMENT ON COLUMN products.video_uid IS 'Cloudflare Stream video UID';
COMMENT ON COLUMN photoshoot_looks.video_uid IS 'Cloudflare Stream video UID';
-- Create reviews table for product and photoshoot reviews
-- Migration: 20260114000001_create_reviews_table.sql

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGSERIAL PRIMARY KEY,
  
  -- Polymorphic relationship: can review either product or photoshoot
  reviewable_type TEXT NOT NULL CHECK (reviewable_type IN ('product', 'photoshoot')),
  reviewable_id BIGINT NOT NULL,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Author info
  author_name TEXT NOT NULL,
  author_email TEXT,
  
  -- Approval workflow
  is_approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  
  -- Helpful votes (future feature)
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for performance
  CONSTRAINT reviews_reviewable_check CHECK (
    (reviewable_type = 'product' AND reviewable_id IN (SELECT id FROM products)) OR
    (reviewable_type = 'photoshoot' AND reviewable_id IN (SELECT id FROM photoshoot_looks))
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_reviewable ON public.reviews(reviewable_type, reviewable_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can read approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON public.reviews
  FOR SELECT
  USING (is_approved = true);

-- Anyone can insert reviews (but they need approval)
CREATE POLICY "Anyone can create reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- Admin can view all reviews
CREATE POLICY "Admin can view all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin can update reviews (approve/reject)
CREATE POLICY "Admin can update reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin can delete reviews
CREATE POLICY "Admin can delete reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS reviews_updated_at_trigger ON public.reviews;
CREATE TRIGGER reviews_updated_at_trigger
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_reviews_updated_at();

-- Function to get average rating for a reviewable item
CREATE OR REPLACE FUNCTION get_average_rating(p_reviewable_type TEXT, p_reviewable_id BIGINT)
RETURNS TABLE(average_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating)::NUMERIC, 2) as average_rating,
    COUNT(*)::BIGINT as review_count
  FROM public.reviews
  WHERE 
    reviewable_type = p_reviewable_type 
    AND reviewable_id = p_reviewable_id
    AND is_approved = true;
END;
$$ LANGUAGE plpgsql;

-- Comment on table
COMMENT ON TABLE public.reviews IS 'Product and photoshoot reviews with approval workflow';
-- Create stock notifications table
-- Migration: 20260114000002_create_stock_notifications_table.sql

CREATE TABLE IF NOT EXISTS public.stock_notifications (
  id BIGSERIAL PRIMARY KEY,
  
  -- Product reference
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  
  -- Customer info
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  -- Notification status
  is_notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate notifications for same email + product
  UNIQUE(product_id, customer_email)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stock_notifications_product ON public.stock_notifications(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_notifications_email ON public.stock_notifications(customer_email);
CREATE INDEX IF NOT EXISTS idx_stock_notifications_status ON public.stock_notifications(is_notified);

-- Enable RLS
ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can insert stock notifications
CREATE POLICY "Anyone can create stock notifications"
  ON public.stock_notifications
  FOR INSERT
  WITH CHECK (true);

-- Admin can view all notifications
CREATE POLICY "Admin can view all stock notifications"
  ON public.stock_notifications
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin can update notifications (mark as notified)
CREATE POLICY "Admin can update stock notifications"
  ON public.stock_notifications
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin can delete notifications
CREATE POLICY "Admin can delete stock notifications"
  ON public.stock_notifications
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_stock_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS stock_notifications_updated_at_trigger ON public.stock_notifications;
CREATE TRIGGER stock_notifications_updated_at_trigger
  BEFORE UPDATE ON public.stock_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_notifications_updated_at();

-- Comment on table
COMMENT ON TABLE public.stock_notifications IS 'Stock notification requests for out-of-stock products';
-- Create profiles table for OAuth and email/password users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    provider = COALESCE(EXCLUDED.provider, public.profiles.provider),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_provider_idx ON public.profiles(provider);

-- Add comment
COMMENT ON TABLE public.profiles IS 'User profiles for both OAuth and email/password authentication';
-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  applicable_to TEXT CHECK (applicable_to IN ('all', 'products', 'photoshoots')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coupon_usage table
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID,
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- Policies for coupons
CREATE POLICY "Coupons are viewable by everyone"
  ON public.coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for coupon_usage
CREATE POLICY "Users can view their own coupon usage"
  ON public.coupon_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usage"
  ON public.coupon_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all coupon usage"
  ON public.coupon_usage FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes
CREATE INDEX IF NOT EXISTS coupons_code_idx ON public.coupons(code);
CREATE INDEX IF NOT EXISTS coupons_is_active_idx ON public.coupons(is_active);
CREATE INDEX IF NOT EXISTS coupon_usage_coupon_id_idx ON public.coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS coupon_usage_user_id_idx ON public.coupon_usage(user_id);

-- Create function to validate coupon
CREATE OR REPLACE FUNCTION public.validate_coupon(
  coupon_code TEXT,
  order_amount DECIMAL,
  user_id_param UUID
)
RETURNS JSON AS $$
DECLARE
  coupon_record RECORD;
  user_usage_count INTEGER;
  result JSON;
BEGIN
  -- Get coupon details
  SELECT * INTO coupon_record
  FROM public.coupons
  WHERE code = coupon_code
    AND is_active = true
    AND valid_from <= NOW()
    AND (valid_until IS NULL OR valid_until >= NOW());

  -- Check if coupon exists
  IF coupon_record IS NULL THEN
    RETURN json_build_object(
      'valid', false,
      'message', '유효하지 않은 쿠폰 코드입니다.'
    );
  END IF;

  -- Check minimum order amount
  IF order_amount < coupon_record.min_order_amount THEN
    RETURN json_build_object(
      'valid', false,
      'message', '최소 주문 금액을 충족하지 않습니다.',
      'min_amount', coupon_record.min_order_amount
    );
  END IF;

  -- Check usage limit
  IF coupon_record.usage_limit IS NOT NULL AND coupon_record.used_count >= coupon_record.usage_limit THEN
    RETURN json_build_object(
      'valid', false,
      'message', '쿠폰 사용 가능 횟수가 초과되었습니다.'
    );
  END IF;

  -- Check user usage (1 per user)
  SELECT COUNT(*) INTO user_usage_count
  FROM public.coupon_usage
  WHERE coupon_id = coupon_record.id
    AND user_id = user_id_param;

  IF user_usage_count > 0 THEN
    RETURN json_build_object(
      'valid', false,
      'message', '이미 사용한 쿠폰입니다.'
    );
  END IF;

  -- Calculate discount
  DECLARE
    discount_amount DECIMAL;
  BEGIN
    IF coupon_record.discount_type = 'percentage' THEN
      discount_amount := order_amount * (coupon_record.discount_value / 100);
      IF coupon_record.max_discount_amount IS NOT NULL THEN
        discount_amount := LEAST(discount_amount, coupon_record.max_discount_amount);
      END IF;
    ELSE
      discount_amount := coupon_record.discount_value;
    END IF;

    RETURN json_build_object(
      'valid', true,
      'coupon_id', coupon_record.id,
      'discount_amount', discount_amount,
      'discount_type', coupon_record.discount_type,
      'discount_value', coupon_record.discount_value,
      'message', '쿠폰이 적용되었습니다.'
    );
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON TABLE public.coupons IS 'Coupon codes for discounts';
COMMENT ON TABLE public.coupon_usage IS 'Coupon usage history';
-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
  answer TEXT,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can insert inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all inquiries"
  ON public.inquiries FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update inquiries"
  ON public.inquiries FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries(created_at);

-- Add comment
COMMENT ON TABLE public.inquiries IS 'Customer 1:1 inquiries';
-- Update orders table with enhanced status workflow
DO $$ 
BEGIN
  -- Add tracking_number column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'tracking_number') THEN
    ALTER TABLE public.orders ADD COLUMN tracking_number TEXT;
  END IF;

  -- Add shipping_company column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'shipping_company') THEN
    ALTER TABLE public.orders ADD COLUMN shipping_company TEXT;
  END IF;

  -- Add shipped_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'shipped_at') THEN
    ALTER TABLE public.orders ADD COLUMN shipped_at TIMESTAMPTZ;
  END IF;

  -- Add delivered_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'delivered_at') THEN
    ALTER TABLE public.orders ADD COLUMN delivered_at TIMESTAMPTZ;
  END IF;

  -- Add completed_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'completed_at') THEN
    ALTER TABLE public.orders ADD COLUMN completed_at TIMESTAMPTZ;
  END IF;
END $$;

-- Update status check constraint to include new statuses
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'));

-- Create index for tracking number
CREATE INDEX IF NOT EXISTS orders_tracking_number_idx ON public.orders(tracking_number);

-- Add comment
COMMENT ON COLUMN public.orders.status IS 'Order status workflow: pending → processing → shipped → delivered → completed';
COMMENT ON COLUMN public.orders.tracking_number IS 'Shipping tracking number';
COMMENT ON COLUMN public.orders.shipping_company IS 'Shipping company name (e.g., CJ대한통운, 우체국택배)';
-- Add missing columns to orders table for complete order management
DO $$ 
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'user_id') THEN
    ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id);
    CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
  END IF;

  -- Add discount_amount column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
    ALTER TABLE public.orders ADD COLUMN discount_amount INTEGER DEFAULT 0;
  END IF;

  -- Add coupon_code column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'coupon_code') THEN
    ALTER TABLE public.orders ADD COLUMN coupon_code VARCHAR(50);
  END IF;
END $$;

-- Update RLS policies to use user_id
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;

CREATE POLICY "Users can read their own orders"
  ON public.orders FOR SELECT
  USING (
    user_id = auth.uid() OR 
    customer_email = auth.jwt()->>'email'
  );

-- Allow users to update their own orders (for cancellation, etc.)
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (
    user_id = auth.uid() OR 
    customer_email = auth.jwt()->>'email'
  );

-- Comments
COMMENT ON COLUMN public.orders.user_id IS 'Reference to authenticated user (null for guest checkout)';
COMMENT ON COLUMN public.orders.discount_amount IS 'Coupon or promotion discount amount';
COMMENT ON COLUMN public.orders.coupon_code IS 'Applied coupon code';
-- Add role system for admin authentication
-- Migration: 20260114000008_add_user_roles.sql

-- ============================================================================
-- Add role to users table
-- ============================================================================

-- Add role column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

COMMENT ON COLUMN users.role IS 'User role: customer or admin';

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- Add role to profiles table (if it doesn't have one)
-- ============================================================================

-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

COMMENT ON COLUMN profiles.role IS 'User role: customer or admin';

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================================================
-- Create admin users function
-- ============================================================================

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update users table
  UPDATE users 
  SET role = 'admin', updated_at = NOW()
  WHERE email = user_email;
  
  -- Update profiles table
  UPDATE profiles 
  SET role = 'admin', updated_at = NOW()
  WHERE email = user_email;
  
  RAISE NOTICE 'User % promoted to admin', user_email;
END;
$$;

COMMENT ON FUNCTION promote_to_admin IS 'Promote a user to admin role';

-- Function to demote admin to customer
CREATE OR REPLACE FUNCTION demote_to_customer(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update users table
  UPDATE users 
  SET role = 'customer', updated_at = NOW()
  WHERE email = user_email;
  
  -- Update profiles table
  UPDATE profiles 
  SET role = 'customer', updated_at = NOW()
  WHERE email = user_email;
  
  RAISE NOTICE 'User % demoted to customer', user_email;
END;
$$;

COMMENT ON FUNCTION demote_to_customer IS 'Demote an admin to customer role';

-- ============================================================================
-- Sync role between users and profiles
-- ============================================================================

-- Trigger function to sync role changes
CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When users.role changes, update profiles.role
  IF TG_TABLE_NAME = 'users' THEN
    UPDATE profiles 
    SET role = NEW.role, updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  -- When profiles.role changes, update users.role
  IF TG_TABLE_NAME = 'profiles' THEN
    UPDATE users 
    SET role = NEW.role, updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS sync_users_role_trigger ON users;
CREATE TRIGGER sync_users_role_trigger
  AFTER UPDATE OF role ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_role();

DROP TRIGGER IF EXISTS sync_profiles_role_trigger ON profiles;
CREATE TRIGGER sync_profiles_role_trigger
  AFTER UPDATE OF role ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_role();

-- ============================================================================
-- Set default admin (환경 변수 사용)
-- ============================================================================

-- Note: 실제 관리자 계정은 다음 명령어로 설정:
-- SELECT promote_to_admin('admin@arco.com');

-- ============================================================================
-- Update RLS policies for admin access
-- ============================================================================

-- Admin users can read all users
DROP POLICY IF EXISTS "Admins can read all users" ON users;
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admin users can read all profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
