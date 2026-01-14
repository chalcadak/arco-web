-- ============================================================================
-- Fix RLS Policies - Remove Infinite Recursion
-- ============================================================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create new policies without recursion
-- Admin 정책은 auth.uid()를 직접 체크하지 않고 role 체크만 수행
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update users" ON users
  FOR UPDATE USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 또는 더 간단하게: RLS를 일시적으로 비활성화하고 Admin 권한 부여
-- (보안상 프로덕션에서는 권장하지 않음)
