import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: '재입고 알림 관리 - ARCO 관리자',
  description: '고객 재입고 알림 요청 관리',
};

async function getStockNotifications() {
  const supabase = await createClient();

  const { data: notifications, error } = await supabase
    .from('stock_notifications')
    .select(`
      *,
      product:products(id, name, slug, stock_quantity)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return notifications || [];
}

export default async function AdminStockNotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const notifications = await getStockNotifications();

  // Group by product
  const groupedNotifications = notifications.reduce((acc: any, notification) => {
    const productId = notification.product_id;
    if (!acc[productId]) {
      acc[productId] = {
        product: notification.product,
        notifications: [],
      };
    }
    acc[productId].notifications.push(notification);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">재입고 알림 관리</h1>
        <p className="text-muted-foreground mt-2">
          고객의 재입고 알림 요청을 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 알림</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">미발송</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => !n.is_notified).length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">발송 완료</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.is_notified).length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {Object.keys(groupedNotifications).length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">
                재입고 알림 요청이 없습니다.
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.values(groupedNotifications).map((group: any) => (
            <Card key={group.product.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Product Info */}
                  <div className="flex items-start justify-between pb-4 border-b">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {group.product.name}
                        </h3>
                        {group.product.stock_quantity === 0 ? (
                          <Badge variant="destructive">품절</Badge>
                        ) : (
                          <Badge variant="default">재고 있음</Badge>
                        )}
                      </div>
                      <Link
                        href={`/products/${group.product.slug}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        상품 페이지 보기 →
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">알림 요청</p>
                      <p className="text-2xl font-bold">
                        {group.notifications.length}명
                      </p>
                    </div>
                  </div>

                  {/* Notification Requests */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      알림 신청 고객 목록
                    </h4>
                    {group.notifications.map((notification: any) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {notification.customer_name || '이름 없음'}
                          </p>
                          <p className="text-muted-foreground">
                            {notification.customer_email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              notification.created_at
                            ).toLocaleDateString('ko-KR')}
                          </p>
                          {notification.is_notified && (
                            <Badge variant="default" className="mt-1">
                              발송 완료
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-600">
                    💡 재입고 시 이메일 발송 기능은 추후 구현됩니다.
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
