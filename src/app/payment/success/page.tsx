'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    processPayment();
  }, []);

  const processPayment = async () => {
    try {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        throw new Error('결제 정보가 올바르지 않습니다.');
      }

      // Get order data from sessionStorage
      let orderData = null;
      if (typeof window !== 'undefined') {
        const storedData = sessionStorage.getItem('pending-order');
        if (storedData) {
          try {
            orderData = JSON.parse(storedData);
          } catch (e) {
            console.error('Failed to parse order data:', e);
          }
        }
      }

      // Verify payment with TossPayments
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentKey, 
          orderId, 
          amount,
          orderData, // Pass order data to API
        }),
      });

      if (!response.ok) {
        throw new Error('결제 확인에 실패했습니다.');
      }

      const data = await response.json();
      setOrderId(data.orderNumber || data.orderId);
      
      // Clear sessionStorage after successful order creation
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pending-order');
        sessionStorage.removeItem('pending-order-id');
      }
      
      setIsProcessing(false);

    } catch (err: any) {
      console.error('Payment processing error:', err);
      setError(err.message || '결제 처리 중 오류가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Container size="sm">
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <Heading level={3}>결제를 처리하고 있습니다...</Heading>
              <Text className="text-muted-foreground mt-2">
                잠시만 기다려주세요.
              </Text>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        <Container size="sm">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <div className="inline-block p-4 bg-red-100 rounded-full">
                  <CheckCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <Heading level={2} className="mb-4">결제 처리 실패</Heading>
              <Text className="text-muted-foreground mb-8">
                {error}
              </Text>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => router.push('/cart')}>
                  장바구니로 돌아가기
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  홈으로
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <Container size="sm">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <Heading level={2} className="mb-4">결제가 완료되었습니다!</Heading>
            <Text className="text-muted-foreground mb-2">
              주문번호: <span className="font-semibold">{orderId}</span>
            </Text>
            <Text className="text-muted-foreground mb-8">
              주문 내역은 마이페이지에서 확인하실 수 있습니다.
            </Text>
            <div className="flex gap-3 justify-center">
              <Link href="/my-page/orders">
                <Button>주문 내역 보기</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">계속 쇼핑하기</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
