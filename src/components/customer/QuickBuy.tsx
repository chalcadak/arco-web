// 퀵 바이 (Quick Buy) 컴포넌트
// "클릭 3번으로 구매 완료"
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  options?: {
    sizes?: string[];
    colors?: string[];
  };
}

interface QuickBuyButtonProps {
  product: Product;
  onPurchaseComplete?: (orderId: string) => void;
}

export function QuickBuyButton({ product, onPurchaseComplete }: QuickBuyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleQuickBuy = async () => {
    setIsPurchasing(true);
    
    try {
      // TODO: 실제 결제 API 호출
      const response = await fetch('/api/quick-buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          options: {
            size: selectedSize,
            color: selectedColor
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        onPurchaseComplete?.(data.orderId);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Quick buy failed:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const canPurchase = 
    (!product.options?.sizes || selectedSize) && 
    (!product.options?.colors || selectedColor);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        ⚡ 바로 구매
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>⚡</span>
              <span>빠른 구매</span>
            </DialogTitle>
            <DialogDescription>
              30% 더 빠르게 구매하세요
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Product Info */}
            <div className="flex gap-3 pb-4 border-b">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <img
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                  {product.name}
                </h4>
                <div className="text-lg font-bold text-gray-900 mt-1">
                  {product.price.toLocaleString()}원
                </div>
              </div>
            </div>

            {/* Size Selection */}
            {product.options?.sizes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사이즈
                </label>
                <div className="flex gap-2">
                  {product.options.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border transition-colors ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.options?.colors && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  색상
                </label>
                <div className="flex gap-2">
                  {product.options.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded border transition-colors ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping & Payment */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">배송지</span>
                <span className="font-medium text-gray-900">
                  최근 배송지 자동 선택
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">결제</span>
                <span className="font-medium text-gray-900">
                  저장된 카드 자동 선택
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold text-gray-900">최종 금액</span>
                <span className="font-bold text-lg text-gray-900">
                  {product.price.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Purchase Button */}
            <Button
              onClick={handleQuickBuy}
              disabled={!canPurchase || isPurchasing}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isPurchasing ? '결제 중...' : '결제하기'}
            </Button>

            {/* Benefits */}
            <div className="text-xs text-gray-500 text-center space-y-1">
              <div>✓ 클릭 3번으로 구매 완료</div>
              <div>✓ 저장된 정보로 자동 입력</div>
              <div>✓ 안전한 결제 보장</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// 상품 카드에 통합된 퀵 바이
interface ProductCardWithQuickBuyProps {
  product: Product & {
    slug: string;
    category: string;
    stock: number;
  };
}

export function ProductCardWithQuickBuy({ product }: ProductCardWithQuickBuyProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
      {/* Product Image */}
      <a href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white px-3 py-1 rounded text-sm font-semibold">
                품절
              </div>
            </div>
          )}
        </div>
      </a>

      {/* Product Info */}
      <div className="p-3">
        <a href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600">
            {product.name}
          </h3>
        </a>
        
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">원</span>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <QuickBuyButton product={product} />
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              // TODO: Add to cart
              console.log('Added to cart:', product.id);
            }}
          >
            🛒 담기
          </Button>
        </div>
      </div>
    </div>
  );
}
