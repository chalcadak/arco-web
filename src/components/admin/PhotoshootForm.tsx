'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { Text } from '@/components/ui/typography';
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
      {/* 기본 정보 섹션 */}
      <FormSection
        title="기본 정보"
        description="촬영룩의 기본 정보를 입력하세요"
      >
        <FormField label="촬영룩명" id="name" required>
          <Input
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="에디토리얼 시크"
            required
          />
        </FormField>

        <FormField
          label="URL 슬러그"
          id="slug"
          required
          description={`촬영룩 URL에 사용됩니다: /photoshoots/${slug || 'slug'}`}
        >
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="editorial-chic"
            required
          />
        </FormField>

        <FormField label="촬영룩 설명" id="description">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="촬영룩에 대한 자세한 설명을 입력하세요"
            rows={4}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="가격 (원)" id="price" required>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="150000"
              required
              min="0"
            />
          </FormField>

          <FormField label="촬영 시간 (분)" id="duration" required>
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
          </FormField>
        </div>

        <FormField label="카테고리" id="category">
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
        </FormField>

        <FormField label="활성화 상태" id="isActive">
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
        </FormField>
      </FormSection>

      {/* 포함 항목 섹션 */}
      <FormSection
        title="포함 항목"
        description="촬영룩에 포함되는 서비스 항목을 추가하세요"
      >
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
          <Text variant="muted" className="text-center py-4">
            포함 항목을 추가해주세요
          </Text>
        )}
      </FormSection>

      {/* 요구사항 섹션 */}
      <FormSection
        title="요구사항"
        description="촬영 시 필요한 준비물이나 주의사항을 입력하세요"
      >
        <Textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="예: 반려견의 목욕 후 방문 권장"
          rows={4}
        />
      </FormSection>

      {/* 이미지 업로드 섹션 */}
      <FormSection
        title="촬영룩 이미지"
        description="촬영룩 이미지를 업로드하세요 (최대 10개)"
      >
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          maxImages={10}
        />
      </FormSection>

      {/* 영상 업로드 섹션 */}
      <FormSection
        title="촬영룩 영상"
        description="촬영룩 소개 영상을 업로드하세요 (선택사항)"
      >
        <VideoUpload video={videoUid} onVideoChange={setVideoUid} />
      </FormSection>

      {/* 제출 버튼 */}
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
