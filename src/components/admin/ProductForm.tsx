'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import VideoUpload from '@/components/admin/VideoUpload';

interface ProductFormProps {
  product?: any;
  isEdit?: boolean;
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Form state
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || '');
  const [stockQuantity, setStockQuantity] = useState(
    product?.stock_quantity?.toString() || '0'
  );
  const [isActive, setIsActive] = useState(
    product?.is_active !== undefined ? product.is_active : true
  );
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [videoUid, setVideoUid] = useState<string | null>(product?.video_uid || null);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'product')
        .order('name');
      if (data) setCategories(data);
    }
    loadCategories();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEdit) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const productData = {
        name,
        slug,
        description,
        price: parseInt(price),
        category_id: categoryId || null,
        stock_quantity: parseInt(stockQuantity),
        is_active: isActive,
        images: images,
        video_uid: videoUid,
        sizes: product?.sizes || [],
        colors: product?.colors || [],
        tags: product?.tags || [],
      };

      if (isEdit && product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase.from('products').insert(productData);

        if (error) throw error;
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      console.error('Product save error:', error);
      alert(error.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">상품명 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="클래식 코튼 티셔츠"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL 슬러그 *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="classic-cotton-tshirt"
              required
            />
            <p className="text-xs text-muted-foreground">
              상품 URL에 사용됩니다: /products/{slug || 'slug'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">상품 설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상품에 대한 자세한 설명을 입력하세요"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">가격 (원) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="35000"
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">재고 수량 *</Label>
              <Input
                id="stock"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="100"
                required
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">활성화 상태</Label>
            <Select
              value={isActive ? 'true' : 'false'}
              onValueChange={(value) => setIsActive(value === 'true')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">활성화</SelectItem>
                <SelectItem value="false">비활성화</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 이미지 업로드 */}
      <Card>
        <CardHeader>
          <CardTitle>상품 이미지</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={10}
          />
        </CardContent>
      </Card>

      {/* 영상 업로드 */}
      <Card>
        <CardHeader>
          <CardTitle>상품 영상</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoUpload
            video={videoUid}
            onVideoChange={setVideoUid}
          />
        </CardContent>
      </Card>

      {/* Submit buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>{isEdit ? '수정하기' : '등록하기'}</>
          )}
        </Button>
      </div>
    </form>
  );
}
