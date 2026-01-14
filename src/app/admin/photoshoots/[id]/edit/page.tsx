import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { ArrowLeft } from 'lucide-react';
import { PhotoshootForm } from '@/components/admin/PhotoshootForm';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPhotoshoot(id: string) {
  const supabase = await createClient();

  const { data: photoshoot, error } = await supabase
    .from('photoshoot_looks')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single();

  if (error || !photoshoot) {
    return null;
  }

  return photoshoot;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const photoshoot = await getPhotoshoot(id);

  return {
    title: `${photoshoot?.name || '촬영룩'} 수정 - ARCO 관리자`,
  };
}

export default async function AdminPhotoshootEditPage({ params }: PageProps) {
  const { id } = await params;
  const photoshoot = await getPhotoshoot(id);

  if (!photoshoot) {
    notFound();
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Back button */}
        <Link href="/admin/photoshoots">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            촬영룩 목록
          </Button>
        </Link>

        {/* Page header */}
        <div>
          <Heading level={1}>촬영룩 수정</Heading>
          <Text variant="muted" className="mt-2">{photoshoot.name}</Text>
        </div>

        {/* Photoshoot form */}
        <PhotoshootForm photoshoot={photoshoot} isEdit={true} />
      </div>
    </Container>
  );
}
