-- Create stock notifications table
-- Migration: 20260114000002_create_stock_notifications_table.sql

CREATE TABLE IF NOT EXISTS public.stock_notifications (
  id BIGSERIAL PRIMARY KEY,
  
  -- Product reference
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  
  -- Customer info
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  -- Notification status
  is_notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate notifications for same email + product
  UNIQUE(product_id, customer_email)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stock_notifications_product ON public.stock_notifications(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_notifications_email ON public.stock_notifications(customer_email);
CREATE INDEX IF NOT EXISTS idx_stock_notifications_status ON public.stock_notifications(is_notified);

-- Enable RLS
ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can insert stock notifications
CREATE POLICY "Anyone can create stock notifications"
  ON public.stock_notifications
  FOR INSERT
  WITH CHECK (true);

-- Admin can view all notifications
CREATE POLICY "Admin can view all stock notifications"
  ON public.stock_notifications
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin can update notifications (mark as notified)
CREATE POLICY "Admin can update stock notifications"
  ON public.stock_notifications
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin can delete notifications
CREATE POLICY "Admin can delete stock notifications"
  ON public.stock_notifications
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_stock_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS stock_notifications_updated_at_trigger ON public.stock_notifications;
CREATE TRIGGER stock_notifications_updated_at_trigger
  BEFORE UPDATE ON public.stock_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_notifications_updated_at();

-- Comment on table
COMMENT ON TABLE public.stock_notifications IS 'Stock notification requests for out-of-stock products';
