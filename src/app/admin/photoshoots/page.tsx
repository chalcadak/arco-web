import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading, Text } from '@/components/ui/typography';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';

export const metadata: Metadata = {
  title: '촬영룩 관리 - ARCO 관리자',
  description: '촬영룩 목록 및 관리',
};

async function getPhotoshoots() {
  const supabase = await createClient();

  const { data: photoshoots, error } = await supabase
    .from('photoshoot_looks')
    .select(`
      *,
      category:categories(
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photoshoots:', error);
    return [];
  }

  return photoshoots || [];
}

export default async function AdminPhotoshootsPage() {
  const photoshoots = await getPhotoshoots();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>촬영룩 관리</Heading>
          <Text className="text-muted-foreground mt-2">
            총 {photoshoots.length}개의 촬영룩
          </Text>
        </div>
        <Link href="/admin/photoshoots/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            촬영룩 추가
          </Button>
        </Link>
      </div>

      {/* Photoshoots grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photoshoots.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Text className="text-muted-foreground mb-4">촬영룩이 없습니다</Text>
            <Link href="/admin/photoshoots/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                첫 촬영룩 추가하기
              </Button>
            </Link>
          </div>
        ) : (
          photoshoots.map((photoshoot: any) => (
            <Card key={photoshoot.id} className="overflow-hidden">
              <div className="relative aspect-square bg-neutral-100">
                <Image
                  src={photoshoot.images?.[0] || '/placeholder-product.jpg'}
                  alt={photoshoot.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!photoshoot.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">비활성</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Heading level={3} className="font-semibold line-clamp-2">{photoshoot.name}</Heading>
                    {photoshoot.is_active ? (
                      <Eye className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {photoshoot.category && (
                      <Badge variant="outline" className="text-xs">
                        {photoshoot.category.name}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {photoshoot.duration_minutes}분
                    </Badge>
                  </div>

                  <Text size="lg" className="font-bold">
                    ₩{photoshoot.price.toLocaleString()}
                  </Text>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/photoshoots/${photoshoot.slug}`}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-3 h-3 mr-1" />
                        보기
                      </Button>
                    </Link>
                    <Link
                      href={`/admin/photoshoots/${photoshoot.id}/edit`}
                      className="flex-1"
                    >
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
