// 고객용 개인화 추천 시스템
// "넷플릭스처럼" 개인별 맞춤 상품 추천

import { createClient } from '@/lib/supabase/server';

export interface CustomerProfile {
  userId: string;
  name: string;
  email: string;
  petInfo?: {
    name: string;
    breed: string;
    size: 'small' | 'medium' | 'large';
  };
  purchaseHistory: Array<{
    productId: string;
    productName: string;
    category: string;
    price: number;
    purchasedAt: Date;
  }>;
  browsingHistory: Array<{
    productId: string;
    viewedAt: Date;
  }>;
  preferences: {
    favoriteCategories: string[];
    priceRange: [number, number];
  };
}

export interface RecommendationSection {
  id: string;
  title: string;
  subtitle?: string;
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
  }>;
  reason?: string;
  priority: number;
}

/**
 * 고객 프로필 가져오기
 */
export async function getCustomerProfile(userId: string): Promise<CustomerProfile | null> {
  const supabase = await createClient();
  
  try {
    // 사용자 정보
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single();
    
    if (!user) return null;
    
    // 구매 이력
    const { data: orders } = await supabase
      .from('orders')
      .select('items, created_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(20);
    
    const purchaseHistory = orders?.flatMap(order => {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      return items.map((item: any) => ({
        productId: item.product_id,
        productName: item.name,
        category: item.category || 'unknown',
        price: item.price,
        purchasedAt: new Date(order.created_at)
      }));
    }) || [];
    
    // 선호 카테고리 분석
    const categoryCount: Record<string, number> = {};
    purchaseHistory.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    
    const favoriteCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
    
    // 가격대 분석
    const prices = purchaseHistory.map(item => item.price).filter(p => p > 0);
    const avgPrice = prices.length > 0 
      ? prices.reduce((sum, p) => sum + p, 0) / prices.length 
      : 100000;
    
    const priceRange: [number, number] = [
      Math.floor(avgPrice * 0.7),
      Math.ceil(avgPrice * 1.3)
    ];
    
    return {
      userId: user.id,
      name: user.name || '고객',
      email: user.email,
      purchaseHistory,
      browsingHistory: [], // TODO: 추후 구현
      preferences: {
        favoriteCategories,
        priceRange
      }
    };
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return null;
  }
}

/**
 * 개인화 추천 피드 생성
 */
export async function getPersonalizedFeed(
  userId?: string
): Promise<RecommendationSection[]> {
  const supabase = await createClient();
  const sections: RecommendationSection[] = [];
  
  try {
    let profile: CustomerProfile | null = null;
    
    // 로그인 사용자면 프로필 가져오기
    if (userId) {
      profile = await getCustomerProfile(userId);
    }
    
    // 1. 신상품 (모든 사용자)
    const { data: newProducts } = await supabase
      .from('products')
      .select('id, name, slug, price, images, category, stock')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);
    
    if (newProducts && newProducts.length > 0) {
      sections.push({
        id: 'new-arrivals',
        title: '🆕 신상품',
        subtitle: '방금 출시된 따끈따끈한 신상',
        products: newProducts,
        priority: 1
      });
    }
    
    // 2. 베스트셀러 (모든 사용자)
    const { data: orderItems } = await supabase
      .from('orders')
      .select('items')
      .eq('status', 'completed')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    // 상품별 판매 횟수 집계
    const productSales: Record<string, number> = {};
    orderItems?.forEach(order => {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      items.forEach((item: any) => {
        productSales[item.product_id] = (productSales[item.product_id] || 0) + 1;
      });
    });
    
    const topProductIds = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([productId]) => productId);
    
    if (topProductIds.length > 0) {
      const { data: bestSellers } = await supabase
        .from('products')
        .select('id, name, slug, price, images, category, stock')
        .in('id', topProductIds)
        .eq('is_active', true);
      
      if (bestSellers && bestSellers.length > 0) {
        sections.push({
          id: 'best-sellers',
          title: '🔥 베스트셀러',
          subtitle: '가장 많은 분들이 선택한',
          products: bestSellers,
          priority: 2
        });
      }
    }
    
    // 3. 개인화 추천 (로그인 사용자만)
    if (profile && profile.purchaseHistory.length > 0) {
      // 최근 구매 상품과 같은 카테고리
      const recentCategory = profile.purchaseHistory[0]?.category;
      
      if (recentCategory) {
        const { data: sameCategoryProducts } = await supabase
          .from('products')
          .select('id, name, slug, price, images, category, stock')
          .eq('category', recentCategory)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(8);
        
        if (sameCategoryProducts && sameCategoryProducts.length > 0) {
          sections.unshift({
            id: 'for-you',
            title: `🎯 ${profile.name}님을 위한 추천`,
            subtitle: `최근 구매하신 ${recentCategory} 카테고리 상품`,
            products: sameCategoryProducts,
            reason: '구매 이력 기반',
            priority: 0
          });
        }
      }
      
      // 가격대 맞춤 추천
      const [minPrice, maxPrice] = profile.preferences.priceRange;
      const { data: priceMatchProducts } = await supabase
        .from('products')
        .select('id, name, slug, price, images, category, stock')
        .gte('price', minPrice)
        .lte('price', maxPrice)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (priceMatchProducts && priceMatchProducts.length > 0) {
        sections.push({
          id: 'price-match',
          title: '💰 내 예산에 딱 맞는',
          subtitle: `${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원`,
          products: priceMatchProducts,
          priority: 3
        });
      }
    }
    
    // 4. 할인 상품 (모든 사용자)
    const { data: saleProducts } = await supabase
      .from('products')
      .select('id, name, slug, price, images, category, stock')
      .eq('is_active', true)
      .order('price', { ascending: true })
      .limit(8);
    
    if (saleProducts && saleProducts.length > 0) {
      sections.push({
        id: 'on-sale',
        title: '💸 특가 세일',
        subtitle: '놓치면 후회하는 가격',
        products: saleProducts,
        priority: 4
      });
    }
    
    // 우선순위로 정렬
    return sections.sort((a, b) => a.priority - b.priority);
    
  } catch (error) {
    console.error('Error generating personalized feed:', error);
    return [];
  }
}

/**
 * 함께 구매한 상품 추천
 */
export async function getFrequentlyBoughtTogether(
  productId: string
): Promise<Array<{ id: string; name: string; slug: string; price: number; images: string[] }>> {
  const supabase = await createClient();
  
  try {
    // 이 상품을 포함한 주문들 찾기
    const { data: orders } = await supabase
      .from('orders')
      .select('items')
      .eq('status', 'completed');
    
    // 함께 구매된 상품 ID 추출
    const coOccurrences: Record<string, number> = {};
    
    orders?.forEach(order => {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      const hasTargetProduct = items.some((item: any) => item.product_id === productId);
      
      if (hasTargetProduct) {
        items.forEach((item: any) => {
          if (item.product_id !== productId) {
            coOccurrences[item.product_id] = (coOccurrences[item.product_id] || 0) + 1;
          }
        });
      }
    });
    
    // 상위 4개 상품 ID
    const topCoProductIds = Object.entries(coOccurrences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id]) => id);
    
    if (topCoProductIds.length === 0) {
      return [];
    }
    
    // 상품 정보 가져오기
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug, price, images')
      .in('id', topCoProductIds)
      .eq('is_active', true);
    
    return products || [];
    
  } catch (error) {
    console.error('Error fetching frequently bought together:', error);
    return [];
  }
}
