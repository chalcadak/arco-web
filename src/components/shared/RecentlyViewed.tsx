'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '@/components/ui/typography';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/types/product';

const STORAGE_KEY = 'arco_recently_viewed';
const MAX_ITEMS = 10;

export function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as Product[];
        setProducts(items);
      }
    } catch (error) {
      console.error('Failed to load recently viewed:', error);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('recently-viewed-scroll');
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-12 border-t">
      <div className="flex items-center justify-between mb-6">
        <Heading level={3}>최근 본 상품</Heading>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors disabled:opacity-50"
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        id="recently-viewed-scroll"
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex-shrink-0 w-48 group"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 mb-3">
              <Image
                src={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="192px"
              />
            </div>
            <Text className="font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </Text>
            <Text className="text-sm text-primary font-bold">
              {product.price.toLocaleString()}원
            </Text>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Helper function to add product to recently viewed
export function addToRecentlyViewed(product: Product) {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let items: Product[] = stored ? JSON.parse(stored) : [];

    // Remove existing item if already viewed
    items = items.filter((item) => item.id !== product.id);

    // Add to front
    items.unshift(product);

    // Keep only MAX_ITEMS
    items = items.slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save recently viewed:', error);
  }
}
