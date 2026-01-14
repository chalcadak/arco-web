'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import ImageUpload from '@/components/admin/ImageUpload';
import type { ReviewFormData } from '@/types/review';

interface ReviewFormProps {
  reviewableType: 'product' | 'photoshoot';
  reviewableId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  reviewableType,
  reviewableId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    content: '',
    images: [],
    author_name: '',
    author_email: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.rating === 0) {
      setError('별점을 선택해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      setError('리뷰 내용을 입력해주세요.');
      return;
    }
    if (!formData.author_name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase.from('reviews').insert({
        reviewable_type: reviewableType,
        reviewable_id: reviewableId,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        images: formData.images,
        author_name: formData.author_name,
        author_email: formData.author_email,
        is_approved: false, // Requires admin approval
      });

      if (insertError) throw insertError;

      // Reset form
      setFormData({
        rating: 0,
        title: '',
        content: '',
        images: [],
        author_name: '',
        author_email: '',
      });

      // Show success message
      alert('리뷰가 등록되었습니다. 관리자 승인 후 표시됩니다.');

      onSuccess?.();
    } catch (err) {
      console.error('Review submission error:', err);
      setError('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>리뷰 작성하기</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              별점 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || formData.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-2 text-sm text-gray-600 self-center">
                  {formData.rating}점
                </span>
              )}
            </div>
          </div>

          {/* Title (optional) */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              제목 (선택)
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
              placeholder="리뷰 제목 (선택사항)"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              리뷰 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={5}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none resize-none"
              placeholder="상품/촬영룩에 대한 상세한 리뷰를 작성해주세요."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              최소 10자 이상 작성해주세요.
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              리뷰 사진 (선택)
            </label>
            <ImageUpload
              images={formData.images || []}
              onImagesChange={(images) =>
                setFormData({ ...formData, images })
              }
              maxImages={5}
            />
            <p className="text-xs text-gray-500 mt-1">
              최대 5장까지 업로드 가능합니다.
            </p>
          </div>

          {/* Author Name */}
          <div>
            <label
              htmlFor="author_name"
              className="block text-sm font-medium mb-2"
            >
              작성자 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author_name"
              value={formData.author_name}
              onChange={(e) =>
                setFormData({ ...formData, author_name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
              placeholder="이름"
              required
            />
          </div>

          {/* Author Email (optional) */}
          <div>
            <label
              htmlFor="author_email"
              className="block text-sm font-medium mb-2"
            >
              이메일 (선택)
            </label>
            <input
              type="email"
              id="author_email"
              value={formData.author_email}
              onChange={(e) =>
                setFormData({ ...formData, author_email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
              placeholder="email@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              답변 받으실 이메일 (선택사항)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
            >
              {error}
            </motion.div>
          )}

          {/* Info Message */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-600">
            💡 작성하신 리뷰는 관리자 승인 후 표시됩니다.
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  등록 중...
                </>
              ) : (
                '리뷰 등록'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
