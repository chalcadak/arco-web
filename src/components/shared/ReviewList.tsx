'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { Review } from '@/types/review';

interface ReviewListProps {
  reviewableType: 'product' | 'photoshoot';
  reviewableId: number;
}

export default function ReviewList({
  reviewableType,
  reviewableId,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalCount: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  useEffect(() => {
    fetchReviews();
  }, [reviewableType, reviewableId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Fetch approved reviews
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewable_type', reviewableType)
        .eq('reviewable_id', reviewableId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);

      // Calculate stats
      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / data.length;

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.forEach((review) => {
          distribution[review.rating as keyof typeof distribution]++;
        });

        setStats({
          averageRating: Number(avgRating.toFixed(1)),
          totalCount: data.length,
          distribution,
        });
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Review Stats */}
      {reviews.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Average Rating */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold mb-2">
                  {stats.averageRating}
                </div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(stats.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  총 {stats.totalCount}개의 리뷰
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.distribution[rating as keyof typeof stats.distribution];
                  const percentage = stats.totalCount > 0 ? (count / stats.totalCount) * 100 : 0;

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{rating}</span>
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-yellow-400"
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          고객 리뷰 ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-2">아직 리뷰가 없습니다.</p>
              <p className="text-sm text-gray-400">
                첫 번째 리뷰를 작성해보세요!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{review.author_name}</span>
                <Badge variant="outline" className="text-xs">
                  구매자
                </Badge>
              </div>
              <div className="flex items-center gap-2">
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
                <span className="text-sm text-gray-500">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-semibold text-base">{review.title}</h4>
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

          {/* Footer */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <button
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => {
                // TODO: Implement helpful vote
              }}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>도움돼요 {review.helpful_count}</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
