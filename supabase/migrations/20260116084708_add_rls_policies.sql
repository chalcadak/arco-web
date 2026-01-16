-- ============================================================================
-- Add RLS Policies for ARCO Database
-- Created: 2026-01-16
-- ============================================================================
-- This migration adds Row Level Security policies to allow:
-- - Public read access to: categories, products, photoshoot_looks
-- - Private access (user's own data) to: bookings, orders
-- ============================================================================

-- ============================================================================
-- STEP 1: Enable RLS on all tables (CRITICAL!)
-- ============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Create Policies
-- ============================================================================

-- ============================================================================
-- CATEGORIES: Public Read Access
-- ============================================================================
-- Categories should be viewable by everyone
CREATE POLICY "categories_public_read" 
  ON categories 
  FOR SELECT 
  USING (true);

-- ============================================================================
-- PRODUCTS: Public Read Access
-- ============================================================================
-- Products should be viewable by everyone
CREATE POLICY "products_public_read" 
  ON products 
  FOR SELECT 
  USING (true);

-- ============================================================================
-- PHOTOSHOOT_LOOKS: Public Read Access
-- ============================================================================
-- Photoshoot looks should be viewable by everyone
CREATE POLICY "photoshoot_looks_public_read" 
  ON photoshoot_looks 
  FOR SELECT 
  USING (true);

-- ============================================================================
-- BOOKINGS: Private Access (Customer Email)
-- ============================================================================
-- Users can view bookings by their email (for anonymous bookings)
CREATE POLICY "bookings_user_read" 
  ON bookings 
  FOR SELECT 
  USING (
    customer_email = (auth.jwt()->>'email')::text
    OR (auth.jwt()->>'role')::text = 'admin'
  );

-- Anyone can create bookings (including anonymous users)
CREATE POLICY "bookings_anonymous_insert" 
  ON bookings 
  FOR INSERT 
  WITH CHECK (true);

-- ============================================================================
-- ORDERS: Private Access (User ID or Customer Email)
-- ============================================================================
-- Users can view orders by their user_id or email
CREATE POLICY "orders_user_read" 
  ON orders 
  FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR customer_email = (auth.jwt()->>'email')::text
    OR (auth.jwt()->>'role')::text = 'admin'
  );

-- Anyone can create orders (including anonymous users)
CREATE POLICY "orders_anonymous_insert" 
  ON orders 
  FOR INSERT 
  WITH CHECK (true);

-- ============================================================================
-- COMPLETE
-- ============================================================================

COMMENT ON POLICY "categories_public_read" ON categories 
  IS 'Allow everyone to view all categories';

COMMENT ON POLICY "products_public_read" ON products 
  IS 'Allow everyone to view all products';

COMMENT ON POLICY "photoshoot_looks_public_read" ON photoshoot_looks 
  IS 'Allow everyone to view all photoshoot looks';

COMMENT ON POLICY "bookings_user_read" ON bookings 
  IS 'Allow users to view bookings by their email or admins to view all';

COMMENT ON POLICY "bookings_anonymous_insert" ON bookings 
  IS 'Allow anyone including anonymous users to create bookings';

COMMENT ON POLICY "orders_user_read" ON orders 
  IS 'Allow users to view orders by user_id or email, or admins to view all';

COMMENT ON POLICY "orders_anonymous_insert" ON orders 
  IS 'Allow anyone including anonymous users to create orders';
