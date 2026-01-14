'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  FileText,
} from 'lucide-react';

interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  discount_amount: number;
  shipping_fee: number;
  created_at: string;
  items: OrderItem[];
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    detail_address: string;
    postal_code: string;
  };
  shipping_company?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  completed_at?: string;
  coupon_code?: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        router.push('/login?redirect=/my-page/orders/' + orderId);
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

  const getStatusConfig = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: any; icon: any; color: string }
    > = {
      pending: {
        label: '결제완료',
        variant: 'secondary',
        icon: Clock,
        color: 'text-yellow-600',
      },
      processing: {
        label: '상품준비중',
        variant: 'default',
        icon: Package,
        color: 'text-blue-600',
      },
      shipped: {
        label: '배송중',
        variant: 'default',
        icon: Truck,
        color: 'text-purple-600',
      },
      delivered: {
        label: '배송완료',
        variant: 'default',
        icon: CheckCircle2,
        color: 'text-green-600',
      },
      completed: {
        label: '구매확정',
        variant: 'default',
        icon: CheckCircle2,
        color: 'text-green-700',
      },
      cancelled: {
        label: '취소됨',
        variant: 'destructive',
        icon: Clock,
        color: 'text-red-600',
      },
    };

    return (
      statusMap[status] || {
        label: status,
        variant: 'outline',
        icon: Clock,
        color: 'text-gray-600',
      }
    );
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
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">주문을 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-6">
              주문 정보가 존재하지 않거나 삭제되었습니다.
            </p>
            <Link href="/my-page/orders">
              <Button>주문 내역으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const subtotal = order.total_amount - order.shipping_fee + (order.discount_amount || 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/my-page/orders">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            주문 목록
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">주문 상세</h1>
          <Badge variant={statusConfig.variant} className="text-base px-4 py-2">
            <StatusIcon className="w-4 h-4 mr-2" />
            {statusConfig.label}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2">
          주문번호: {order.order_number || `ORDER-${order.id.slice(0, 8)}`}
        </p>
        <p className="text-sm text-muted-foreground">
          주문일시:{' '}
          {new Date(order.created_at).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Order Timeline */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            주문 진행 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center relative">
            {/* Timeline Line */}
            <div className="absolute left-0 right-0 h-1 bg-gray-200 top-6" />
            <div
              className={`absolute left-0 h-1 bg-primary top-6 transition-all duration-500`}
              style={{
                width:
                  order.status === 'pending'
                    ? '0%'
                    : order.status === 'processing'
                    ? '33%'
                    : order.status === 'shipped'
                    ? '66%'
                    : '100%',
              }}
            />

            {/* Steps */}
            {[
              { status: 'pending', label: '결제완료', icon: Clock },
              { status: 'processing', label: '상품준비중', icon: Package },
              { status: 'shipped', label: '배송중', icon: Truck },
              { status: 'delivered', label: '배송완료', icon: CheckCircle2 },
            ].map((step, index) => {
              const StepIcon = step.icon;
              const isPassed =
                ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >=
                index;

              return (
                <div key={step.status} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isPassed
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      isPassed ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            주문 상품
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items && Array.isArray(order.items) ? (
            order.items.map((item, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.size && <span>사이즈: {item.size}</span>}
                      {item.size && item.color && <span> / </span>}
                      {item.color && <span>색상: {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        수량: {item.quantity}개
                      </span>
                      <span className="font-semibold">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">주문 상품 정보가 없습니다.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              배송 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.shipping_address ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">받는 사람</p>
                  <p className="font-medium">{order.shipping_address.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">연락처</p>
                  <p className="font-medium">{order.shipping_address.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">배송지</p>
                  <p className="font-medium">
                    [{order.shipping_address.postal_code}] {order.shipping_address.address}
                  </p>
                  <p className="font-medium">{order.shipping_address.detail_address}</p>
                </div>
                {order.tracking_number && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">택배사</p>
                      <p className="font-medium">{order.shipping_company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">송장번호</p>
                      <p className="font-medium">{order.tracking_number}</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">배송 정보가 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              결제 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">상품 금액</span>
              <span className="font-medium">{subtotal.toLocaleString()}원</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>
                  쿠폰 할인 {order.coupon_code && `(${order.coupon_code})`}
                </span>
                <span className="font-medium">-{order.discount_amount.toLocaleString()}원</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">배송비</span>
              <span className="font-medium">
                {order.shipping_fee === 0
                  ? '무료'
                  : `${order.shipping_fee.toLocaleString()}원`}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">총 결제 금액</span>
              <span className="font-bold text-primary">
                {order.total_amount.toLocaleString()}원
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Link href="/my-page/orders">
          <Button variant="outline">주문 목록으로</Button>
        </Link>
        <Link href="/contact/inquiry">
          <Button variant="outline">문의하기</Button>
        </Link>
      </div>
    </div>
  );
}
