'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import type { Coupon } from '@/types/coupon';

export default function AdminCouponsPage() {
  const supabase = createClientComponentClient();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCoupons(data);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 쿠폰을 삭제하시겠습니까?')) return;

    const { error } = await supabase.from('coupons').delete().eq('id', id);

    if (!error) {
      loadCoupons();
      alert('쿠폰이 삭제되었습니다.');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('쿠폰 코드가 복사되었습니다.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}%`;
    }
    return `${coupon.discount_value.toLocaleString()}원`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Heading level={2}>쿠폰 관리</Heading>
            <Text className="text-muted-foreground mt-1">
              할인 쿠폰을 생성하고 관리합니다.
            </Text>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            쿠폰 추가
          </Button>
        </div>

        {/* Coupon Form Modal */}
        {showForm && (
          <CouponForm
            coupon={editingCoupon}
            onClose={() => {
              setShowForm(false);
              setEditingCoupon(null);
            }}
            onSave={() => {
              loadCoupons();
              setShowForm(false);
              setEditingCoupon(null);
            }}
          />
        )}

        {/* Coupons List */}
        {isLoading ? (
          <div className="text-center py-12">로딩 중...</div>
        ) : coupons.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Text className="text-muted-foreground">
                등록된 쿠폰이 없습니다.
              </Text>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <Card key={coupon.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Heading level={3}>{coupon.name}</Heading>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-sm font-mono font-semibold flex items-center gap-1"
                        >
                          {coupon.code}
                          <Copy className="h-3 w-3" />
                        </button>
                        {!coupon.is_active && (
                          <span className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs rounded">
                            비활성
                          </span>
                        )}
                      </div>
                      
                      {coupon.description && (
                        <Text className="text-muted-foreground mb-3">
                          {coupon.description}
                        </Text>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <Text className="text-muted-foreground text-xs">할인</Text>
                          <Text className="font-semibold text-primary">
                            {getDiscountDisplay(coupon)}
                          </Text>
                        </div>
                        <div>
                          <Text className="text-muted-foreground text-xs">최소 금액</Text>
                          <Text className="font-semibold">
                            {coupon.min_order_amount.toLocaleString()}원
                          </Text>
                        </div>
                        <div>
                          <Text className="text-muted-foreground text-xs">사용 횟수</Text>
                          <Text className="font-semibold">
                            {coupon.used_count}
                            {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                          </Text>
                        </div>
                        <div>
                          <Text className="text-muted-foreground text-xs">유효 기간</Text>
                          <Text className="font-semibold">
                            {formatDate(coupon.valid_from)}
                            {coupon.valid_until && ` ~ ${formatDate(coupon.valid_until)}`}
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function CouponForm({
  coupon,
  onClose,
  onSave,
}: {
  coupon: Coupon | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    name: coupon?.name || '',
    description: coupon?.description || '',
    discount_type: coupon?.discount_type || 'percentage',
    discount_value: coupon?.discount_value || 0,
    min_order_amount: coupon?.min_order_amount || 0,
    max_discount_amount: coupon?.max_discount_amount || undefined,
    usage_limit: coupon?.usage_limit || undefined,
    valid_from: coupon?.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    valid_until: coupon?.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : '',
    is_active: coupon?.is_active ?? true,
    applicable_to: coupon?.applicable_to || 'all',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      valid_until: formData.valid_until || null,
    };

    let error;
    if (coupon) {
      ({ error } = await supabase
        .from('coupons')
        .update(payload)
        .eq('id', coupon.id));
    } else {
      ({ error } = await supabase.from('coupons').insert([payload]));
    }

    setIsLoading(false);

    if (!error) {
      alert(coupon ? '쿠폰이 수정되었습니다.' : '쿠폰이 생성되었습니다.');
      onSave();
    } else {
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <Heading level={3} className="mb-4">
            {coupon ? '쿠폰 수정' : '쿠폰 추가'}
          </Heading>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">쿠폰 코드</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="WELCOME2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">쿠폰 이름</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="신규 회원 환영 쿠폰"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">설명</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="쿠폰 설명"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">할인 타입</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                >
                  <option value="percentage">퍼센트 (%)</option>
                  <option value="fixed">정액 (원)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">할인 값</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                  placeholder={formData.discount_type === 'percentage' ? '10' : '5000'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">최소 주문 금액</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">최대 할인 금액 (선택)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.max_discount_amount || ''}
                  onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="제한 없음"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">시작일</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">종료일 (선택)</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">사용 횟수 제한 (선택)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.usage_limit || ''}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="제한 없음"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">적용 대상</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.applicable_to}
                  onChange={(e) => setFormData({ ...formData, applicable_to: e.target.value as any })}
                >
                  <option value="all">전체</option>
                  <option value="products">상품만</option>
                  <option value="photoshoots">촬영룩만</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label htmlFor="is_active" className="text-sm font-medium">활성화</label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? '저장 중...' : '저장'}
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
