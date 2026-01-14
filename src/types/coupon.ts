export type DiscountType = 'percentage' | 'fixed';
export type ApplicableTo = 'all' | 'products' | 'photoshoots';

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  applicable_to: ApplicableTo;
  created_at: string;
  updated_at: string;
}

export interface CouponUsage {
  id: string;
  coupon_id: string;
  user_id: string;
  order_id?: string;
  discount_amount: number;
  used_at: string;
}

export interface CouponValidation {
  valid: boolean;
  coupon_id?: string;
  discount_amount?: number;
  discount_type?: DiscountType;
  discount_value?: number;
  message: string;
  min_amount?: number;
}
