import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';
import { InquiryForm } from '@/components/customer/InquiryForm';

export const metadata: Metadata = {
  title: '1:1 문의 - ARCO',
  description: 'ARCO 고객센터 1:1 문의',
};

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <Container size="md">
        <div className="mb-8">
          <Heading level={1} className="mb-2">1:1 문의</Heading>
          <Text className="text-muted-foreground">
            문의 사항을 남겨주시면 빠르게 답변 드리겠습니다.
          </Text>
        </div>

        <InquiryForm />

        <div className="mt-8 p-6 bg-neutral-50 rounded-lg">
          <Heading level={3} size="sm" className="mb-3">문의 안내</Heading>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 문의 답변은 평일 기준 1-2일 소요됩니다.</li>
            <li>• 주말 및 공휴일에는 답변이 지연될 수 있습니다.</li>
            <li>• 등록하신 이메일로 답변을 발송해 드립니다.</li>
            <li>• 긴급한 문의는 고객센터(1234-5678)로 전화주세요.</li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
