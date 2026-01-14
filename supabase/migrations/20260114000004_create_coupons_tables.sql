-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  applicable_to TEXT CHECK (applicable_to IN ('all', 'products', 'photoshoots')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coupon_usage table
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID,
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- Policies for coupons
CREATE POLICY "Coupons are viewable by everyone"
  ON public.coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for coupon_usage
CREATE POLICY "Users can view their own coupon usage"
  ON public.coupon_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usage"
  ON public.coupon_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all coupon usage"
  ON public.coupon_usage FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes
CREATE INDEX IF NOT EXISTS coupons_code_idx ON public.coupons(code);
CREATE INDEX IF NOT EXISTS coupons_is_active_idx ON public.coupons(is_active);
CREATE INDEX IF NOT EXISTS coupon_usage_coupon_id_idx ON public.coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS coupon_usage_user_id_idx ON public.coupon_usage(user_id);

-- Create function to validate coupon
CREATE OR REPLACE FUNCTION public.validate_coupon(
  coupon_code TEXT,
  order_amount DECIMAL,
  user_id_param UUID
)
RETURNS JSON AS $$
DECLARE
  coupon_record RECORD;
  user_usage_count INTEGER;
  result JSON;
BEGIN
  -- Get coupon details
  SELECT * INTO coupon_record
  FROM public.coupons
  WHERE code = coupon_code
    AND is_active = true
    AND valid_from <= NOW()
    AND (valid_until IS NULL OR valid_until >= NOW());

  -- Check if coupon exists
  IF coupon_record IS NULL THEN
    RETURN json_build_object(
      'valid', false,
      'message', '유효하지 않은 쿠폰 코드입니다.'
    );
  END IF;

  -- Check minimum order amount
  IF order_amount < coupon_record.min_order_amount THEN
    RETURN json_build_object(
      'valid', false,
      'message', '최소 주문 금액을 충족하지 않습니다.',
      'min_amount', coupon_record.min_order_amount
    );
  END IF;

  -- Check usage limit
  IF coupon_record.usage_limit IS NOT NULL AND coupon_record.used_count >= coupon_record.usage_limit THEN
    RETURN json_build_object(
      'valid', false,
      'message', '쿠폰 사용 가능 횟수가 초과되었습니다.'
    );
  END IF;

  -- Check user usage (1 per user)
  SELECT COUNT(*) INTO user_usage_count
  FROM public.coupon_usage
  WHERE coupon_id = coupon_record.id
    AND user_id = user_id_param;

  IF user_usage_count > 0 THEN
    RETURN json_build_object(
      'valid', false,
      'message', '이미 사용한 쿠폰입니다.'
    );
  END IF;

  -- Calculate discount
  DECLARE
    discount_amount DECIMAL;
  BEGIN
    IF coupon_record.discount_type = 'percentage' THEN
      discount_amount := order_amount * (coupon_record.discount_value / 100);
      IF coupon_record.max_discount_amount IS NOT NULL THEN
        discount_amount := LEAST(discount_amount, coupon_record.max_discount_amount);
      END IF;
    ELSE
      discount_amount := coupon_record.discount_value;
    END IF;

    RETURN json_build_object(
      'valid', true,
      'coupon_id', coupon_record.id,
      'discount_amount', discount_amount,
      'discount_type', coupon_record.discount_type,
      'discount_value', coupon_record.discount_value,
      'message', '쿠폰이 적용되었습니다.'
    );
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON TABLE public.coupons IS 'Coupon codes for discounts';
COMMENT ON TABLE public.coupon_usage IS 'Coupon usage history';
