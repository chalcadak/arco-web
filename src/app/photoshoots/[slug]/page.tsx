import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PhotoshootDetail from '@/components/customer/PhotoshootDetail';
import { PhotoshootLook } from '@/types/product';

async function getPhotoshootLook(slug: string) {
  const supabase = await createClient();
  
  const { data: look, error } = await supabase
    .from('photoshoot_looks')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !look) {
    return null;
  }

  return look as PhotoshootLook;
}

// 관련 촬영룩 가져오기
async function getRelatedLooks(categoryId: number, currentLookId: string) {
  const supabase = await createClient();
  
  const { data: looks, error } = await supabase
    .from('photoshoot_looks')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', currentLookId)
    .limit(4);

  if (error) {
    return [];
  }

  return looks as PhotoshootLook[];
}

interface PhotoshootPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PhotoshootPage({ params }: PhotoshootPageProps) {
  const { slug } = await params;
  const look = await getPhotoshootLook(slug);

  if (!look) {
    notFound();
  }

  const relatedLooks = await getRelatedLooks(look.category_id, look.id);

  return (
    <div className="min-h-screen bg-background">
      <PhotoshootDetail look={look} relatedLooks={relatedLooks} />
    </div>
  );
}

// 메타데이터 생성
export async function generateMetadata({ params }: PhotoshootPageProps) {
  const { slug } = await params;
  const look = await getPhotoshootLook(slug);

  if (!look) {
    return {
      title: '촬영룩을 찾을 수 없습니다',
    };
  }

  return {
    title: `${look.name} | ARCO 촬영 서비스`,
    description: look.description || `${look.name} - 프리미엄 반려견 촬영 서비스`,
  };
}
