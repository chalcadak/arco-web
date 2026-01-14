'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { WishlistButton } from '@/components/shared/WishlistButton';

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface ProductListProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductList({ initialProducts, categories }: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 카테고리 필터링
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return initialProducts;
    return initialProducts.filter(
      (product) => product.category_id === selectedCategory
    );
  }, [initialProducts, selectedCategory]);

  return (
    <div>
      {/* 카테고리 필터 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            전체
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* 상품 개수 */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{filteredProducts.length}</span>개의 상품
        </p>
      </div>

      {/* 상품 그리드 */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || '/placeholder-product.jpg';
  const isNew = product.tags?.includes('신상품');
  const isBestseller = product.tags?.includes('베스트셀러');

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>
        
        {/* 뱃지 */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && <Badge variant="default">신상품</Badge>}
          {isBestseller && <Badge variant="secondary">베스트</Badge>}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 bg-white rounded-full shadow-md">
          <WishlistButton
            item={{
              id: product.id,
              type: 'product',
              name: product.name,
              slug: product.slug,
              price: product.price,
              images: product.images || [],
            }}
          />
        </div>

        {/* 품절 오버레이 */}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              품절
            </Badge>
          </div>
        )}
      </div>

      <Link href={`/products/${product.slug}`}>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {product.price.toLocaleString()}원
            </span>
          </div>

          {/* 색상 옵션 미리보기 */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mt-3">
              {product.colors.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: getColorCode(color) }}
                  title={color}
                />
              ))}
              {product.colors.length > 5 && (
                <div className="text-xs text-muted-foreground flex items-center">
                  +{product.colors.length - 5}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

// 색상 이름을 CSS 색상 코드로 변환
function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Navy': '#001F3F',
    'Beige': '#F5F5DC',
    'Yellow': '#FFFF00',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Pink': '#FFC0CB',
  };

  return colorMap[colorName] || '#CCCCCC';
}
