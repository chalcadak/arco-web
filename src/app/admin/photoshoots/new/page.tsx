import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { ArrowLeft } from 'lucide-react';
import { PhotoshootForm } from '@/components/admin/PhotoshootForm';

export const metadata: Metadata = {
  title: '촬영룩 추가 - ARCO 관리자',
  description: '새로운 촬영룩 추가',
};

export default function AdminPhotoshootNewPage() {
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
          <Heading level={1}>촬영룩 추가</Heading>
          <Text variant="muted" className="mt-2">
            새로운 촬영룩을 등록합니다
          </Text>
        </div>

        {/* Photoshoot form */}
        <PhotoshootForm />
      </div>
    </Container>
  );
}
