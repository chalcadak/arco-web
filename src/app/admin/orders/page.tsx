'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

interface Order {
  id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  total_amount: number;
  status: string;
  tracking_number?: string;
  shipping_company?: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  completed_at?: string;
}

const STATUS_CONFIG = {
  pending: { label: '결제완료', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  processing: { label: '상품준비중', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: '배송중', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: '배송완료', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  completed: { label: '구매확정', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: '취소', color: 'bg-red-100 text-red-800', icon: XCircle },
  refunded: { label: '환불', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function AdminOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setOrders(data);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string, trackingInfo?: { tracking_number: string; shipping_company: string }) => {
    const updates: any = {
      status: newStatus,
    };

    // Add timestamp based on status
    if (newStatus === 'shipped') {
      updates.shipped_at = new Date().toISOString();
      if (trackingInfo) {
        updates.tracking_number = trackingInfo.tracking_number;
        updates.shipping_company = trackingInfo.shipping_company;
      }
    } else if (newStatus === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    } else if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (!error) {
      loadOrders();
      setSelectedOrder(null);
      alert('주문 상태가 변경되었습니다.');
    } else {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Heading level={2}>주문 관리</Heading>
          <Text className="text-muted-foreground mt-1">
            고객 주문을 확인하고 배송 상태를 관리합니다.
          </Text>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            전체
          </Button>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <Button
              key={key}
              variant={statusFilter === key ? 'default' : 'outline'}
              onClick={() => setStatusFilter(key)}
            >
              {config.label}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">로딩 중...</div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Text className="text-muted-foreground">주문이 없습니다.</Text>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <StatusIcon className="h-5 w-5 text-muted-foreground" />
                          <Heading level={3}>{order.customer_name || '고객'}</Heading>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <Text className="text-muted-foreground text-xs">주문 금액</Text>
                            <Text className="font-semibold text-lg">{order.total_amount.toLocaleString()}원</Text>
                          </div>
                          <div>
                            <Text className="text-muted-foreground text-xs">주문 일시</Text>
                            <Text className="font-semibold">{formatDate(order.created_at)}</Text>
                          </div>
                          {order.tracking_number && (
                            <div>
                              <Text className="text-muted-foreground text-xs">송장번호</Text>
                              <Text className="font-semibold">{order.shipping_company} {order.tracking_number}</Text>
                            </div>
                          )}
                        </div>

                        {order.customer_email && (
                          <Text size="sm" className="text-muted-foreground">
                            {order.customer_email} {order.customer_phone && `| ${order.customer_phone}`}
                          </Text>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          상태 변경
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Status Change Modal */}
        {selectedOrder && (
          <StatusChangeModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onSave={handleStatusChange}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function StatusChangeModal({
  order,
  onClose,
  onSave,
}: {
  order: Order;
  onClose: () => void;
  onSave: (orderId: string, status: string, trackingInfo?: { tracking_number: string; shipping_company: string }) => void;
}) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [shippingCompany, setShippingCompany] = useState(order.shipping_company || 'CJ대한통운');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newStatus === 'shipped' && !trackingNumber) {
      alert('배송중으로 변경 시 송장번호를 입력해주세요.');
      return;
    }

    const trackingInfo = newStatus === 'shipped' ? { tracking_number: trackingNumber, shipping_company: shippingCompany } : undefined;
    onSave(order.id, newStatus, trackingInfo);
  };

  const shippingCompanies = [
    'CJ대한통운',
    '우체국택배',
    '한진택배',
    'GS25택배',
    '롯데택배',
    '로젠택배',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <Heading level={3} className="mb-4">
            주문 상태 변경
          </Heading>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">주문 상태</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">결제완료</option>
                <option value="processing">상품준비중</option>
                <option value="shipped">배송중</option>
                <option value="delivered">배송완료</option>
                <option value="completed">구매확정</option>
                <option value="cancelled">취소</option>
                <option value="refunded">환불</option>
              </select>
            </div>

            {newStatus === 'shipped' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">택배사</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={shippingCompany}
                    onChange={(e) => setShippingCompany(e.target.value)}
                  >
                    {shippingCompanies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">송장번호</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="1234567890"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                변경
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
