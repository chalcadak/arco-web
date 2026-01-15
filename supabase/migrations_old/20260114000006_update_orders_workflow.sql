-- Update orders table with enhanced status workflow
DO $$ 
BEGIN
  -- Add tracking_number column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'tracking_number') THEN
    ALTER TABLE public.orders ADD COLUMN tracking_number TEXT;
  END IF;

  -- Add shipping_company column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'shipping_company') THEN
    ALTER TABLE public.orders ADD COLUMN shipping_company TEXT;
  END IF;

  -- Add shipped_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'shipped_at') THEN
    ALTER TABLE public.orders ADD COLUMN shipped_at TIMESTAMPTZ;
  END IF;

  -- Add delivered_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'delivered_at') THEN
    ALTER TABLE public.orders ADD COLUMN delivered_at TIMESTAMPTZ;
  END IF;

  -- Add completed_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'completed_at') THEN
    ALTER TABLE public.orders ADD COLUMN completed_at TIMESTAMPTZ;
  END IF;
END $$;

-- Update status check constraint to include new statuses
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'));

-- Create index for tracking number
CREATE INDEX IF NOT EXISTS orders_tracking_number_idx ON public.orders(tracking_number);

-- Add comment
COMMENT ON COLUMN public.orders.status IS 'Order status workflow: pending → processing → shipped → delivered → completed';
COMMENT ON COLUMN public.orders.tracking_number IS 'Shipping tracking number';
COMMENT ON COLUMN public.orders.shipping_company IS 'Shipping company name (e.g., CJ대한통운, 우체국택배)';
