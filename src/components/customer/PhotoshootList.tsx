'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhotoshootLook } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 카테고리 필터링
  const filteredLooks = useMemo(() => {
    if (!selectedCategory) return initialLooks;
    return initialLooks.filter(
      (look) => look.category_id === selectedCategory
    );
  }, [initialLooks, selectedCategory]);

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

      {/* 촬영룩 개수 */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{filteredLooks.length}</span>개의 촬영룩
        </p>
      </div>

      {/* 촬영룩 그리드 */}
      {filteredLooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">촬영룩이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLooks.map((look) => (
            <PhotoshootCard key={look.id} look={look} />
          ))}
        </div>
      )}
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
    <Link href={`/photoshoots/${look.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={mainImage}
            alt={look.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* 뱃지 */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isNew && <Badge variant="default">신규</Badge>}
            {isPopular && <Badge variant="secondary">인기</Badge>}
          </div>

          {/* 촬영 시간 표시 */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-white/90">
              {look.duration_minutes}분
            </Badge>
          </div>
        </div>

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
      </Card>
    </Link>
  );
}
