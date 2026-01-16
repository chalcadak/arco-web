-- ============================================================================
-- RLS Debug Check Script
-- ============================================================================
-- Run this in Supabase Dashboard SQL Editor to check RLS status and policies
-- https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
-- ============================================================================

-- 1. Check if RLS is enabled on tables
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('categories', 'products', 'photoshoot_looks', 'bookings', 'orders')
ORDER BY tablename;

-- 2. Check existing policies
SELECT 
  schemaname,
  tablename, 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('categories', 'products', 'photoshoot_looks', 'bookings', 'orders')
ORDER BY table_name;

-- 4. Try to count rows (as superuser, should work)
SELECT 'categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'photoshoot_looks', COUNT(*) FROM photoshoot_looks
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'orders', COUNT(*) FROM orders;

-- 5. Check service_role permissions
SELECT 
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('categories', 'products', 'photoshoot_looks', 'bookings', 'orders')
  AND grantee IN ('postgres', 'service_role', 'authenticated', 'anon')
ORDER BY table_name, grantee, privilege_type;
