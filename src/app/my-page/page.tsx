import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, User, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: '마이페이지 - ARCO',
  description: '주문 내역, 예약 내역, 회원 정보 관리',
};

async function getUserOrders(userId: string) {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  return orders || [];
}

async function getUserBookings(userEmail: string) {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, photoshoot_look:photoshoot_looks(name)')
    .eq('customer_email', userEmail)
    .order('created_at', { ascending: false })
    .limit(5);

  return bookings || [];
}

export default async function MyPageMain() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login?redirect=/my-page');
  }

  const orders = await getUserOrders(user.id);
  const bookings = await getUserBookings(user.email || '');

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
        <p className="text-muted-foreground">
          안녕하세요, <span className="font-semibold">{user.email}</span>님
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 주문</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">배송 중</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">배송 완료</p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
              <Package className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">예약</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>최근 주문</CardTitle>
                <Link href="/my-page/orders">
                  <Button variant="ghost" size="sm">
                    전체 보기
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  주문 내역이 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/my-page/orders/${order.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              주문 #{order.id.slice(0, 8)}
                            </span>
                            <Badge
                              variant={
                                order.status === 'delivered'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {order.status === 'pending' && '처리 중'}
                              {order.status === 'confirmed' && '확인됨'}
                              {order.status === 'shipped' && '배송 중'}
                              {order.status === 'delivered' && '배송 완료'}
                              {order.status === 'cancelled' && '취소됨'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString(
                              'ko-KR'
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {order.total_amount?.toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>최근 예약</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  예약 내역이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-3 border rounded-lg text-sm"
                    >
                      <p className="font-semibold mb-1">
                        {booking.photoshoot_look?.name}
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(booking.booking_date).toLocaleDateString(
                          'ko-KR'
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Menu */}
          <Card>
            <CardHeader>
              <CardTitle>계정 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/my-page/orders">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  주문 내역
                </Button>
              </Link>
              <Link href="/my-page/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  회원 정보 수정
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button variant="outline" className="w-full justify-start">
                  ❤️ 찜한 상품
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
