'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/stores/cartStore';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/placeholder-product.jpg'];

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      alert('색상을 선택해주세요.');
      return;
    }

    // 장바구니에 추가
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: images[0],
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      });
    }

    alert('장바구니에 추가되었습니다!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* 이미지 갤러리 */}
        <div className="space-y-4">
          {/* 메인 이미지 */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-xl px-6 py-3">
                  품절
                </Badge>
              </div>
            )}
          </div>

          {/* 썸네일 이미지 */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="space-y-6">
          {/* 카테고리 & 뱃지 */}
          <div className="flex items-center gap-2">
            {product.category && (
              <Badge variant="outline">{product.category.name}</Badge>
            )}
            {product.tags?.includes('신상품') && (
              <Badge variant="default">신상품</Badge>
            )}
            {product.tags?.includes('베스트셀러') && (
              <Badge variant="secondary">베스트셀러</Badge>
            )}
          </div>

          {/* 상품명 */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-primary">
              {product.price.toLocaleString()}원
            </p>
          </div>

          {/* 상품 설명 */}
          {product.description && (
            <div className="border-t pt-6">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* 사이즈 선택 */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold">사이즈</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                    disabled={isOutOfStock}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 색상 선택 */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold">색상</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? 'default' : 'outline'}
                    onClick={() => setSelectedColor(color)}
                    disabled={isOutOfStock}
                    className="min-w-20"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 수량 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">수량</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock}
              >
                -
              </Button>
              <span className="w-12 text-center font-semibold">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                disabled={isOutOfStock}
              >
                +
              </Button>
            </div>
          </div>

          {/* 재고 정보 */}
          <div className="text-sm text-muted-foreground">
            {isOutOfStock ? (
              <span className="text-destructive font-semibold">품절</span>
            ) : product.stock_quantity <= 5 ? (
              <span className="text-yellow-600 font-semibold">
                재고 {product.stock_quantity}개 남음
              </span>
            ) : (
              <span>재고 충분</span>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              장바구니 담기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              바로 구매
            </Button>
          </div>

          {/* 상품 상세 정보 */}
          <Card className="mt-6">
            <CardContent className="p-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">배송비</span>
                <span className="font-semibold">3,000원 (50,000원 이상 무료)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">배송 예정</span>
                <span className="font-semibold">2-3일 이내</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">반품/교환</span>
                <span className="font-semibold">수령 후 7일 이내</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 관련 상품 */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">이런 상품은 어때요?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.slug}`}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    <Image
                      src={relatedProduct.images?.[0] || '/placeholder-product.jpg'}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm font-bold">
                      {relatedProduct.price.toLocaleString()}원
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
