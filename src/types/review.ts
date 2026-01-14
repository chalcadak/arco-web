// Review types for product and photoshoot reviews

export interface Review {
  id: number;
  reviewable_type: 'product' | 'photoshoot';
  reviewable_id: number;
  rating: number; // 1-5
  title?: string;
  content: string;
  images?: string[];
  author_name: string;
  author_email?: string;
  is_approved: boolean;
  approved_at?: string;
  approved_by?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewFormData {
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  author_name: string;
  author_email?: string;
}

export interface ReviewStats {
  average_rating: number;
  review_count: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
