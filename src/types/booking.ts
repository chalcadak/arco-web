export interface Booking {
  id: string
  user_id: string | null
  photoshoot_look_id: string
  booking_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  pet_name: string
  pet_breed: string | null
  pet_age: number | null
  pet_weight: number | null
  pet_size: string | null
  pet_notes: string | null
  booking_date: string
  booking_time: string
  duration_minutes: number
  status: BookingStatus
  price: number
  payment_method: string | null
  payment_data: any
  paid_at: string | null
  completed_at: string | null
  photographer_notes: string | null
  cancelled_at: string | null
  cancel_reason: string | null
  created_at: string
  updated_at: string
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'paid' 
  | 'completed' 
  | 'cancelled'

export interface PhotoshootLook {
  id: string
  category_id: number
  name: string
  description: string | null
  price: number
  duration_minutes: number
  is_active: boolean
  thumbnail_url: string | null
  images: any
  video_url: string | null
  included_items: string[] | null
  requirements: string | null
  sizes: string[] | null
  tags: string[] | null
  slug: string
  view_count: number
  booking_count: number
  created_at: string
  updated_at: string
}
