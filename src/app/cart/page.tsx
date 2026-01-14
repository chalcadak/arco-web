'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { CouponInput } from '@/components/shared/CouponInput';
import { Minus, Plus, X } from 'lucide-react';
import type { CouponValidation } from '@/types/coupon';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);

  const totalPrice = getTotalPrice();
  const shippingFee = totalPrice >= 50000 ? 0 : 3000;
  const discountAmount = appliedCoupon?.discount_amount || 0;
  const finalPrice = totalPrice + shippingFee - discountAmount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Container className="py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Heading level={1} className="mb-4">장바구니</Heading>
            <div className="py-12">
              <Text className="text-muted-foreground mb-6">
                장바구니가 비어있습니다.
              </Text>
              <Link href="/products">
                <Button size="lg">상품 둘러보기</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Heading level={1}>장바구니</Heading>
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('장바구니를 비우시겠습니까?')) {
                  clearCart();
                }
              }}
            >
              전체 삭제
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 장바구니 아이템 목록 */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <Card key={`${item.productId}-${item.size}-${item.color}-${index}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* 상품 이미지 */}
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-neutral-100"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </Link>

                      {/* 상품 정보 */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-semibold hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        
                        <div className="mt-2 space-y-1">
                          {item.size && <Text size="sm" className="text-muted-foreground">사이즈: {item.size}</Text>}
                          {item.color && <Text size="sm" className="text-muted-foreground">색상: {item.color}</Text>}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          {/* 수량 조절 */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size,
                                  item.color,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size,
                                  item.color,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* 가격 */}
                          <div className="text-right">
                            <div className="font-bold">
                              {(item.price * item.quantity).toLocaleString()}원
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-muted-foreground">
                                {item.price.toLocaleString()}원 x {item.quantity}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 삭제 버튼 */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() =>
                          removeItem(item.productId, item.size, item.color)
                        }
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-4">
                  <Heading level={2} size="lg">주문 요약</Heading>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text size="sm" className="text-muted-foreground">
                        상품 금액 ({items.length}개)
                      </Text>
                      <Text size="sm" className="font-semibold">
                        {totalPrice.toLocaleString()}원
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="sm" className="text-muted-foreground">배송비</Text>
                      <Text size="sm" className="font-semibold">
                        {shippingFee === 0 ? (
                          <span className="text-green-600">무료</span>
                        ) : (
                          `${shippingFee.toLocaleString()}원`
                        )}
                      </Text>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between">
                        <Text size="sm" className="text-muted-foreground">쿠폰 할인</Text>
                        <Text size="sm" className="font-semibold text-green-600">
                          -{discountAmount.toLocaleString()}원
                        </Text>
                      </div>
                    )}
                    {shippingFee > 0 && (
                      <Text size="xs" className="text-muted-foreground">
                        {(50000 - totalPrice).toLocaleString()}원 더 담으면 무료 배송!
                      </Text>
                    )}
                  </div>

                  {/* 쿠폰 입력 */}
                  <div className="border-t pt-4">
                    <CouponInput
                      orderAmount={totalPrice}
                      onCouponApplied={(validation) => setAppliedCoupon(validation)}
                      onCouponRemoved={() => setAppliedCoupon(null)}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <Text className="font-bold">총 결제 금액</Text>
                      <Heading level={3} className="text-primary">
                        {finalPrice.toLocaleString()}원
                      </Heading>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button size="lg" className="w-full">
                      주문하기
                    </Button>
                  </Link>

                  <Link href="/products">
                    <Button variant="outline" size="lg" className="w-full">
                      쇼핑 계속하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
