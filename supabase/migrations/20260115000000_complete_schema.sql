-- ============================================================================
-- ARCO Complete Database Schema
-- Single unified migration file
-- Created: 2026-01-15
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('product', 'photoshoot')) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE categories IS '카테고리';

-- Insert default categories
INSERT INTO categories (name, slug, type, display_order) VALUES
  ('아우터', 'outer', 'product', 1),
  ('이너웨어', 'innerwear', 'product', 2),
  ('액세서리', 'accessories', 'product', 3),
  ('신발', 'shoes', 'product', 4),
  ('에디토리얼', 'editorial', 'photoshoot', 1),
  ('시즌 스페셜', 'season-special', 'photoshoot', 2),
  ('특별한 날', 'special-day', 'photoshoot', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Media
  images TEXT[],
  video_uid TEXT,
  
  -- Metadata
  sizes TEXT[],
  colors TEXT[],
  tags TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE products IS '판매 상품';

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- ============================================================================
-- PHOTOSHOOT_LOOKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS photoshoot_looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Media
  images TEXT[],
  video_uid TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE photoshoot_looks IS '촬영룩';

CREATE INDEX IF NOT EXISTS idx_photoshoot_looks_slug ON photoshoot_looks(slug);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE bookings IS '촬영 예약';

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID,
  
  -- Customer info
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- Shipping info
  shipping_address TEXT NOT NULL,
  shipping_zipcode VARCHAR(20),
  shipping_request TEXT,
  
  -- Order items (JSON)
  items JSONB NOT NULL DEFAULT '[]',
  
  -- Amounts
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping_fee INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  coupon_code VARCHAR(50),
  
  -- Payment
  payment_key TEXT,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'shipped', 'delivered', 
    'completed', 'cancelled', 'refunded'
  )),
  
  -- Shipping tracking
  tracking_number TEXT,
  shipping_company TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE orders IS '주문';

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS '사용자 프로필';
COMMENT ON COLUMN profiles.role IS 'User role: customer or admin';

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  photoshoot_look_id UUID REFERENCES photoshoot_looks(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  images TEXT[],
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT review_target_check CHECK (
    (product_id IS NOT NULL AND photoshoot_look_id IS NULL) OR
    (product_id IS NULL AND photoshoot_look_id IS NOT NULL)
  )
);

COMMENT ON TABLE reviews IS '리뷰';

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_photoshoot ON reviews(photoshoot_look_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- ============================================================================
-- STOCK_NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS stock_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  is_notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE stock_notifications IS '재입고 알림';

CREATE INDEX IF NOT EXISTS idx_stock_notifications_product ON stock_notifications(product_id);

-- ============================================================================
-- COUPONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL,
  min_order_amount INTEGER DEFAULT 0,
  max_discount_amount INTEGER,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE coupons IS '쿠폰';

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE coupon_usage IS '쿠폰 사용 내역';

CREATE INDEX IF NOT EXISTS idx_coupon_usage_user ON coupon_usage(user_id);

-- ============================================================================
-- INQUIRIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
  admin_reply TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE inquiries IS '1:1 문의';

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = TRUE OR (auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');

-- Photoshoot looks: Public read, admin write
CREATE POLICY "Photoshoot looks are viewable by everyone" ON photoshoot_looks
  FOR SELECT USING (is_active = TRUE OR (auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Admins can manage photoshoot looks" ON photoshoot_looks
  FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');

-- Orders: Users can create, view own orders
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read their own orders" ON orders
  FOR SELECT USING (customer_email = auth.jwt()->>'email');

CREATE POLICY "Admins have full access to orders" ON orders
  FOR ALL USING ((auth.jwt()->>'role')::text = 'admin');

-- Profiles: Users can view/update own profile
CREATE POLICY "Profiles are viewable by owner" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Profiles are editable by owner" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING ((auth.jwt()->>'role')::text = 'admin');

-- Reviews: Public read approved, users can create
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_approved = TRUE OR user_id = auth.uid() OR (auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- COMPLETE
-- ============================================================================
