-- ARCO Database Schema Migration
-- Initial schema for premium dog fashion platform
-- Created: 2026-01-10

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
