import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading, Text } from '@/components/ui/typography';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Dog } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookingStatusSelect } from '@/components/admin/BookingStatusSelect';

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
      photoshoot_look:photoshoot_looks(
        id,
        name,
        description,
        price,
        duration_minutes
      )
    `)
    .eq('id', id)
    .single();

  if (error || !booking) {
    return null;
  }

  return booking;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `예약 상세 - ARCO 관리자`,
  };
}

export default async function AdminBookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  const bookingDate = new Date(booking.booking_date);
  const formattedDate = format(bookingDate, 'yyyy년 M월 d일 (E)', { locale: ko });

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/admin/bookings">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          예약 목록
        </Button>
      </Link>

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>예약 상세</Heading>
          <Text className="text-muted-foreground mt-2">
            예약 번호: {booking.id.slice(0, 8).toUpperCase()}
          </Text>
        </div>
        <BookingStatusSelect bookingId={booking.id} currentStatus={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 촬영 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">촬영 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">
                {booking.photoshoot_look?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {booking.photoshoot_look?.description}
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
                <span className="text-muted-foreground">촬영 시간</span>
                <span className="font-medium">
                  {booking.photoshoot_look?.duration_minutes}분
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-muted-foreground">결제 금액</span>
                <span className="text-2xl font-bold">
                  ₩{booking.total_amount.toLocaleString()}
                </span>
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">반려견 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Dog className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">이름</p>
                  <p className="font-medium">{booking.pet_name}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">나이</p>
                <p className="font-medium">{booking.pet_age}살</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">크기</p>
                <p className="font-medium">
                  {booking.pet_size === 'small' && '소형 (5kg 이하)'}
                  {booking.pet_size === 'medium' && '중형 (5-15kg)'}
                  {booking.pet_size === 'large' && '대형 (15kg 이상)'}
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
      </div>
    </div>
  );
}
