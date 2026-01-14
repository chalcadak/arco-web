import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Calendar, Package, Camera, ShoppingCart, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: '대시보드 - ARCO 관리자',
  description: 'ARCO 관리자 대시보드',
};

async function getDashboardStats() {
  const supabase = await createClient();

  // 예약 수
  const { count: bookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });

  // 상품 수
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // 촬영룩 수
  const { count: photoshootsCount } = await supabase
    .from('photoshoot_looks')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // 대기 중인 예약
  const { count: pendingBookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // 최근 예약 (5개)
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      photoshoot_look:photoshoot_looks(name)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    bookingsCount: bookingsCount || 0,
    productsCount: productsCount || 0,
    photoshootsCount: photoshootsCount || 0,
    pendingBookingsCount: pendingBookingsCount || 0,
    recentBookings: recentBookings || [],
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: '상품',
      value: stats.productsCount,
      icon: Package,
      description: '활성화된 상품',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '주문',
      value: 0,
      icon: ShoppingCart,
      description: '준비 중',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: '촬영룩',
      value: stats.photoshootsCount,
      icon: Camera,
      description: '활성화된 촬영룩',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '총 예약',
      value: stats.bookingsCount,
      icon: Calendar,
      description: `대기 중: ${stats.pendingBookingsCount}건`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <Heading level={1}>대시보드</Heading>
        <Text className="text-muted-foreground mt-2">
          ARCO 관리자 대시보드에 오신 것을 환영합니다
        </Text>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <Heading level={2} className="text-3xl">{stat.value}</Heading>
              <Text size="xs" className="text-muted-foreground mt-1">
                {stat.description}
              </Text>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent bookings */}
      <Card>
        <CardHeader>
          <CardTitle>최근 예약</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentBookings.length === 0 ? (
            <Text size="sm" className="text-muted-foreground text-center py-8">
              예약이 없습니다
            </Text>
          ) : (
            <div className="space-y-4">
              {stats.recentBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="space-y-1">
                    <Text className="font-medium">{booking.customer_name}</Text>
                    <Text size="sm" className="text-muted-foreground">
                      {booking.photoshoot_look?.name}
                    </Text>
                    <Text size="xs" className="text-muted-foreground">
                      {booking.booking_date} {booking.booking_time}
                    </Text>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status === 'pending' && '대기'}
                      {booking.status === 'confirmed' && '확정'}
                      {booking.status === 'completed' && '완료'}
                      {booking.status === 'cancelled' && '취소'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
