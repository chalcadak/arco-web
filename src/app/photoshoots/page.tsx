import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import PhotoshootList from '@/components/customer/PhotoshootList';
import { PhotoshootLook } from '@/types/product';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';

async function getPhotoshootLooks() {
  const supabase = await createClient();
  
  const { data: looks, error } = await supabase
    .from('photoshoot_looks')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photoshoot looks:', error);
    return [];
  }

  return looks as PhotoshootLook[];
}

async function getCategories() {
  const supabase = await createClient();
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('type', 'photoshoot')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories;
}

export default async function PhotoshootsPage() {
  const [looks, categories] = await Promise.all([
    getPhotoshootLooks(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-neutral-50 to-background py-12 md:py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={1} className="mb-4">
              촬영룩
            </Heading>
            <Text size="lg" className="text-muted-foreground">
              프리미엄 반려견 전문 촬영 서비스
            </Text>
          </div>
        </Container>
      </section>

      {/* Photoshoot List */}
      <section className="py-12">
        <Container>
          <Suspense fallback={<PhotoshootListSkeleton />}>
            <PhotoshootList 
              initialLooks={looks}
              categories={categories}
            />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}

function PhotoshootListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-neutral-200 aspect-square rounded-lg mb-4" />
          <div className="h-4 bg-neutral-200 rounded mb-2" />
          <div className="h-4 bg-neutral-200 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
