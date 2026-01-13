'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhotoshootLook } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface PhotoshootDetailProps {
  look: PhotoshootLook;
  relatedLooks: PhotoshootLook[];
}

export default function PhotoshootDetail({ look, relatedLooks }: PhotoshootDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = look.images && look.images.length > 0 
    ? look.images 
    : ['/placeholder-product.jpg'];

  const handleBooking = () => {
    // 예약 페이지로 이동
    window.location.href = `/photoshoots/${look.slug}/booking`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* 이미지 갤러리 */}
        <div className="space-y-4">
          {/* 메인 이미지 */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
            <Image
              src={images[selectedImage]}
              alt={look.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
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
                    alt={`${look.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 촬영룩 정보 */}
        <div className="space-y-6">
          {/* 카테고리 & 뱃지 */}
          <div className="flex items-center gap-2">
            {look.category && (
              <Badge variant="outline">{look.category.name}</Badge>
            )}
            {look.tags?.includes('신규') && (
              <Badge variant="default">신규</Badge>
            )}
            {look.tags?.includes('인기') && (
              <Badge variant="secondary">인기</Badge>
            )}
          </div>

          {/* 촬영룩명 */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {look.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary">
                {look.price.toLocaleString()}원
              </span>
              <span className="text-sm text-muted-foreground">
                / {look.duration_minutes}분
              </span>
            </div>
          </div>

          {/* 촬영룩 설명 */}
          {look.description && (
            <div className="border-t pt-6">
              <p className="text-muted-foreground leading-relaxed">
                {look.description}
              </p>
            </div>
          )}

          {/* 포함 항목 */}
          {look.included_items && look.included_items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">포함 항목</h3>
              <ul className="space-y-2">
                {look.included_items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 요구사항 */}
          {look.requirements && (
            <div className="bg-neutral-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">요구사항</h3>
              <p className="text-sm text-muted-foreground">
                {look.requirements}
              </p>
            </div>
          )}

          {/* 예약 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleBooking}
            >
              예약하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => window.open('tel:010-0000-0000')}
            >
              전화 문의
            </Button>
          </div>

          {/* 촬영 정보 */}
          <Card className="mt-6">
            <CardContent className="p-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">촬영 시간</span>
                <span className="font-semibold">{look.duration_minutes}분</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">예약 가능</span>
                <span className="font-semibold">평일/주말</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">납품 기간</span>
                <span className="font-semibold">촬영 후 7일 이내</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">취소/변경</span>
                <span className="font-semibold">촬영 3일 전까지 무료</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 관련 촬영룩 */}
      {relatedLooks.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">다른 촬영룩</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedLooks.map((relatedLook) => (
              <Link
                key={relatedLook.id}
                href={`/photoshoots/${relatedLook.slug}`}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    <Image
                      src={relatedLook.images?.[0] || '/placeholder-product.jpg'}
                      alt={relatedLook.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {relatedLook.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">
                        {relatedLook.price.toLocaleString()}원
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {relatedLook.duration_minutes}분
                      </Badge>
                    </div>
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
