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
