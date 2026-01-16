-- ============================================================================
-- ARCO: Enable RLS and Create Policies
-- ============================================================================
-- Created: 2026-01-16
-- 
-- This migration enables Row Level Security (RLS) on all tables and creates
-- appropriate policies for public and private data access.
--
-- IMPORTANT: RLS must be ENABLED before creating policies!
--
-- Public Tables (Anyone can read):
--   - categories
--   - products
--   - photoshoot_looks
--
-- Private Tables (Owner or admin only):
--   - bookings (by customer_email)
--   - orders (by user_id or customer_email)
-- ============================================================================

-- ============================================================================
-- STEP 1: Enable RLS on all tables
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Drop existing policies (if any) to ensure clean state
-- ============================================================================

DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "products_public_read" ON products;
DROP POLICY IF EXISTS "photoshoot_looks_public_read" ON photoshoot_looks;
DROP POLICY IF EXISTS "bookings_user_read" ON bookings;
DROP POLICY IF EXISTS "bookings_anonymous_insert" ON bookings;
DROP POLICY IF EXISTS "orders_user_read" ON orders;
DROP POLICY IF EXISTS "orders_anonymous_insert" ON orders;

-- ============================================================================
-- STEP 3: Create policies for PUBLIC tables
-- ============================================================================

-- Categories: Public read access
CREATE POLICY "categories_public_read"
ON categories
FOR SELECT
USING (true);

COMMENT ON POLICY "categories_public_read" ON categories IS 
'Allow all users to view categories';

-- Products: Public read access
CREATE POLICY "products_public_read"
ON products
FOR SELECT
USING (true);

COMMENT ON POLICY "products_public_read" ON products IS 
'Allow all users to view products';

-- Photoshoot Looks: Public read access
CREATE POLICY "photoshoot_looks_public_read"
ON photoshoot_looks
FOR SELECT
USING (true);

COMMENT ON POLICY "photoshoot_looks_public_read" ON photoshoot_looks IS 
'Allow all users to view photoshoot looks';

-- ============================================================================
-- STEP 4: Create policies for PRIVATE tables
-- ============================================================================

-- Bookings: Users can view their own bookings (by email) or admins can view all
CREATE POLICY "bookings_user_read"
ON bookings
FOR SELECT
USING (
  customer_email = (auth.jwt()->>'email')::text
  OR (auth.jwt()->>'role')::text = 'admin'
);

COMMENT ON POLICY "bookings_user_read" ON bookings IS 
'Allow users to view their own bookings by email, or admins to view all';

-- Bookings: Anyone can create bookings (for guest checkout)
CREATE POLICY "bookings_anonymous_insert"
ON bookings
FOR INSERT
WITH CHECK (true);

COMMENT ON POLICY "bookings_anonymous_insert" ON bookings IS 
'Allow anyone to create bookings (including guest users)';

-- Orders: Users can view their own orders (by user_id or email) or admins can view all
CREATE POLICY "orders_user_read"
ON orders
FOR SELECT
USING (
  auth.uid() = user_id
  OR customer_email = (auth.jwt()->>'email')::text
  OR (auth.jwt()->>'role')::text = 'admin'
);

COMMENT ON POLICY "orders_user_read" ON orders IS 
'Allow users to view their own orders by user_id or email, or admins to view all';

-- Orders: Anyone can create orders (for guest checkout)
CREATE POLICY "orders_anonymous_insert"
ON orders
FOR INSERT
WITH CHECK (true);

COMMENT ON POLICY "orders_anonymous_insert" ON orders IS 
'Allow anyone to create orders (including guest users)';

-- ============================================================================
-- STEP 5: Create service_role bypass policies (for testing and admin access)
-- ============================================================================

-- Service role needs full access for testing and administrative tasks
-- These policies allow SERVICE_ROLE_KEY to bypass RLS

-- Drop existing service_role policies (if any)
DROP POLICY IF EXISTS "service_role_full_access_categories" ON categories;
DROP POLICY IF EXISTS "service_role_full_access_products" ON products;
DROP POLICY IF EXISTS "service_role_full_access_photoshoot_looks" ON photoshoot_looks;
DROP POLICY IF EXISTS "service_role_full_access_bookings" ON bookings;
DROP POLICY IF EXISTS "service_role_full_access_orders" ON orders;

-- Grant privileges to service_role
GRANT ALL ON categories TO service_role;
GRANT ALL ON products TO service_role;
GRANT ALL ON photoshoot_looks TO service_role;
GRANT ALL ON bookings TO service_role;
GRANT ALL ON orders TO service_role;

-- Create bypass policies for service_role
CREATE POLICY "service_role_full_access_categories"
ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_access_products"
ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_access_photoshoot_looks"
ON photoshoot_looks FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_access_bookings"
ON bookings FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_access_orders"
ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMENT ON POLICY "service_role_full_access_categories" ON categories IS 
'Allow service_role to bypass RLS for testing and administrative tasks';

COMMENT ON POLICY "service_role_full_access_products" ON products IS 
'Allow service_role to bypass RLS for testing and administrative tasks';

COMMENT ON POLICY "service_role_full_access_photoshoot_looks" ON photoshoot_looks IS 
'Allow service_role to bypass RLS for testing and administrative tasks';

COMMENT ON POLICY "service_role_full_access_bookings" ON bookings IS 
'Allow service_role to bypass RLS for testing and administrative tasks';

COMMENT ON POLICY "service_role_full_access_orders" ON orders IS 
'Allow service_role to bypass RLS for testing and administrative tasks';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'RLS enabled and policies created successfully!' as status;
