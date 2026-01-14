// 개인화 추천 피드 UI 컴포넌트
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { RecommendationSection } from '@/lib/recommendations/customer';
import { Button } from '@/components/ui/button';

interface PersonalizedFeedProps {
  sections: RecommendationSection[];
}

export function PersonalizedFeed({ sections }: PersonalizedFeedProps) {
  if (sections.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-2">🛍️</div>
        <div className="text-sm">추천 상품을 준비 중입니다</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <FeedSection key={section.id} section={section} />
      ))}
    </div>
  );
}

interface FeedSectionProps {
  section: RecommendationSection;
}

function FeedSection({ section }: FeedSectionProps) {
  return (
    <section>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="text-sm text-gray-600">
            {section.subtitle}
          </p>
        )}
        {section.reason && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            <span>💡</span>
            <span>{section.reason}</span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {section.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View More */}
      {section.products.length >= 8 && (
        <div className="mt-6 text-center">
          <Link href={`/products?category=${section.products[0]?.category || ''}`}>
            <Button variant="outline" size="sm">
              더 보기 →
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
  };
}

function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-product.jpg';
  
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white px-3 py-1 rounded text-sm font-semibold text-gray-900">
              품절
            </div>
          </div>
        )}
        
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            재고 {product.stock}개
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">원</span>
        </div>
      </div>
    </Link>
  );
}

// 함께 구매한 상품 섹션
interface FrequentlyBoughtTogetherProps {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  }>;
  currentProductName: string;
}

export function FrequentlyBoughtTogether({ 
  products, 
  currentProductName 
}: FrequentlyBoughtTogetherProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        🛒 "{currentProductName}"와 함께 구매한 상품
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h4>
              <div className="text-base font-bold text-gray-900">
                {product.price.toLocaleString()}원
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
