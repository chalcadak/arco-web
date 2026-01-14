import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Calendar, Package, Camera, ShoppingCart, TrendingUp, Users, Star, AlertCircle, MessageSquare, Bell } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '대시보드 - ARCO 관리자',
  description: 'ARCO 관리자 대시보드',
};

async function getDashboardStats() {
  const supabase = await createClient();

  // 오늘 날짜
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // 7일 전
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();

  // 오늘 주문 수 (orders 테이블이 없으면 0)
  const { count: todayOrdersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayISO)
    .or('status.eq.pending,status.eq.confirmed,status.eq.processing')
    .then(res => res)
    .catch(() => ({ count: 0 }));

  // 총 매출 (orders 테이블)
  const { data: ordersData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'completed')
    .then(res => res)
    .catch(() => ({ data: [] }));
  
  const totalRevenue = (ordersData || []).reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);

  // 최근 7일 매출
  const { data: recentOrdersData } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .gte('created_at', sevenDaysAgoISO)
    .eq('status', 'completed')
    .then(res => res)
    .catch(() => ({ data: [] }));

  // 신규 회원 (최근 7일)
  const { count: newUsersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgoISO)
    .then(res => res)
    .catch(() => ({ count: 0 }));

  // 평균 리뷰 점수
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('rating')
    .eq('is_approved', true);
  
  const avgRating = reviewsData && reviewsData.length > 0
    ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1)
    : '0.0';

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

  // 예약 수
  const { count: bookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });

  // 대기 중인 예약
  const { count: pendingBookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // 알림: 미답변 문의
  const { count: pendingInquiriesCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .then(res => res)
    .catch(() => ({ count: 0 }));

  // 알림: 미승인 리뷰
  const { count: pendingReviewsCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', false);

  // 알림: 품절 상품
  const { count: outOfStockCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('stock_quantity', 0)
    .eq('is_active', true);

  // 최근 예약 (5개)
  const { data: recentBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      photoshoot_look:photoshoot_looks(name)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  // 최근 주문 (10개)
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
    .then(res => res)
    .catch(() => ({ data: [] }));

  return {
    todayOrdersCount: todayOrdersCount || 0,
    totalRevenue,
    newUsersCount: newUsersCount || 0,
    avgRating,
    productsCount: productsCount || 0,
    photoshootsCount: photoshootsCount || 0,
    bookingsCount: bookingsCount || 0,
    pendingBookingsCount: pendingBookingsCount || 0,
    pendingInquiriesCount: pendingInquiriesCount || 0,
    pendingReviewsCount: pendingReviewsCount || 0,
    outOfStockCount: outOfStockCount || 0,
    recentBookings: recentBookings || [],
    recentOrders: recentOrders || [],
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: '오늘 주문',
      value: stats.todayOrdersCount,
      icon: ShoppingCart,
      description: '오늘 접수된 주문',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: '총 매출',
      value: `${(stats.totalRevenue / 10000).toFixed(0)}만원`,
      icon: TrendingUp,
      description: '누적 매출액',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '신규 회원',
      value: stats.newUsersCount,
      icon: Users,
      description: '최근 7일',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '평균 리뷰',
      value: `${stats.avgRating}점`,
      icon: Star,
      description: '고객 만족도',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const inventoryCards = [
    {
      title: '상품',
      value: stats.productsCount,
      icon: Package,
      description: '활성화된 상품',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
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

  const hasAlerts = stats.pendingInquiriesCount > 0 || stats.pendingReviewsCount > 0 || stats.outOfStockCount > 0;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <Heading level={1}>대시보드</Heading>
        <Text className="text-muted-foreground mt-2">
          ARCO 관리자 대시보드에 오신 것을 환영합니다
        </Text>
      </div>

      {/* Alerts/Notifications */}
      {hasAlerts && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.pendingInquiriesCount > 0 && (
            <Link href="/admin/inquiries">
              <Card className="border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  <div>
                    <Text className="font-semibold text-orange-900">미답변 문의</Text>
                    <Text size="sm" className="text-orange-700">{stats.pendingInquiriesCount}건</Text>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          {stats.pendingReviewsCount > 0 && (
            <Link href="/admin/reviews">
              <Card className="border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Star className="h-5 w-5 text-blue-600" />
                  <div>
                    <Text className="font-semibold text-blue-900">미승인 리뷰</Text>
                    <Text size="sm" className="text-blue-700">{stats.pendingReviewsCount}건</Text>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          {stats.outOfStockCount > 0 && (
            <Link href="/admin/products">
              <Card className="border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <Text className="font-semibold text-red-900">품절 상품</Text>
                    <Text size="sm" className="text-red-700">{stats.outOfStockCount}개</Text>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* Stats cards */}
      <div>
        <Heading level={3} className="mb-4">주요 지표</Heading>
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
      </div>

      {/* Inventory cards */}
      <div>
        <Heading level={3} className="mb-4">재고 현황</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inventoryCards.map((stat) => (
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
      </div>

      {/* Recent orders & bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>최근 주문</CardTitle>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">
              전체 보기
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <Text size="sm" className="text-muted-foreground text-center py-8">
                주문이 없습니다
              </Text>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <Text className="font-medium text-sm">{order.customer_name || '고객'}</Text>
                      <Text size="xs" className="text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('ko-KR')}
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text className="font-semibold text-sm">{order.total_amount?.toLocaleString()}원</Text>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'pending' && '결제완료'}
                        {order.status === 'processing' && '상품준비중'}
                        {order.status === 'shipped' && '배송중'}
                        {order.status === 'delivered' && '배송완료'}
                        {order.status === 'completed' && '구매확정'}
                        {!['pending', 'processing', 'shipped', 'delivered', 'completed'].includes(order.status) && order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>최근 예약</CardTitle>
            <Link href="/admin/bookings" className="text-sm text-primary hover:underline">
              전체 보기
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentBookings.length === 0 ? (
              <Text size="sm" className="text-muted-foreground text-center py-8">
                예약이 없습니다
              </Text>
            ) : (
              <div className="space-y-3">
                {stats.recentBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <Text className="font-medium text-sm">{booking.customer_name}</Text>
                      <Text size="xs" className="text-muted-foreground">
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
    </div>
  );
}
