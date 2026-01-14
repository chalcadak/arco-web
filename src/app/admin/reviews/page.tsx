import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminReviewsList from '@/components/admin/AdminReviewsList';

export const metadata: Metadata = {
  title: '리뷰 관리 - ARCO 관리자',
  description: '상품 및 촬영룩 리뷰 관리',
};

async function getReviews() {
  const supabase = await createClient();

  // Get all reviews (approved and pending)
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return reviews || [];
}

async function getReviewableItems(reviews: any[]) {
  const supabase = await createClient();
  const itemsMap = new Map();

  // Get unique product IDs and photoshoot IDs
  const productIds = reviews
    .filter((r) => r.reviewable_type === 'product')
    .map((r) => r.reviewable_id);
  
  const photoshootIds = reviews
    .filter((r) => r.reviewable_type === 'photoshoot')
    .map((r) => r.reviewable_id);

  // Fetch products
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug')
      .in('id', productIds);

    products?.forEach((p) => {
      itemsMap.set(`product-${p.id}`, p);
    });
  }

  // Fetch photoshoots
  if (photoshootIds.length > 0) {
    const { data: photoshoots } = await supabase
      .from('photoshoot_looks')
      .select('id, name, slug')
      .in('id', photoshootIds);

    photoshoots?.forEach((p) => {
      itemsMap.set(`photoshoot-${p.id}`, p);
    });
  }

  return itemsMap;
}

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  // Check admin authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const reviews = await getReviews();
  const itemsMap = await getReviewableItems(reviews);

  // Attach item info to reviews
  const reviewsWithItems = reviews.map((review) => ({
    ...review,
    item: itemsMap.get(`${review.reviewable_type}-${review.reviewable_id}`),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">리뷰 관리</h1>
        <p className="text-muted-foreground mt-2">
          상품 및 촬영룩 리뷰를 승인, 거부 또는 삭제할 수 있습니다.
        </p>
      </div>

      <AdminReviewsList reviews={reviewsWithItems} />
    </div>
  );
}
