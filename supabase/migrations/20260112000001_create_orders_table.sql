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

-- 3. Admins have full access
CREATE POLICY "Admins have full access to orders"
  ON orders FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
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
