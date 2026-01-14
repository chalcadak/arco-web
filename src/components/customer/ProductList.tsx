'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { WishlistButton } from '@/components/shared/WishlistButton';
import SearchBar from '@/components/shared/SearchBar';
import FilterPanel, { FilterOptions } from '@/components/shared/FilterPanel';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 1000000 },
    tags: [],
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply search and filters
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.some((cat) => cat.id === product.category_id)
      );
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
    );

    // Tags filter
    if (filters.tags.length > 0) {
      result = result.filter((product) =>
        filters.tags.some((tag) => product.tags?.includes(tag))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        // Assuming id is sequential (higher = newer)
        result.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        // Placeholder: Could use view count or sales
        result.sort((a, b) => {
          const aPopular = a.tags?.includes('베스트셀러') ? 1 : 0;
          const bPopular = b.tags?.includes('베스트셀러') ? 1 : 0;
          return bPopular - aPopular;
        });
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
        break;
    }

    return result;
  }, [initialProducts, searchQuery, filters]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="상품명, 설명으로 검색..."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel - Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              availableCategories={categories}
              availableTags={['신상품', '베스트셀러', '인기', '추천']}
            />
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              {showFilters ? '필터 숨기기' : '필터 표시'}
            </Button>
          </div>

          {/* Mobile Filter Panel */}
          {showFilters && (
            <div className="lg:hidden mb-6">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                availableCategories={categories}
                availableTags={['신상품', '베스트셀러', '인기', '추천']}
              />
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              총{' '}
              <span className="font-semibold text-foreground">
                {filteredAndSortedProducts.length}
              </span>
              개의 상품
            </p>
            
            {searchQuery && (
              <p className="text-sm text-gray-500">
                '<span className="font-semibold">{searchQuery}</span>' 검색 결과
              </p>
            )}
          </div>

          {/* Product Grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">
                {searchQuery
                  ? '검색 결과가 없습니다.'
                  : '상품이 없습니다.'}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      categories: [],
                      priceRange: { min: 0, max: 1000000 },
                      tags: [],
                      sortBy: 'newest',
                    });
                  }}
                >
                  필터 초기화
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
    Black: '#000000',
    White: '#FFFFFF',
    Navy: '#001F3F',
    Beige: '#F5F5DC',
    Yellow: '#FFFF00',
    Red: '#FF0000',
    Blue: '#0000FF',
    Pink: '#FFC0CB',
  };

  return colorMap[colorName] || '#CCCCCC';
}
