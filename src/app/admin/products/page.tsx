import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading, Text } from '@/components/ui/typography';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';

export const metadata: Metadata = {
  title: '상품 관리 - ARCO 관리자',
  description: '상품 목록 및 관리',
};

async function getProducts() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products || [];
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>상품 관리</Heading>
          <Text className="text-muted-foreground mt-2">
            총 {products.length}개의 상품
          </Text>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            상품 추가
          </Button>
        </Link>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Text className="text-muted-foreground mb-4">상품이 없습니다</Text>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                첫 상품 추가하기
              </Button>
            </Link>
          </div>
        ) : (
          products.map((product: any) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative aspect-square bg-neutral-100">
                <Image
                  src={product.images?.[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!product.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">비활성</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Heading level={3} className="font-semibold line-clamp-2">{product.name}</Heading>
                    {product.is_active ? (
                      <Eye className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category.name}
                      </Badge>
                    )}
                    {product.tags?.includes('신상품') && (
                      <Badge className="text-xs">신상품</Badge>
                    )}
                    {product.tags?.includes('베스트셀러') && (
                      <Badge variant="secondary" className="text-xs">
                        베스트셀러
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Text size="lg" className="font-bold">
                      ₩{product.price.toLocaleString()}
                    </Text>
                    <Text size="sm" className="text-muted-foreground">
                      재고: {product.stock_quantity}
                    </Text>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/products/${product.slug}`} target="_blank" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-3 h-3 mr-1" />
                        보기
                      </Button>
                    </Link>
                    <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        <Edit className="w-3 h-3 mr-1" />
                        수정
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
