'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Check, X, Trash2, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import type { Review } from '@/types/review';

interface ReviewWithItem extends Review {
  item?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface AdminReviewsListProps {
  reviews: ReviewWithItem[];
}

export default function AdminReviewsList({ reviews: initialReviews }: AdminReviewsListProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !review.is_approved && !review.approved_at;
    if (filter === 'approved') return review.is_approved;
    if (filter === 'rejected') return !review.is_approved && review.approved_at;
    return true;
  });

  const handleApprove = async (reviewId: number) => {
    setIsProcessing(reviewId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('reviews')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Update local state
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, is_approved: true, approved_at: new Date().toISOString() }
            : r
        )
      );

      router.refresh();
    } catch (error) {
      console.error('Error approving review:', error);
      alert('리뷰 승인 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (reviewId: number) => {
    setIsProcessing(reviewId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('reviews')
        .update({
          is_approved: false,
          approved_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) throw error;

      // Update local state
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, is_approved: false, approved_at: new Date().toISOString() }
            : r
        )
      );

      router.refresh();
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert('리뷰 거부 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('이 리뷰를 삭제하시겠습니까?')) return;

    setIsProcessing(reviewId);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

      if (error) throw error;

      // Update local state
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));

      router.refresh();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusBadge = (review: ReviewWithItem) => {
    if (review.is_approved) {
      return <Badge variant="default">승인됨</Badge>;
    } else if (review.approved_at) {
      return <Badge variant="destructive">거부됨</Badge>;
    } else {
      return <Badge variant="secondary">대기중</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          전체 ({reviews.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          대기중 ({reviews.filter((r) => !r.is_approved && !r.approved_at).length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('approved')}
        >
          승인됨 ({reviews.filter((r) => r.is_approved).length})
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('rejected')}
        >
          거부됨 ({reviews.filter((r) => !r.is_approved && r.approved_at).length})
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {filter === 'all' ? '리뷰가 없습니다.' : `${filter === 'pending' ? '대기중인' : filter === 'approved' ? '승인된' : '거부된'} 리뷰가 없습니다.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(review)}
                        <Badge variant="outline">
                          {review.reviewable_type === 'product' ? '상품' : '촬영룩'}
                        </Badge>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Item Info */}
                      {review.item && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span className="font-semibold">{review.item.name}</span>
                          <Link
                            href={`/${review.reviewable_type === 'product' ? 'products' : 'photoshoots'}/${review.item.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            보기
                          </Link>
                        </div>
                      )}

                      {/* Author */}
                      <div className="text-sm text-muted-foreground">
                        작성자: <span className="font-medium">{review.author_name}</span>
                        {review.author_email && ` (${review.author_email})`}
                        <span className="ml-3">
                          {new Date(review.created_at).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {!review.is_approved && !review.approved_at && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            disabled={isProcessing === review.id}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(review.id)}
                            disabled={isProcessing === review.id}
                          >
                            <X className="w-4 h-4 mr-1" />
                            거부
                          </Button>
                        </>
                      )}
                      {review.is_approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(review.id)}
                          disabled={isProcessing === review.id}
                        >
                          <X className="w-4 h-4 mr-1" />
                          승인 취소
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(review.id)}
                        disabled={isProcessing === review.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h4 className="font-semibold">{review.title}</h4>
                  )}

                  {/* Content */}
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {review.content}
                  </p>

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {review.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
                        >
                          <img
                            src={image}
                            alt={`리뷰 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Helpful Count */}
                  <div className="text-sm text-muted-foreground">
                    도움돼요 {review.helpful_count || 0}개
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
