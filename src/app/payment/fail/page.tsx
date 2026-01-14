'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <Container size="sm">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-red-100 rounded-full">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <Heading level={2} className="mb-4">결제에 실패했습니다</Heading>
            {errorMessage && (
              <Text className="text-muted-foreground mb-2">
                {errorMessage}
              </Text>
            )}
            {errorCode && (
              <Text size="sm" className="text-muted-foreground mb-8">
                오류 코드: {errorCode}
              </Text>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push('/cart')}>
                다시 시도하기
              </Button>
              <Link href="/">
                <Button variant="outline">홈으로</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
