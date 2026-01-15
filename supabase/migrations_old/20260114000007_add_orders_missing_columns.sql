-- Add missing columns to orders table for complete order management
DO $$ 
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'user_id') THEN
    ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id);
    CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
  END IF;

  -- Add discount_amount column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
    ALTER TABLE public.orders ADD COLUMN discount_amount INTEGER DEFAULT 0;
  END IF;

  -- Add coupon_code column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'coupon_code') THEN
    ALTER TABLE public.orders ADD COLUMN coupon_code VARCHAR(50);
  END IF;
END $$;

-- Update RLS policies to use user_id
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;

CREATE POLICY "Users can read their own orders"
  ON public.orders FOR SELECT
  USING (
    user_id = auth.uid() OR 
    customer_email = auth.jwt()->>'email'
  );

-- Allow users to update their own orders (for cancellation, etc.)
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (
    user_id = auth.uid() OR 
    customer_email = auth.jwt()->>'email'
  );

-- Comments
COMMENT ON COLUMN public.orders.user_id IS 'Reference to authenticated user (null for guest checkout)';
COMMENT ON COLUMN public.orders.discount_amount IS 'Coupon or promotion discount amount';
COMMENT ON COLUMN public.orders.coupon_code IS 'Applied coupon code';
