import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BookingForm } from '@/components/customer/BookingForm';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPhotoshootLook(slug: string) {
  const supabase = await createClient();
  
  const { data: photoshootLook, error } = await supabase
    .from('photoshoot_looks')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !photoshootLook) {
    return null;
  }

  return photoshootLook;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const photoshootLook = await getPhotoshootLook(slug);

  if (!photoshootLook) {
    return {
      title: '촬영 예약 - ARCO',
    };
  }

  return {
    title: `${photoshootLook.name} 예약 - ARCO`,
    description: `${photoshootLook.name} 촬영 예약하기`,
  };
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;
  const photoshootLook = await getPhotoshootLook(slug);

  if (!photoshootLook) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">촬영 예약</h1>
        <p className="text-muted-foreground">
          아래 정보를 입력하여 촬영을 예약해주세요.
        </p>
      </div>

      <BookingForm photoshootLook={photoshootLook} />
    </div>
  );
}
