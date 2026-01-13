import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heading, Text } from '@/components/ui/typography';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';
import OrderStatusSelect from '@/components/admin/OrderStatusSelect';

export const metadata: Metadata = {
  title: '주문 상세 - ARCO 관리자',
  description: '주문 상세 정보',
};

// 주문 상태 배지 컴포넌트
function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    pending: { label: '결제 대기', variant: 'secondary' },
    paid: { label: '결제 완료', variant: 'default' },
    confirmed: { label: '주문 확인', variant: 'default' },
    shipping: { label: '배송중', variant: 'default' },
    delivered: { label: '배송 완료', variant: 'default' },
    cancelled: { label: '취소', variant: 'destructive' },
  };

  const config = statusConfig[status] || { label: status, variant: 'outline' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // 주문 상세 정보 조회
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        products (
          name,
          slug
        )
      )
    `)
    .eq('id', params.id)
    .single();

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <Heading level={1}>주문 상세</Heading>
            <Text className="text-muted-foreground mt-1">
              주문번호: {order.order_number}
            </Text>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 주문 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              주문 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">주문 상태</label>
              <div className="mt-2">
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
              </div>
            </div>

            <Separator />

            <div>
              <Text size="sm" className="text-muted-foreground">주문일시</Text>
              <Text className="mt-1 font-medium">
                {new Date(order.created_at).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </div>

            {order.tracking_number && (
              <div>
                <Text size="sm" className="text-muted-foreground">송장번호</Text>
                <Text className="mt-1 font-medium font-mono">{order.tracking_number}</Text>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 결제 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              결제 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">결제 방법</span>
              <span className="font-medium">
                {order.payment_method === 'card' && '신용카드'}
                {order.payment_method === 'transfer' && '계좌이체'}
                {order.payment_method === 'phone' && '휴대폰 결제'}
              </span>
            </div>

            {order.payment_key && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">결제 키</span>
                <span className="font-mono text-xs">{order.payment_key}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>총 결제 금액</span>
              <span className="text-primary">
                ₩{order.total_amount.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 고객 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              고객 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Text size="sm" className="text-muted-foreground">이름</Text>
              <Text className="mt-1 font-medium">{order.shipping_name}</Text>
            </div>
            <div>
              <Text size="sm" className="text-muted-foreground">연락처</Text>
              <Text className="mt-1 font-medium">{order.shipping_phone}</Text>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">이메일</label>
              <p className="mt-1 font-medium">{order.shipping_email}</p>
            </div>
          </CardContent>
        </Card>

        {/* 배송 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              배송 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">우편번호</label>
              <p className="mt-1 font-medium">{order.shipping_zipcode}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">배송 주소</label>
              <p className="mt-1 font-medium">{order.shipping_address}</p>
            </div>
            {order.shipping_message && (
              <div>
                <label className="text-sm text-muted-foreground">배송 메시지</label>
                <p className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {order.shipping_message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 주문 상품 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>주문 상품</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_items.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b last:border-0"
              >
                <div className="flex-1">
                  <Link
                    href={`/products/${item.products.slug}`}
                    className="font-medium hover:text-primary transition-colors"
                    target="_blank"
                  >
                    {item.products.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    수량: {item.quantity}개 × ₩{item.price.toLocaleString()}
                  </p>
                </div>
                <div className="font-semibold">
                  ₩{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
