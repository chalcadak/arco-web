'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: any[];
  shipping_address: any;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/admin/login?redirect=/my-page/orders');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('정말 주문을 취소하시겠습니까?')) return;

    setIsCancelling(true);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;

      alert('주문이 취소되었습니다.');
      fetchOrder();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('주문 취소 중 오류가 발생했습니다.');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; icon: any; color: string }
    > = {
      pending: { label: '주문 접수', icon: Package, color: 'text-gray-600' },
      confirmed: { label: '주문 확인', icon: CheckCircle, color: 'text-blue-600' },
      shipped: { label: '배송 중', icon: Truck, color: 'text-purple-600' },
      delivered: { label: '배송 완료', icon: CheckCircle, color: 'text-green-600' },
      cancelled: { label: '주문 취소', icon: Package, color: 'text-red-600' },
    };

    return statusMap[status] || statusMap.pending;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">주문을 찾을 수 없습니다.</p>
            <Link href="/my-page/orders">
              <Button className="mt-4">주문 내역으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/my-page/orders">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            주문 내역
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">주문 상세</h1>
            <p className="text-muted-foreground">
              주문번호: #{order.id.slice(0, 8)}
            </p>
          </div>
          {order.status === 'pending' && (
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? '취소 중...' : '주문 취소'}
            </Button>
          )}
        </div>
      </div>

      {/* Order Status */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            <StatusIcon className={`w-12 h-12 ${statusInfo.color}`} />
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-1">{statusInfo.label}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>주문 상품</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    {item.size && (
                      <p className="text-sm text-muted-foreground">
                        사이즈: {item.size}
                      </p>
                    )}
                    {item.color && (
                      <p className="text-sm text-muted-foreground">
                        색상: {item.color}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.price?.toLocaleString()}원
                    </p>
                    <p className="text-sm text-muted-foreground">
                      수량: {item.quantity || 1}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                주문 상품 정보가 없습니다.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>배송 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold mb-1">{order.customer_name}</p>
              {order.shipping_address && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_address.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_address.detail_address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ({order.shipping_address.postal_code})
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm">{order.customer_phone}</p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm">{order.customer_email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>결제 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">상품 금액</span>
              <span>{order.total_amount?.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">배송비</span>
              <span>3,000원</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>총 결제 금액</span>
                <span>{(order.total_amount + 3000).toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
