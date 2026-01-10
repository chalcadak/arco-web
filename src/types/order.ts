export interface Order {
  id: string
  user_id: string | null
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_name: string
  shipping_phone: string
  shipping_postcode: string
  shipping_address: string
  shipping_address_detail: string | null
  shipping_memo: string | null
  total_amount: number
  shipping_fee: number
  discount_amount: number
  final_amount: number
  status: OrderStatus
  payment_method: string | null
  payment_data: any
  paid_at: string | null
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  cancel_reason: string | null
  refunded_at: string | null
  created_at: string
  updated_at: string
}

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'preparing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_thumbnail: string | null
  size: string | null
  color: string | null
  price: number
  quantity: number
  subtotal: number
  created_at: string
}
