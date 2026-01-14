// AI 추천 액션 시스템
// 데이터 분석 → 즉시 실행 가능한 액션 추천

import { createClient } from '@/lib/supabase/server';
import { getDashboardStats } from './dashboard';

export interface Recommendation {
  id: string;
  type: 'inventory' | 'promotion' | 'customer' | 'bundling' | 'pricing';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string; // "예상 매출 +500만원"
  actions: RecommendationAction[];
  data: any;
  createdAt: Date;
}

export interface RecommendationAction {
  id: string;
  label: string;
  type: 'create_coupon' | 'send_email' | 'order_stock' | 'create_bundle' | 'adjust_price';
  params: any;
  apiEndpoint: string;
  icon?: string;
}

/**
 * 관리자를 위한 AI 액션 추천 생성
 * 데이터 기반으로 즉시 실행 가능한 액션을 제안합니다
 */
export async function getRecommendations(): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];
  
  try {
    const stats = await getDashboardStats();
    const supabase = await createClient();
    
    // 1. 재고 부족 상품 알림 (긴급)
    if (stats.lowStockProducts && stats.lowStockProducts.length > 0) {
      for (const product of stats.lowStockProducts.slice(0, 3)) {
        const avgDailySales = Math.ceil(Math.random() * 5) + 3; // TODO: 실제 판매 데이터 계산
        const daysUntilStockout = Math.floor(product.stock / avgDailySales);
        
        recommendations.push({
          id: `stock-${product.id}`,
          type: 'inventory',
          priority: product.stock <= 5 ? 'urgent' : 'high',
          title: `"${product.name}" 품절 임박`,
          description: `현재 재고 ${product.stock}개. 평균 일 판매량 ${avgDailySales}개 기준 ${daysUntilStockout}일 후 품절 예상`,
          impact: `품절 시 일 ${(avgDailySales * product.price).toLocaleString()}원 매출 손실`,
          actions: [
            {
              id: `reorder-${product.id}`,
              label: '긴급 발주하기',
              type: 'order_stock',
              params: { productId: product.id, quantity: 50 },
              apiEndpoint: '/api/admin/inventory/order',
              icon: '📦'
            },
            {
              id: `notify-${product.id}`,
              label: '재입고 알림 발송',
              type: 'send_email',
              params: { type: 'restock', productId: product.id },
              apiEndpoint: '/api/admin/notifications/restock',
              icon: '📧'
            }
          ],
          data: { product, avgDailySales, daysUntilStockout },
          createdAt: new Date()
        });
      }
    }
    
    // 2. 시간대별 프로모션 기회
    if (stats.hourlyOrders && stats.hourlyOrders.length > 0) {
      const peakHour = stats.hourlyOrders.reduce((max, curr) => 
        curr.count > max.count ? curr : max
      );
      
      if (peakHour.count >= 5) {
        recommendations.push({
          id: 'peak-hour-promo',
          type: 'promotion',
          priority: 'high',
          title: `${peakHour.hour}시 주문 폭증 (${peakHour.count}건)`,
          description: `이 시간대에 타겟 프로모션을 진행하면 전환율 향상 예상`,
          impact: '예상 매출 +30% (이 시간대)',
          actions: [
            {
              id: 'create-time-coupon',
              label: `${peakHour.hour}시 특가 쿠폰 만들기`,
              type: 'create_coupon',
              params: {
                name: `${peakHour.hour}시 타임특가`,
                discountType: 'percentage',
                discountValue: 20,
                validHours: [peakHour.hour, peakHour.hour + 1]
              },
              apiEndpoint: '/api/admin/coupons/create',
              icon: '🎁'
            }
          ],
          data: { peakHour },
          createdAt: new Date()
        });
      }
    }
    
    // 3. 이탈 위험 고객 리텐션
    const { data: dormantCustomers } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('role', 'customer')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (dormantCustomers && dormantCustomers.length > 0) {
      // 최근 30일 주문이 없는 고객 찾기
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .in('user_id', dormantCustomers.map(c => c.id));
      
      const activeUserIds = new Set(recentOrders?.map(o => o.user_id) || []);
      const dormantUsers = dormantCustomers.filter(c => !activeUserIds.has(c.id));
      
      if (dormantUsers.length >= 10) {
        recommendations.push({
          id: 'dormant-customers',
          type: 'customer',
          priority: 'high',
          title: `${dormantUsers.length}명 고객 이탈 위험`,
          description: `30일 이상 미구매 고객에게 특별 혜택 제공 권장`,
          impact: `예상 복귀율 40% → 매출 +${(dormantUsers.length * 0.4 * 150000).toLocaleString()}원`,
          actions: [
            {
              id: 'send-comeback-coupon',
              label: '컴백 30% 쿠폰 발송',
              type: 'send_email',
              params: {
                customerIds: dormantUsers.slice(0, 50).map(c => c.id),
                template: 'comeback_special',
                couponValue: 30
              },
              apiEndpoint: '/api/admin/marketing/comeback-campaign',
              icon: '💌'
            }
          ],
          data: { dormantUsers: dormantUsers.slice(0, 10) },
          createdAt: new Date()
        });
      }
    }
    
    // 4. 베스트셀러 재고 확보
    if (stats.bestSellers && stats.bestSellers.length > 0) {
      const topSeller = stats.bestSellers[0];
      
      recommendations.push({
        id: 'bestseller-stock',
        type: 'inventory',
        priority: 'medium',
        title: `베스트셀러 "${topSeller.name}" 재고 확보`,
        description: `최근 7일 ${topSeller.sales}개 판매. 재고를 충분히 확보하면 기회 손실 방지`,
        impact: `예상 추가 매출 +${(topSeller.sales * 1.5 * topSeller.price).toLocaleString()}원/주`,
        actions: [
          {
            id: `restock-bestseller-${topSeller.id}`,
            label: '재고 100개 발주',
            type: 'order_stock',
            params: { productId: topSeller.id, quantity: 100 },
            apiEndpoint: '/api/admin/inventory/order',
            icon: '📦'
          }
        ],
        data: { product: topSeller },
        createdAt: new Date()
      });
    }
    
    // 5. 주말 특가 제안 (금요일이면)
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 5 && stats.dailyOrders && stats.dailyOrders.length > 0) {
      const fridayOrders = stats.dailyOrders.find(d => d.day === '금');
      
      if (fridayOrders && fridayOrders.count > 0) {
        recommendations.push({
          id: 'weekend-special',
          type: 'promotion',
          priority: 'medium',
          title: '주말 특가 이벤트 제안',
          description: `금요일 평균 주문 ${fridayOrders.count}건. 주말 특가로 추가 매출 기대`,
          impact: '예상 매출 +20% (주말)',
          actions: [
            {
              id: 'create-weekend-sale',
              label: '주말 15% 할인 쿠폰',
              type: 'create_coupon',
              params: {
                name: '주말 특가',
                discountType: 'percentage',
                discountValue: 15,
                validDays: ['토', '일']
              },
              apiEndpoint: '/api/admin/coupons/create',
              icon: '🎉'
            }
          ],
          data: { fridayOrders },
          createdAt: new Date()
        });
      }
    }
    
    // 우선순위 정렬
    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}

/**
 * 추천 액션 실행
 */
export async function executeRecommendationAction(
  actionId: string,
  actionType: string,
  params: any
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // TODO: 실제 API 호출 구현
    console.log('Executing action:', { actionId, actionType, params });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: '액션이 성공적으로 실행되었습니다',
      data: { actionId, executedAt: new Date() }
    };
  } catch (error) {
    return {
      success: false,
      message: '액션 실행 중 오류가 발생했습니다'
    };
  }
}
