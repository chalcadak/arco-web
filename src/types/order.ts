export interface Order {
  id: string
  order_number: string
  user_id: string | null
  
  // Customer info
  customer_name: string
  customer_email: string
  customer_phone: string
  
  // Shipping info
  shipping_address: string | Record<string, any>  // Can be TEXT or JSON
  shipping_zipcode?: string | null
  shipping_request?: string | null
  
  // Order items (JSON array)
  items: any[] | string  // JSONB in database
  
  // Amount info
  subtotal: number
  shipping_fee: number
  discount_amount: number
  total_amount: number
  
  // Payment info
  payment_key?: string | null
  payment_method?: string | null
  payment_status?: string
  paid_at?: string | null
  
  // Order status
  status: OrderStatus
  
  // Shipping tracking
  tracking_number?: string | null
  shipping_company?: string | null
  shipped_at?: string | null
  delivered_at?: string | null
  completed_at?: string | null
  
  // Coupon
  coupon_code?: string | null
  
  // Meta
  created_at: string
  updated_at: string
}

export type OrderStatus = 
  | 'pending'      // 결제완료
  | 'processing'   // 상품준비중
  | 'shipped'      // 배송중
  | 'delivered'    // 배송완료
  | 'completed'    // 구매확정
  | 'cancelled'    // 취소됨
  | 'refunded'     // 환불됨

export interface OrderItem {
  product_id?: string
  productId?: string  // Support both formats
  name: string
  slug?: string
  price: number
  quantity: number
  size?: string | null
  color?: string | null
  image?: string | null
}

export interface ShippingAddress {
  name: string
  phone: string
  address: string
  postal_code: string
  detail_address?: string
}
