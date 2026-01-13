import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Heading, Text } from '@/components/ui/typography';

export const metadata: Metadata = {
  title: '주문 관리 - ARCO 관리자',
  description: '주문 목록 및 관리',
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

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  // 주문 목록 조회
  const { data: orders } = await supabase
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
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>주문 관리</Heading>
          <Text className="text-muted-foreground mt-2">
            총 {orders?.length || 0}건의 주문
          </Text>
        </div>
      </div>

      {/* 주문 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>주문 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {!orders || orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <Heading level={3} size="lg" className="mb-2">주문이 없습니다</Heading>
              <Text className="text-muted-foreground">
                고객의 첫 주문을 기다리고 있습니다.
              </Text>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead>상품</TableHead>
                    <TableHead>결제 금액</TableHead>
                    <TableHead>결제 방법</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>주문일</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <Text className="font-medium">{order.shipping_name}</Text>
                          <Text size="sm" className="text-muted-foreground">
                            {order.shipping_phone}
                          </Text>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {order.order_items.slice(0, 2).map((item: any, idx: number) => (
                            <Text key={item.id} size="sm">
                              {item.products.name}
                              {item.quantity > 1 && ` x${item.quantity}`}
                            </Text>
                          ))}
                          {order.order_items.length > 2 && (
                            <Text size="xs" className="text-muted-foreground mt-1">
                              외 {order.order_items.length - 2}개
                            </Text>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₩{order.total_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {order.payment_method === 'card' && '카드'}
                        {order.payment_method === 'transfer' && '계좌이체'}
                        {order.payment_method === 'phone' && '휴대폰'}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/orders/${order.id}`}>
                            상세보기
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
