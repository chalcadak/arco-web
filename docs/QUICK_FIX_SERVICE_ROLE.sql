-- ============================================================================
-- QUICK FIX: Grant service_role full access to all tables
-- ============================================================================
-- Copy and paste this into Supabase Dashboard SQL Editor
-- https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
-- 
-- This will immediately fix the "permission denied" error for SERVICE_ROLE_KEY
-- ============================================================================

-- Grant ALL privileges to service_role
GRANT ALL ON categories TO service_role;
GRANT ALL ON products TO service_role;
GRANT ALL ON photoshoot_looks TO service_role;
GRANT ALL ON bookings TO service_role;
GRANT ALL ON orders TO service_role;

-- Drop existing service_role policies (if any)
DROP POLICY IF EXISTS "service_role_full_access_categories" ON categories;
DROP POLICY IF EXISTS "service_role_full_access_products" ON products;
DROP POLICY IF EXISTS "service_role_full_access_photoshoot_looks" ON photoshoot_looks;
DROP POLICY IF EXISTS "service_role_full_access_bookings" ON bookings;
DROP POLICY IF EXISTS "service_role_full_access_orders" ON orders;

-- Create bypass policies for service_role (allows SERVICE_ROLE_KEY to bypass RLS)
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

-- Add comments
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

-- Verify
SELECT 'Service role policies created successfully! You can now run: npm run test:supabase' as status;
