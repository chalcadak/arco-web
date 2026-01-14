import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Calendar, Clock, User, Phone, Mail, Dog } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getBooking(id: string) {
  const supabase = await createClient();
  
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      photoshoot_look:photoshoot_looks(*)
    `)
    .eq('id', id)
    .single();

  if (error || !booking) {
    return null;
  }

  return booking;
}

export const metadata: Metadata = {
  title: '예약 완료 - ARCO',
  description: '촬영 예약이 완료되었습니다.',
};

export default async function BookingSuccessPage({ params }: PageProps) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  const bookingDate = new Date(booking.booking_date);
  const formattedDate = format(bookingDate, 'yyyy년 M월 d일 (E)', { locale: ko });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">예약이 완료되었습니다!</h1>
        <p className="text-muted-foreground">
          예약 번호: <span className="font-mono font-semibold">{booking.id.slice(0, 8).toUpperCase()}</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* 촬영 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">촬영 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">
                {booking.photoshoot_look.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {booking.photoshoot_look.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">촬영 날짜</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">촬영 시간</p>
                  <p className="font-medium">{booking.booking_time}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">결제 금액</span>
                <span className="text-2xl font-bold">₩{booking.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 고객 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">고객 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">이름</p>
                <p className="font-medium">{booking.customer_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">전화번호</p>
                <p className="font-medium">{booking.customer_phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">이메일</p>
                <p className="font-medium">{booking.customer_email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 반려견 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">반려견 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Dog className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">이름</p>
                <p className="font-medium">{booking.pet_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">나이</p>
                <p className="font-medium">{booking.pet_age}살</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">크기</p>
                <p className="font-medium">
                  {booking.pet_size === 'small' && '소형'}
                  {booking.pet_size === 'medium' && '중형'}
                  {booking.pet_size === 'large' && '대형'}
                </p>
              </div>
            </div>

            {booking.special_requests && (
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">특이사항</p>
                <p className="text-sm">{booking.special_requests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 다음 단계 안내 */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">다음 단계</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-muted-foreground">1.</span>
                <span>예약 확인 이메일을 보내드렸습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">2.</span>
                <span>촬영 1일 전 확인 연락을 드리겠습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">3.</span>
                <span>촬영 당일 예약 시간 10분 전까지 도착해주세요.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">4.</span>
                <span>촬영 후 3-5일 내에 사진을 전달해드립니다.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          <Button variant="outline" asChild className="flex-1">
            <Link href="/photoshoots">다른 촬영룩 보기</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
