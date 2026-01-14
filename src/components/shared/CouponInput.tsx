'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/typography';
import { Tag, X, Loader2 } from 'lucide-react';
import type { CouponValidation } from '@/types/coupon';

interface CouponInputProps {
  orderAmount: number;
  onCouponApplied: (validation: CouponValidation) => void;
  onCouponRemoved: () => void;
}

export function CouponInput({
  orderAmount,
  onCouponApplied,
  onCouponRemoved,
}: CouponInputProps) {
  const supabase = createClientComponentClient();
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [error, setError] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('쿠폰 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      // Validate coupon using Supabase function
      const { data, error: rpcError } = await supabase.rpc('validate_coupon', {
        coupon_code: couponCode.toUpperCase(),
        order_amount: orderAmount,
        user_id_param: user.id,
      });

      if (rpcError) {
        console.error('Coupon validation error:', rpcError);
        setError('쿠폰 확인 중 오류가 발생했습니다.');
        setIsLoading(false);
        return;
      }

      const validation = data as CouponValidation;

      if (validation.valid) {
        setAppliedCoupon(validation);
        onCouponApplied(validation);
        setError('');
      } else {
        setError(validation.message);
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error('Coupon error:', err);
      setError('쿠폰 적용 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setError('');
    onCouponRemoved();
  };

  return (
    <div className="space-y-3">
      {/* Coupon Input */}
      {!appliedCoupon && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="쿠폰 코드 입력"
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyCoupon();
                }
              }}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleApplyCoupon}
            disabled={isLoading || !couponCode.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              '적용'
            )}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md">
          <Text size="sm" className="text-red-600">
            {error}
          </Text>
        </div>
      )}

      {/* Applied Coupon */}
      {appliedCoupon && appliedCoupon.valid && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-green-600" />
              <div>
                <Text size="sm" className="text-green-700 font-semibold">
                  쿠폰이 적용되었습니다!
                </Text>
                <Text size="sm" className="text-green-600">
                  {appliedCoupon.discount_type === 'percentage'
                    ? `${appliedCoupon.discount_value}% 할인`
                    : `${appliedCoupon.discount_value?.toLocaleString()}원 할인`}{' '}
                  (-{appliedCoupon.discount_amount?.toLocaleString()}원)
                </Text>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-600 hover:text-green-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
