'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: any;
  shipping_address: any;
}

export default function OrdersListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/admin/login?redirect=/my-page/orders');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      pending: { label: '처리 중', variant: 'secondary' },
      confirmed: { label: '확인됨', variant: 'default' },
      shipped: { label: '배송 중', variant: 'default' },
      delivered: { label: '배송 완료', variant: 'default' },
      cancelled: { label: '취소됨', variant: 'destructive' },
    };

    const config = statusMap[status] || { label: status, variant: 'outline' };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/my-page">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            마이페이지
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">주문 내역</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          전체 ({orders.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          처리 중 ({orders.filter((o) => o.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'shipped' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('shipped')}
        >
          배송 중 ({orders.filter((o) => o.status === 'shipped').length})
        </Button>
        <Button
          variant={filter === 'delivered' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('delivered')}
        >
          배송 완료 ({orders.filter((o) => o.status === 'delivered').length})
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">
                {filter === 'all'
                  ? '주문 내역이 없습니다.'
                  : '해당 상태의 주문이 없습니다.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Link key={order.id} href={`/my-page/orders/${order.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          주문 #{order.id.slice(0, 8)}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {order.total_amount?.toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && Array.isArray(order.items) && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground">
                        {order.items[0]?.name || '상품'}
                        {order.items.length > 1 &&
                          ` 외 ${order.items.length - 1}건`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
