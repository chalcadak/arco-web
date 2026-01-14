import { Metadata } from 'next';
import { getDashboardStats } from '@/lib/analytics/dashboard';
import { getRecommendations } from '@/lib/analytics/recommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Calendar, Package, Camera, ShoppingCart, TrendingUp, Users, Star, AlertCircle, MessageSquare, Clock, CalendarDays, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { GrowthIndicator } from '@/components/admin/GrowthIndicator';
import { BestSellersTable } from '@/components/admin/BestSellersTable';
import { HourlyHeatmap } from '@/components/admin/charts/HourlyHeatmap';
import { DailyOrdersChart } from '@/components/admin/charts/DailyOrdersChart';
import { RecommendationList } from '@/components/admin/RecommendationCard';

export const metadata: Metadata = {
  title: '대시보드 - ARCO 관리자',
  description: 'ARCO 관리자 대시보드',
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const recommendations = await getRecommendations();

  // 기존 getDashboardStats 함수는 src/lib/analytics/dashboard.ts로 이동했습니다.
  // 이제 더 많은 데이터를 포함합니다:
  // - 전일/전주/전월 대비 증감률
  // - 베스트셀러 TOP 10
  // - 시간대별/요일별 주문 분포
  // - 재구매율, 활성 고객 수 등
  //
  // 🆕 AI 추천 액션 시스템 추가:
  // - 데이터 기반 즉시 실행 가능한 액션 추천
  // - 재고 부족, 프로모션, 고객 리텐션 등



  const statCards = [
    {
      title: '오늘 주문',
      value: stats.todayOrders,
      growth: stats.ordersGrowth,
      icon: ShoppingCart,
      description: '전일 대비',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: '오늘 매출',
      value: `${(stats.todayRevenue / 10000).toFixed(0)}만원`,
      growth: stats.revenueGrowth,
      icon: TrendingUp,
      description: '전일 대비',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '활성 고객',
      value: stats.activeCustomers,
      icon: Users,
      description: '최근 30일 구매',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '재구매율',
      value: `${stats.repeatCustomerRate.toFixed(1)}%`,
      icon: Star,
      description: '2회 이상 구매 고객',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const hasAlerts = stats.pendingInquiries > 0 || stats.pendingReviews > 0 || stats.outOfStockCount > 0;

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
          {stats.pendingInquiries > 0 && (
            <Link href="/admin/inquiries">
              <Card className="border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  <div>
                    <Text className="font-semibold text-orange-900">미답변 문의</Text>
                    <Text size="sm" className="text-orange-700">{stats.pendingInquiries}건</Text>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          {stats.pendingReviews > 0 && (
            <Link href="/admin/reviews">
              <Card className="border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Star className="h-5 w-5 text-blue-600" />
                  <div>
                    <Text className="font-semibold text-blue-900">미승인 리뷰</Text>
                    <Text size="sm" className="text-blue-700">{stats.pendingReviews}건</Text>
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

      {/* Stats cards with Growth Indicators */}
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
                <div className="flex items-end justify-between">
                  <Heading level={2} className="text-3xl">{stat.value}</Heading>
                  {stat.growth !== undefined && (
                    <GrowthIndicator value={stat.growth} size="sm" />
                  )}
                </div>
                <Text size="xs" className="text-muted-foreground mt-1">
                  {stat.description}
                </Text>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 시간/요일 분석 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간대별 주문 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <CardTitle>시간대별 주문 분포</CardTitle>
            </div>
            <Text size="sm" className="text-muted-foreground">최근 30일</Text>
          </CardHeader>
          <CardContent>
            <HourlyHeatmap data={stats.hourlyOrders} />
          </CardContent>
        </Card>

        {/* 요일별 패턴 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-green-600" />
              <CardTitle>요일별 주문 패턴</CardTitle>
            </div>
            <Text size="sm" className="text-muted-foreground">최근 30일</Text>
          </CardHeader>
          <CardContent>
            <DailyOrdersChart data={stats.dailyOrders} />
          </CardContent>
        </Card>
      </div>

      {/* 베스트셀러 */}
      <BestSellersTable products={stats.topProducts} limit={10} />

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

      {/* 🆕 AI 추천 액션 시스템 */}
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <CardTitle>💡 AI 추천: 즉시 실행 가능한 액션</CardTitle>
            </div>
            <Text size="sm" className="text-muted-foreground">
              데이터 기반 매출 증대 방법
            </Text>
          </CardHeader>
          <CardContent>
            <RecommendationList 
              recommendations={recommendations}
              onExecuteAction={async (action) => {
                'use server';
                // TODO: 실제 API 호출 구현
                console.log('Executing action:', action);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
