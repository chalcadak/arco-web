export interface Product {
  id: string
  category_id: number
  name: string
  description: string | null
  price: number
  stock_quantity: number
  is_active: boolean
  thumbnail_url: string | null
  images: ProductImage[] | null
  video_url: string | null
  sizes: string[] | null
  colors: string[] | null
  tags: string[] | null
  slug: string
  meta_title: string | null
  meta_description: string | null
  view_count: number
  order_count: number
  created_at: string
  updated_at: string
}

export interface ProductImage {
  url: string
  alt: string
  order: number
}

export interface Category {
  id: number
  name: string
  slug: string
  type: 'product' | 'photoshoot'
  description: string | null
  display_order: number
  created_at: string
}
