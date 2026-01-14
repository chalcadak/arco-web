-- ============================================================================
-- ARCO Complete Database Schema - Fresh Installation
-- ============================================================================
-- 이 스크립트는 모든 테이블을 처음부터 생성합니다
-- 
-- 실행 순서:
-- 1. 기존 테이블 삭제 (DROP TABLE 스크립트 먼저 실행)
-- 2. 이 파일 전체 실행
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (관리자 role 포함)
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE users IS '회원 정보';
COMMENT ON COLUMN users.role IS 'User role: customer or admin';
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- PROFILES TABLE (관리자 role 포함)
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE profiles IS '사용자 프로필';
COMMENT ON COLUMN profiles.role IS 'User role: customer or admin';
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

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
-- PRODUCTS TABLE
-- ============================================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  stock_quantity INTEGER DEFAULT 0,
  sizes TEXT[],
  colors TEXT[],
  images TEXT[],
  video_uid TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE products IS '판매 상품';
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);

-- ============================================================================
-- PHOTOSHOOT LOOKS TABLE
-- ============================================================================
CREATE TABLE photoshoot_looks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  images TEXT[],
  video_uid TEXT,
  booking_available BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE photoshoot_looks IS '촬영룩';
CREATE INDEX idx_photoshoot_looks_slug ON photoshoot_looks(slug);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photoshoot_look_id UUID REFERENCES photoshoot_looks(id),
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  pet_name VARCHAR(100),
  pet_breed VARCHAR(100),
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(50),
  message TEXT,
  total_amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE bookings IS '촬영 예약';
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================================================
-- ORDERS TABLE (완전한 버전)
-- ============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Customer info
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- Shipping info
  shipping_address TEXT NOT NULL,
  shipping_zipcode VARCHAR(20),
  shipping_request TEXT,
  
  -- Order items (JSON array)
  items JSONB NOT NULL DEFAULT '[]',
  
  -- Amount info
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping_fee INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  coupon_code VARCHAR(50),
  
  -- Payment info
  payment_key TEXT,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Order status workflow
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'shipped', 'delivered', 
    'completed', 'cancelled', 'refunded'
  )),
  
  -- Shipping tracking
  tracking_number TEXT,
  shipping_company TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE orders IS '주문';
COMMENT ON COLUMN orders.status IS 'Order status workflow: pending → processing → shipped → delivered → completed';
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_tracking_number ON orders(tracking_number);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  photoshoot_look_id UUID REFERENCES photoshoot_looks(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  images TEXT[],
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT review_target_check CHECK (
    (product_id IS NOT NULL AND photoshoot_look_id IS NULL) OR
    (product_id IS NULL AND photoshoot_look_id IS NOT NULL)
  )
);

COMMENT ON TABLE reviews IS '리뷰';
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_photoshoot ON reviews(photoshoot_look_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ============================================================================
-- STOCK NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE stock_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  is_notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE stock_notifications IS '재입고 알림';
CREATE INDEX idx_stock_notifications_product ON stock_notifications(product_id);

-- ============================================================================
-- COUPONS TABLE
-- ============================================================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL,
  min_order_amount INTEGER DEFAULT 0,
  max_discount_amount INTEGER,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE coupons IS '쿠폰';
CREATE INDEX idx_coupons_code ON coupons(code);

CREATE TABLE coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE coupon_usage IS '쿠폰 사용 내역';
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);

-- ============================================================================
-- INQUIRIES TABLE
-- ============================================================================
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
  admin_reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE inquiries IS '1:1 문의';
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- ============================================================================
-- ADMIN FUNCTIONS
-- ============================================================================

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users 
  SET role = 'admin', updated_at = NOW()
  WHERE email = user_email;
  
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
  UPDATE users 
  SET role = 'customer', updated_at = NOW()
  WHERE email = user_email;
  
  UPDATE profiles 
  SET role = 'customer', updated_at = NOW()
  WHERE email = user_email;
  
  RAISE NOTICE 'User % demoted to customer', user_email;
END;
$$;

COMMENT ON FUNCTION demote_to_customer IS 'Demote an admin to customer role';

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Profiles policies
CREATE POLICY "Profiles are viewable by owner" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Profiles are editable by owner" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Products policies (public read)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true OR EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- Photoshoot looks policies (public read)
CREATE POLICY "Photoshoot looks are viewable by everyone" ON photoshoot_looks
  FOR SELECT USING (is_active = true OR EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_approved = true OR user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- COMPLETE!
-- ============================================================================
-- 다음 단계: 관리자 계정 설정
-- UPDATE users SET role = 'admin' WHERE id = 'your-user-id';
-- ============================================================================
