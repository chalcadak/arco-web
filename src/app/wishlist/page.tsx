'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { staggerContainer, staggerItem } from '@/lib/animations';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: any) => {
    // 상품인 경우만 장바구니에 추가
    if (item.type === 'product') {
      addToCart({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        images: item.images,
        slug: item.slug,
      });
      alert('장바구니에 추가되었습니다!');
    }
  };

  const handleClearAll = () => {
    if (confirm('위시리스트를 모두 비우시겠습니까?')) {
      clearWishlist();
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <Heading level={1}>위시리스트</Heading>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" onClick={handleClearAll} size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            전체 삭제
          </Button>
        )}
      </div>

      <Text variant="muted" className="mb-8">
        총 {items.length}개의 상품
      </Text>

      {/* Empty State */}
      {items.length === 0 && (
        <Card className="py-16 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <Heading level={3} className="mb-2">
            위시리스트가 비어있습니다
          </Heading>
          <Text variant="muted" className="mb-6">
            마음에 드는 상품을 찜해보세요!
          </Text>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button>상품 둘러보기</Button>
            </Link>
            <Link href="/photoshoots">
              <Button variant="outline">촬영룩 보기</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Wishlist Items */}
      {items.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {items.map((item) => (
            <motion.div key={item.id} variants={staggerItem}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <Link
                  href={
                    item.type === 'product'
                      ? `/products/${item.slug}`
                      : `/photoshoots/${item.slug}`
                  }
                  className="block relative aspect-square"
                >
                  <Image
                    src={item.images[0] || '/placeholder-product.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
                    {item.type === 'product' ? '상품' : '촬영룩'}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <Link
                    href={
                      item.type === 'product'
                        ? `/products/${item.slug}`
                        : `/photoshoots/${item.slug}`
                    }
                  >
                    <Heading level={3} className="line-clamp-2 hover:text-primary transition-colors">
                      {item.name}
                    </Heading>
                  </Link>

                  <Text className="text-lg font-semibold">
                    ₩{item.price.toLocaleString()}
                  </Text>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {item.type === 'product' && (
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        장바구니
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeItem(item.id)}
                      className={item.type === 'product' ? '' : 'flex-1'}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Container>
  );
}
