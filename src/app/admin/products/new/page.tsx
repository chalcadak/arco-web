import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: '상품 추가 - ARCO 관리자',
  description: '새로운 상품 추가',
};

export default function AdminProductNewPage() {
  return (
    <Container>
      <div className="space-y-6">
        {/* Back button */}
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            상품 목록
          </Button>
        </Link>

        {/* Page header */}
        <div>
          <Heading level={1}>상품 추가</Heading>
          <Text variant="muted" className="mt-2">
            새로운 상품을 등록합니다
          </Text>
        </div>

        {/* Product form */}
        <ProductForm />
      </div>
    </Container>
  );
}
