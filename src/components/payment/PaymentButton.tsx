'use client';

import { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PAYMENT_CONFIG } from '@/lib/payment/config';

interface PaymentButtonProps {
  amount: number;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items?: any[];
  shippingAddress?: string;
  onSuccess?: () => void;
}

export function PaymentButton({
  amount,
  orderName,
  customerName = '고객',
  customerEmail,
  customerPhone,
  items = [],
  shippingAddress,
  onSuccess,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (amount <= 0) {
      alert('결제 금액이 올바르지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const tossPayments = await loadTossPayments(PAYMENT_CONFIG.clientKey);

      // Generate unique order ID
      const timestamp = Date.now();
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        items,
        shippingAddress,
      };
      const orderId = `ORDER-${timestamp}-${Buffer.from(JSON.stringify(orderData)).toString('base64')}`;

      await tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName,
        customerName,
        customerEmail,
        successUrl: PAYMENT_CONFIG.successUrl,
        failUrl: PAYMENT_CONFIG.failUrl,
      });

      // Success handling is done in success page
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      if (error.code !== 'USER_CANCEL') {
        alert('결제 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handlePayment}
      disabled={isLoading || amount <= 0}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          결제 준비 중...
        </>
      ) : (
        `${amount.toLocaleString()}원 결제하기`
      )}
    </Button>
  );
}
