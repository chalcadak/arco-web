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
import { Loader2, Plus, X } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import VideoUpload from '@/components/admin/VideoUpload';

interface PhotoshootFormProps {
  photoshoot?: any;
  isEdit?: boolean;
}

export function PhotoshootForm({ photoshoot, isEdit = false }: PhotoshootFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Form state
  const [name, setName] = useState(photoshoot?.name || '');
  const [slug, setSlug] = useState(photoshoot?.slug || '');
  const [description, setDescription] = useState(photoshoot?.description || '');
  const [price, setPrice] = useState(photoshoot?.price?.toString() || '');
  const [categoryId, setCategoryId] = useState(photoshoot?.category_id || '');
  const [durationMinutes, setDurationMinutes] = useState(
    photoshoot?.duration_minutes?.toString() || '60'
  );
  const [includedItems, setIncludedItems] = useState<string[]>(
    photoshoot?.included_items || []
  );
  const [requirements, setRequirements] = useState(photoshoot?.requirements || '');
  const [isActive, setIsActive] = useState(
    photoshoot?.is_active !== undefined ? photoshoot.is_active : true
  );
  const [images, setImages] = useState<string[]>(photoshoot?.images || []);
  const [videoUid, setVideoUid] = useState<string | null>(photoshoot?.video_uid || null);

  // New item input
  const [newItem, setNewItem] = useState('');

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'photoshoot')
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

  // Add included item
  const handleAddItem = () => {
    if (newItem.trim()) {
      setIncludedItems([...includedItems, newItem.trim()]);
      setNewItem('');
    }
  };

  // Remove included item
  const handleRemoveItem = (index: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const photoshootData = {
        name,
        slug,
        description,
        price: parseInt(price),
        category_id: categoryId || null,
        duration_minutes: parseInt(durationMinutes),
        included_items: includedItems,
        requirements,
        is_active: isActive,
        images: images,
        video_uid: videoUid,
        tags: photoshoot?.tags || [],
      };

      if (isEdit && photoshoot) {
        // Update existing photoshoot
        const { error } = await supabase
          .from('photoshoot_looks')
          .update(photoshootData)
          .eq('id', photoshoot.id);

        if (error) throw error;
      } else {
        // Create new photoshoot
        const { error } = await supabase
          .from('photoshoot_looks')
          .insert(photoshootData);

        if (error) throw error;
      }

      router.push('/admin/photoshoots');
      router.refresh();
    } catch (error: any) {
      console.error('Photoshoot save error:', error);
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
            <Label htmlFor="name">촬영룩명 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="에디토리얼 시크"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL 슬러그 *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="editorial-chic"
              required
            />
            <p className="text-xs text-muted-foreground">
              촬영룩 URL에 사용됩니다: /photoshoots/{slug || 'slug'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">촬영룩 설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="촬영룩에 대한 자세한 설명을 입력하세요"
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
                placeholder="150000"
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">촬영 시간 (분) *</Label>
              <Input
                id="duration"
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="60"
                required
                min="15"
                step="15"
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

      {/* Included Items */}
      <Card>
        <CardHeader>
          <CardTitle>포함 항목</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="예: 전문 사진작가"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            />
            <Button type="button" onClick={handleAddItem}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {includedItems.length > 0 && (
            <div className="space-y-2">
              {includedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="text-sm">{item}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {includedItems.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              포함 항목을 추가해주세요
            </p>
          )}
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>요구사항</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="촬영 시 필요한 준비물이나 주의사항을 입력하세요"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* 이미지 업로드 */}
      <Card>
        <CardHeader>
          <CardTitle>촬영룩 이미지</CardTitle>
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
          <CardTitle>촬영룩 영상</CardTitle>
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
