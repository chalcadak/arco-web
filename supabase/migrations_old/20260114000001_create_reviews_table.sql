-- Create reviews table for product and photoshoot reviews
-- Migration: 20260114000001_create_reviews_table.sql

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGSERIAL PRIMARY KEY,
  
  -- Polymorphic relationship: can review either product or photoshoot
  reviewable_type TEXT NOT NULL CHECK (reviewable_type IN ('product', 'photoshoot')),
  reviewable_id BIGINT NOT NULL,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Author info
  author_name TEXT NOT NULL,
  author_email TEXT,
  
  -- Approval workflow
  is_approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  
  -- Helpful votes (future feature)
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for performance
  CONSTRAINT reviews_reviewable_check CHECK (
    (reviewable_type = 'product' AND reviewable_id IN (SELECT id FROM products)) OR
    (reviewable_type = 'photoshoot' AND reviewable_id IN (SELECT id FROM photoshoot_looks))
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_reviewable ON public.reviews(reviewable_type, reviewable_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can read approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON public.reviews
  FOR SELECT
  USING (is_approved = true);

-- Anyone can insert reviews (but they need approval)
CREATE POLICY "Anyone can create reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- Admin can view all reviews
CREATE POLICY "Admin can view all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin can update reviews (approve/reject)
CREATE POLICY "Admin can update reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin can delete reviews
CREATE POLICY "Admin can delete reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS reviews_updated_at_trigger ON public.reviews;
CREATE TRIGGER reviews_updated_at_trigger
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_reviews_updated_at();

-- Function to get average rating for a reviewable item
CREATE OR REPLACE FUNCTION get_average_rating(p_reviewable_type TEXT, p_reviewable_id BIGINT)
RETURNS TABLE(average_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating)::NUMERIC, 2) as average_rating,
    COUNT(*)::BIGINT as review_count
  FROM public.reviews
  WHERE 
    reviewable_type = p_reviewable_type 
    AND reviewable_id = p_reviewable_id
    AND is_approved = true;
END;
$$ LANGUAGE plpgsql;

-- Comment on table
COMMENT ON TABLE public.reviews IS 'Product and photoshoot reviews with approval workflow';
