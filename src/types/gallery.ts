export interface Gallery {
  id: string
  booking_id: string
  access_token: string
  title: string | null
  description: string | null
  is_active: boolean
  expires_at: string | null
  password: string | null
  view_count: number
  download_count: number
  last_viewed_at: string | null
  notification_sent: boolean
  notification_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  gallery_id: string
  original_url: string
  thumbnail_url: string | null
  filename: string
  file_size: number | null
  width: number | null
  height: number | null
  format: string | null
  display_order: number
  is_featured: boolean
  download_count: number
  created_at: string
}
