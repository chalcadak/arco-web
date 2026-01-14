'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhotoshootLook } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { WishlistButton } from '@/components/shared/WishlistButton';
import SearchBar from '@/components/shared/SearchBar';
import FilterPanel, { FilterOptions } from '@/components/shared/FilterPanel';

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface PhotoshootListProps {
  initialLooks: PhotoshootLook[];
  categories: Category[];
}

export default function PhotoshootList({ initialLooks, categories }: PhotoshootListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 1000000 },
    tags: [],
    sortBy: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply search and filters
  const filteredAndSortedLooks = useMemo(() => {
    let result = [...initialLooks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (look) =>
          look.name.toLowerCase().includes(query) ||
          look.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((look) =>
        filters.categories.some((cat) => cat.id === look.category_id)
      );
    }

    // Price range filter
    result = result.filter(
      (look) =>
        look.price >= filters.priceRange.min &&
        look.price <= filters.priceRange.max
    );

    // Tags filter
    if (filters.tags.length > 0) {
      result = result.filter((look) =>
        filters.tags.some((tag) => look.tags?.includes(tag))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        result.sort((a, b) => {
          const aPopular = a.tags?.includes('인기') ? 1 : 0;
          const bPopular = b.tags?.includes('인기') ? 1 : 0;
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
  }, [initialLooks, searchQuery, filters]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="촬영룩 검색..."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel - Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              availableCategories={categories}
              availableTags={['신규', '인기', '추천', '베스트']}
            />
          </div>
        </div>

        {/* Photoshoots */}
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
                availableTags={['신규', '인기', '추천', '베스트']}
              />
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              총{' '}
              <span className="font-semibold text-foreground">
                {filteredAndSortedLooks.length}
              </span>
              개의 촬영룩
            </p>

            {searchQuery && (
              <p className="text-sm text-gray-500">
                '<span className="font-semibold">{searchQuery}</span>' 검색 결과
              </p>
            )}
          </div>

          {/* Photoshoot Grid */}
          {filteredAndSortedLooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">
                {searchQuery
                  ? '검색 결과가 없습니다.'
                  : '촬영룩이 없습니다.'}
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
              {filteredAndSortedLooks.map((look) => (
                <PhotoshootCard key={look.id} look={look} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PhotoshootCardProps {
  look: PhotoshootLook;
}

function PhotoshootCard({ look }: PhotoshootCardProps) {
  const mainImage = look.images?.[0] || '/placeholder-product.jpg';
  const isNew = look.tags?.includes('신규');
  const isPopular = look.tags?.includes('인기');

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Link href={`/photoshoots/${look.slug}`}>
          <Image
            src={mainImage}
            alt={look.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* 뱃지 */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && <Badge variant="default">신규</Badge>}
          {isPopular && <Badge variant="secondary">인기</Badge>}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 bg-white rounded-full shadow-md">
          <WishlistButton
            item={{
              id: look.id,
              type: 'photoshoot',
              name: look.name,
              slug: look.slug,
              price: look.price,
              images: look.images || [],
            }}
          />
        </div>

        {/* 촬영 시간 표시 */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="outline" className="bg-white/90">
            {look.duration_minutes}분
          </Badge>
        </div>
      </div>

      <Link href={`/photoshoots/${look.slug}`}>
        <CardContent className="p-4">
          <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {look.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-bold">
              {look.price.toLocaleString()}원
            </span>
          </div>

          {/* 간단한 설명 */}
          {look.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {look.description}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
