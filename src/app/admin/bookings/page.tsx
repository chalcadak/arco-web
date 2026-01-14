import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading, Text } from '@/components/ui/typography';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const metadata: Metadata = {
  title: '예약 관리 - ARCO 관리자',
  description: '예약 목록 및 관리',
};

async function getBookings() {
  const supabase = await createClient();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      photoshoot_look:photoshoot_looks(
        id,
        name,
        price
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return bookings || [];
}

function getStatusBadge(status: string) {
  const variants = {
    pending: { label: '대기', className: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: '확정', className: 'bg-blue-100 text-blue-800' },
    completed: { label: '완료', className: 'bg-green-100 text-green-800' },
    cancelled: { label: '취소', className: 'bg-red-100 text-red-800' },
  };

  const variant = variants[status as keyof typeof variants] || variants.pending;

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${variant.className}`}>
      {variant.label}
    </span>
  );
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1}>예약 관리</Heading>
          <Text className="text-muted-foreground mt-2">
            총 {bookings.length}건의 예약
          </Text>
        </div>
      </div>

      {/* Bookings table */}
      <Card>
        <CardHeader>
          <CardTitle>예약 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Text className="text-muted-foreground mb-4">예약이 없습니다</Text>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      예약 번호
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      고객명
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      촬영룩
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      반려견
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      예약 일시
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      금액
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      상태
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: any) => {
                    const bookingDate = new Date(booking.booking_date);
                    const formattedDate = format(bookingDate, 'yyyy.MM.dd (E)', {
                      locale: ko,
                    });

                    return (
                      <tr key={booking.id} className="border-b hover:bg-neutral-50">
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm">
                            {booking.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <Text className="font-medium">{booking.customer_name}</Text>
                            <Text size="sm" className="text-muted-foreground">
                              {booking.customer_phone}
                            </Text>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Text size="sm">{booking.photoshoot_look?.name}</Text>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <Text size="sm" className="font-medium">{booking.pet_name}</Text>
                            <Text size="xs" className="text-muted-foreground">
                              {booking.pet_age}살 ·{' '}
                              {booking.pet_size === 'small' && '소형'}
                              {booking.pet_size === 'medium' && '중형'}
                              {booking.pet_size === 'large' && '대형'}
                            </Text>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <Text size="sm">{formattedDate}</Text>
                            <Text size="xs" className="text-muted-foreground">
                              {booking.booking_time}
                            </Text>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Text className="font-medium">
                            ₩{booking.total_amount.toLocaleString()}
                          </Text>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(booking.status)}</td>
                        <td className="py-4 px-4">
                          <Link href={`/admin/bookings/${booking.id}`}>
                            <Button variant="outline" size="sm">
                              상세
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
