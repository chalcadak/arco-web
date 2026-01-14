import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductDetail from '@/components/customer/ProductDetail';
import { Product } from '@/types/product';

async function getProduct(slug: string) {
  const supabase = await createClient();
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    return null;
  }

  return product as Product;
}

// 관련 상품 가져오기
async function getRelatedProducts(categoryId: number, currentProductId: string) {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', currentProductId)
    .limit(4);

  if (error) {
    return [];
  }

  return products as Product[];
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);

  return (
    <div className="min-h-screen bg-background">
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </div>
  );
}

// 메타데이터 생성
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: '상품을 찾을 수 없습니다',
    };
  }

  return {
    title: `${product.name} | ARCO`,
    description: product.description || `${product.name} - 프리미엄 반려견 의류`,
  };
}
