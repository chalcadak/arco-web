'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PaymentButton } from '@/components/payment/PaymentButton';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getShippingFee, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingZipcode, setShippingZipcode] = useState('');
  const [shippingRequest, setShippingRequest] = useState('');

  const subtotal = getTotalPrice();
  const shippingFee = getShippingFee();
  const totalAmount = subtotal + shippingFee;

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    // Trigger payment - data will be saved after payment confirmation
    const paymentButton = document.querySelector('[data-payment-button]') as HTMLButtonElement;
    if (paymentButton) {
      paymentButton.click();
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Container size="lg" className="py-8">
      {/* Back button */}
      <Link href="/cart">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          장바구니로 돌아가기
        </Button>
      </Link>

      <Heading level={1} className="mb-8">주문/결제</Heading>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer info */}
            <Card>
              <CardHeader>
                <CardTitle>주문자 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="홍길동"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">전화번호 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping info */}
            <Card>
              <CardHeader>
                <CardTitle>배송 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="zipcode">우편번호</Label>
                  <Input
                    id="zipcode"
                    value={shippingZipcode}
                    onChange={(e) => setShippingZipcode(e.target.value)}
                    placeholder="12345"
                  />
                </div>

                <div>
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="서울시 강남구..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="request">배송 요청사항</Label>
                  <Textarea
                    id="request"
                    value={shippingRequest}
                    onChange={(e) => setShippingRequest(e.target.value)}
                    placeholder="부재 시 문 앞에 놓아주세요"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit button - mobile */}
            <div className="lg:hidden">
              <PaymentButton
                amount={totalAmount}
                orderName={`${items[0]?.name || '상품'} 외 ${items.length - 1}건`}
                customerName={customerName}
                customerEmail={customerEmail}
                customerPhone={customerPhone}
                items={items.map(item => ({
                  productId: item.productId,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  size: item.size,
                  color: item.color,
                  image: item.image,
                }))}
                shippingAddress={{
                  name: customerName,
                  phone: customerPhone,
                  address: shippingAddress,
                  postal_code: shippingZipcode,
                  detail_address: shippingRequest,
                }}
                onSuccess={() => {
                  clearCart();
                }}
              />
            </div>
          </form>
        </div>

        {/* Order summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>주문 상품</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-neutral-100 rounded-md overflow-hidden">
                    <Image
                      src={item.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text size="sm" className="font-medium line-clamp-2">{item.name}</Text>
                    <Text size="xs" className="text-muted-foreground mt-1">
                      {item.selectedSize && `${item.selectedSize}`}
                      {item.selectedColor && ` / ${item.selectedColor}`}
                    </Text>
                    <div className="flex items-center justify-between mt-2">
                      <Text size="xs" className="text-muted-foreground">
                        수량: {item.quantity}
                      </Text>
                      <Text size="sm" className="font-semibold">
                        ₩{(item.price * item.quantity).toLocaleString()}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text size="sm" className="text-muted-foreground">상품 금액</Text>
                  <Text size="sm">₩{subtotal.toLocaleString()}</Text>
                </div>
                <div className="flex justify-between">
                  <Text size="sm" className="text-muted-foreground">배송비</Text>
                  <Text size="sm">₩{shippingFee.toLocaleString()}</Text>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <Text className="font-semibold">총 결제 금액</Text>
                <Heading level={3} className="text-primary">
                  ₩{totalAmount.toLocaleString()}
                </Heading>
              </div>

              {/* Submit button - desktop */}
              <div className="hidden lg:block">
                <div data-payment-button style={{ display: 'none' }} />
                <PaymentButton
                  amount={totalAmount}
                  orderName={`${items[0]?.name || '상품'} 외 ${items.length - 1}건`}
                  customerName={customerName}
                  customerEmail={customerEmail}
                  customerPhone={customerPhone}
                  items={items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    image: item.image,
                  }))}
                  shippingAddress={{
                    name: customerName,
                    phone: customerPhone,
                    address: shippingAddress,
                    postal_code: shippingZipcode,
                    detail_address: shippingRequest,
                  }}
                  onSuccess={() => {
                    clearCart();
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
