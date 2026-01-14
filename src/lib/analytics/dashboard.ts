// src/lib/analytics/dashboard.ts
import { createClient } from '@/lib/supabase/server';

export interface DashboardStats {
  // 매출 관련
  todayRevenue: number;
  yesterdayRevenue: number;
  revenueGrowth: number; // 전일 대비 증감률 (%)
  
  thisWeekRevenue: number;
  lastWeekRevenue: number;
  weeklyGrowth: number;
  
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  monthlyGrowth: number;
  
  // 주문 관련
  todayOrders: number;
  yesterdayOrders: number;
  ordersGrowth: number;
  
  // 고객 관련
  newCustomers: number; // 최근 7일
  activeCustomers: number; // 최근 30일
  repeatCustomerRate: number; // 재구매율
  
  // 상품 관련
  topProducts: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  
  lowStockProducts: {
    id: string;
    name: string;
    stock: number;
  }[];
  
  // 시간대별 분석
  hourlyOrders: {
    hour: number;
    count: number;
  }[];
  
  // 요일별 분석
  dailyOrders: {
    day: string;
    count: number;
    revenue: number;
  }[];
  
  // 알림
  pendingInquiries: number;
  pendingReviews: number;
  outOfStockCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  
  // 날짜 계산
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay()); // 일요일
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
  
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 7);
  
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);
  
  // 매출 데이터 가져오기
  const { data: allOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_status', 'completed')
    .order('created_at', { ascending: false });
  
  const orders = allOrders || [];
  
  // 오늘 매출
  const todayOrders = orders.filter(o => 
    new Date(o.created_at) >= today
  );
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  
  // 어제 매출
  const yesterdayOrders = orders.filter(o => {
    const date = new Date(o.created_at);
    return date >= yesterday && date < today;
  });
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  
  // 이번 주 매출
  const thisWeekOrders = orders.filter(o => 
    new Date(o.created_at) >= thisWeekStart
  );
  const thisWeekRevenue = thisWeekOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  
  // 지난주 매출
  const lastWeekOrders = orders.filter(o => {
    const date = new Date(o.created_at);
    return date >= lastWeekStart && date <= lastWeekEnd;
  });
  const lastWeekRevenue = lastWeekOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  
  // 이번 달 매출
  const thisMonthOrders = orders.filter(o => 
    new Date(o.created_at) >= thisMonthStart
  );
  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  
  // 지난달 매출
  const lastMonthOrders = orders.filter(o => {
    const date = new Date(o.created_at);
    return date >= lastMonthStart && date <= lastMonthEnd;
  });
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  
  // 증감률 계산
  const revenueGrowth = yesterdayRevenue > 0 
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
    : 0;
  const weeklyGrowth = lastWeekRevenue > 0 
    ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 
    : 0;
  const monthlyGrowth = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;
  
  const ordersGrowth = yesterdayOrders.length > 0
    ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100
    : 0;
  
  // 신규 고객 (최근 7일)
  const { count: newCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', last7Days.toISOString());
  
  // 활성 고객 (최근 30일 내 주문)
  const { data: activeCustomerIds } = await supabase
    .from('orders')
    .select('user_id')
    .gte('created_at', last30Days.toISOString())
    .not('user_id', 'is', null);
  
  const activeCustomers = new Set(activeCustomerIds?.map(o => o.user_id) || []).size;
  
  // 재구매율
  const { data: allCustomerOrders } = await supabase
    .from('orders')
    .select('user_id')
    .not('user_id', 'is', null);
  
  const customerOrderCounts = (allCustomerOrders || []).reduce((acc: Record<string, number>, order) => {
    if (order.user_id) {
      acc[order.user_id] = (acc[order.user_id] || 0) + 1;
    }
    return acc;
  }, {});
  
  const totalCustomers = Object.keys(customerOrderCounts).length;
  const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
  const repeatCustomerRate = totalCustomers > 0 
    ? (repeatCustomers / totalCustomers) * 100 
    : 0;
  
  // 베스트셀러 TOP 10
  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
  
  orders.forEach(order => {
    try {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          const productId = item.product_id || item.productId;
          const name = item.name || item.productName || '알 수 없음';
          const quantity = item.quantity || 1;
          const price = item.price || 0;
          
          if (!productSales[productId]) {
            productSales[productId] = { name, sales: 0, revenue: 0 };
          }
          productSales[productId].sales += quantity;
          productSales[productId].revenue += price * quantity;
        });
      }
    } catch (e) {
      // JSON 파싱 에러 무시
    }
  });
  
  const topProducts = Object.entries(productSales)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);
  
  // 재고 부족 상품
  const { data: lowStockProducts } = await supabase
    .from('products')
    .select('id, name, stock_quantity')
    .lte('stock_quantity', 10)
    .eq('is_active', true)
    .order('stock_quantity', { ascending: true })
    .limit(5);
  
  // 시간대별 주문 분포 (최근 30일)
  const recent30DaysOrders = orders.filter(o => 
    new Date(o.created_at) >= last30Days
  );
  
  const hourlyOrderCounts = Array(24).fill(0);
  recent30DaysOrders.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    hourlyOrderCounts[hour]++;
  });
  
  const hourlyOrders = hourlyOrderCounts.map((count, hour) => ({ hour, count }));
  
  // 요일별 주문 분포 (최근 30일)
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dailyStats: Record<string, { count: number; revenue: number }> = {};
  
  dayNames.forEach(day => {
    dailyStats[day] = { count: 0, revenue: 0 };
  });
  
  recent30DaysOrders.forEach(order => {
    const day = dayNames[new Date(order.created_at).getDay()];
    dailyStats[day].count++;
    dailyStats[day].revenue += order.total_amount || 0;
  });
  
  const dailyOrders = Object.entries(dailyStats).map(([day, data]) => ({
    day,
    ...data
  }));
  
  // 알림 카운트
  const { count: pendingInquiries } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  
  const { count: pendingReviews } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', false);
  
  const { count: outOfStockCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('stock_quantity', 0)
    .eq('is_active', true);
  
  return {
    todayRevenue,
    yesterdayRevenue,
    revenueGrowth,
    thisWeekRevenue,
    lastWeekRevenue,
    weeklyGrowth,
    thisMonthRevenue,
    lastMonthRevenue,
    monthlyGrowth,
    todayOrders: todayOrders.length,
    yesterdayOrders: yesterdayOrders.length,
    ordersGrowth,
    newCustomers: newCustomers || 0,
    activeCustomers,
    repeatCustomerRate,
    topProducts,
    lowStockProducts: (lowStockProducts || []).map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock_quantity
    })),
    hourlyOrders,
    dailyOrders,
    pendingInquiries: pendingInquiries || 0,
    pendingReviews: pendingReviews || 0,
    outOfStockCount: outOfStockCount || 0,
  };
}
