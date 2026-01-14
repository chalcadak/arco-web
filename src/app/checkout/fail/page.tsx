import { Suspense } from 'react';
import Link from 'next/link';
import { XCircle, RefreshCcw, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Heading, Text } from '@/components/ui/typography';

function FailContent({
  searchParams,
}: {
  searchParams: { code?: string; message?: string };
}) {
  const errorCode = searchParams.code || 'UNKNOWN_ERROR';
  const errorMessage = searchParams.message || '알 수 없는 오류가 발생했습니다.';

  // 에러 메시지 한글화
  const getErrorMessage = (code: string, message: string) => {
    const errorMessages: Record<string, string> = {
      'PAY_PROCESS_CANCELED': '사용자가 결제를 취소했습니다.',
      'PAY_PROCESS_ABORTED': '결제 진행 중 오류가 발생했습니다.',
      'REJECT_CARD_COMPANY': '카드사에서 승인을 거부했습니다.',
      'INVALID_CARD_NUMBER': '유효하지 않은 카드번호입니다.',
      'NOT_ENOUGH_BALANCE': '잔액이 부족합니다.',
      'EXCEED_MAX_CARD_INSTALLMENT_PLAN': '설정 가능한 최대 할부 개월수를 초과했습니다.',
      'EXCEED_MAX_DAILY_PAYMENT_COUNT': '하루 결제 가능 횟수를 초과했습니다.',
      'NOT_ALLOWED_PAYMENT_METHOD': '허용되지 않은 결제 수단입니다.',
      'UNKNOWN_PAYMENT_ERROR': '결제 처리 중 오류가 발생했습니다.',
    };

    return errorMessages[code] || message;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Container size="sm">
        {/* 실패 아이콘 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <Heading level={1} className="mb-2">
            결제에 실패했습니다
          </Heading>
          <Text className="text-gray-600">
            결제 처리 중 문제가 발생했습니다.
          </Text>
        </div>

        {/* 에러 정보 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div>
                <Text size="sm" className="text-gray-600">오류 코드</Text>
                <Text size="sm" className="font-mono bg-gray-100 p-2 rounded mt-1 block">
                  {errorCode}
                </Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-600">오류 메시지</Text>
                <Text size="sm" className="bg-red-50 text-red-800 p-3 rounded mt-1 block">
                  {getErrorMessage(errorCode, errorMessage)}
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 해결 방법 안내 */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <Heading level={3} className="mb-3">해결 방법</Heading>
            <ul className="space-y-2">
              <Text size="sm" className="text-gray-700">• 카드 정보를 다시 확인해주세요.</Text>
              <Text size="sm" className="text-gray-700">• 결제 한도를 확인해주세요.</Text>
              <Text size="sm" className="text-gray-700">• 다른 결제 수단을 이용해보세요.</Text>
              <Text size="sm" className="text-gray-700">• 문제가 지속되면 고객센터로 문의해주세요.</Text>
            </ul>
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/cart">
              <RefreshCcw className="mr-2 h-4 w-4" />
              다시 시도하기
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/products">
              <ShoppingCart className="mr-2 h-4 w-4" />
              쇼핑 계속하기
            </Link>
          </Button>
        </div>

        {/* 고객센터 정보 */}
        <div className="mt-8 text-center">
          <Text size="sm" className="text-gray-600 mb-1">도움이 필요하신가요?</Text>
          <a
            href="tel:010-0000-0000"
            className="text-blue-600 hover:underline font-medium text-sm"
          >
            고객센터: 010-0000-0000
          </a>
        </div>
      </Container>
    </div>
  );
}

export default function CheckoutFailPage({
  searchParams,
}: {
  searchParams: { code?: string; message?: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">처리 중...</p>
          </div>
        </div>
      }
    >
      <FailContent searchParams={searchParams} />
    </Suspense>
  );
}
