-- ARCO Database RLS Policies
-- Row Level Security for data access control
-- Created: 2026-01-10

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PUBLIC READ ACCESS (Products, Photoshoot Looks, Categories)
-- ============================================================================

-- Anyone can view active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

-- Anyone can view active photoshoot looks
CREATE POLICY "Public can view active photoshoot looks"
  ON photoshoot_looks FOR SELECT
  USING (is_active = TRUE);

-- Anyone can view categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (TRUE);

-- ============================================================================
-- USER POLICIES (Own Data Access)
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own order items
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- GALLERY POLICIES (Token-based Access)
-- ============================================================================

-- Public can view active galleries (token validation in application)
CREATE POLICY "Public can view active galleries"
  ON galleries FOR SELECT
  USING (is_active = TRUE);

-- Public can view gallery images if gallery is active
CREATE POLICY "Public can view gallery images"
  ON gallery_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = gallery_images.gallery_id
      AND galleries.is_active = TRUE
    )
  );

-- ============================================================================
-- ADMIN POLICIES (Full Access)
-- ============================================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admins can do everything on products
CREATE POLICY "Admins have full access to products"
  ON products FOR ALL
  USING (is_admin());

-- Admins can do everything on photoshoot_looks
CREATE POLICY "Admins have full access to photoshoot_looks"
  ON photoshoot_looks FOR ALL
  USING (is_admin());

-- Admins can do everything on orders
CREATE POLICY "Admins have full access to orders"
  ON orders FOR ALL
  USING (is_admin());

-- Admins can do everything on order_items
CREATE POLICY "Admins have full access to order_items"
  ON order_items FOR ALL
  USING (is_admin());

-- Admins can do everything on bookings
CREATE POLICY "Admins have full access to bookings"
  ON bookings FOR ALL
  USING (is_admin());

-- Admins can do everything on galleries
CREATE POLICY "Admins have full access to galleries"
  ON galleries FOR ALL
  USING (is_admin());

-- Admins can do everything on gallery_images
CREATE POLICY "Admins have full access to gallery_images"
  ON gallery_images FOR ALL
  USING (is_admin());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (is_admin());

-- Admins can view all categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- ============================================================================
-- INSERT POLICIES (Anonymous Users)
-- ============================================================================

-- Anonymous users can create orders (non-member purchase)
CREATE POLICY "Anonymous users can create orders"
  ON orders FOR INSERT
  WITH CHECK (TRUE);

-- Anonymous users can create order items
CREATE POLICY "Anonymous users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (TRUE);

-- Anonymous users can create bookings (non-member booking)
CREATE POLICY "Anonymous users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (TRUE);

-- ============================================================================
-- RLS POLICIES COMPLETE
-- ============================================================================
