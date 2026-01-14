import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { createClient } from '@/lib/supabase/server';

async function SuccessContent({
  searchParams,
}: {
  searchParams: { orderId?: string; paymentKey?: string; amount?: string };
}) {
  const supabase = await createClient();

  if (!searchParams.orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">주문 정보를 찾을 수 없습니다.</p>
            <Button asChild>
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 주문 정보 조회
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
    .eq('id', searchParams.orderId)
    .single();

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">주문 정보를 찾을 수 없습니다.</p>
            <Button asChild>
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container size="md">
        {/* 성공 메시지 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <Heading level={1} className="mb-2">
            주문이 완료되었습니다!
          </Heading>
          <Text className="text-gray-600">
            주문번호: <span className="font-semibold">{order.order_number}</span>
          </Text>
        </div>

        {/* 주문 정보 */}
        <div className="space-y-6">
          {/* 결제 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text className="text-gray-600">결제 방법</Text>
                  <Text className="font-medium">
                    {order.payment_method === 'card' && '신용카드'}
                    {order.payment_method === 'transfer' && '계좌이체'}
                    {order.payment_method === 'phone' && '휴대폰 결제'}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">결제 금액</Text>
                  <Heading level={3}>
                    ₩{order.total_amount.toLocaleString()}
                  </Heading>
                </div>
                <div className="flex justify-between">
                  <Text size="sm" className="text-gray-500">결제 키</Text>
                  <Text size="sm" className="font-mono text-gray-500">{searchParams.paymentKey}</Text>
                </div>
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
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text className="text-gray-600">받는 분</Text>
                  <Text className="font-medium">{order.shipping_name}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">연락처</Text>
                  <Text className="font-medium">{order.shipping_phone}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">이메일</Text>
                  <Text className="font-medium">{order.shipping_email}</Text>
                </div>
                <Separator className="my-2" />
                <div>
                  <Text className="text-gray-600 block mb-1">배송 주소</Text>
                  <Text className="font-medium">
                    ({order.shipping_zipcode}) {order.shipping_address}
                  </Text>
                </div>
                {order.shipping_message && (
                  <div>
                    <Text className="text-gray-600 block mb-1">배송 메시지</Text>
                    <Text size="sm">{order.shipping_message}</Text>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 주문 상품 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                주문 상품
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <Link
                        href={`/products/${item.products.slug}`}
                        className="font-medium hover:text-blue-600"
                      >
                        {item.products.name}
                      </Link>
                      <Text size="sm" className="text-gray-600">
                        수량: {item.quantity}개
                      </Text>
                    </div>
                    <Text className="font-medium">
                      ₩{(item.price * item.quantity).toLocaleString()}
                    </Text>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 다음 단계 안내 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <Heading level={3} className="mb-3">다음 단계</Heading>
              <ol className="space-y-2">
                <Text size="sm" className="text-gray-700">1. 주문 확인 메일을 확인해주세요.</Text>
                <Text size="sm" className="text-gray-700">2. 상품 준비가 완료되면 배송이 시작됩니다.</Text>
                <Text size="sm" className="text-gray-700">3. 배송 시작 시 알림을 보내드립니다.</Text>
                <Text size="sm" className="text-gray-700">4. 배송 완료까지 2-3일 소요될 예정입니다.</Text>
              </ol>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/products">쇼핑 계속하기</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string; paymentKey?: string; amount?: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">주문 정보를 불러오는 중...</p>
          </div>
        </div>
      }
    >
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
