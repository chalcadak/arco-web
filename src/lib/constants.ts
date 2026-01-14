/**
 * Constants Module
 * 
 * 프로젝트 전체에서 사용하는 상수들
 * - 주문 상태
 * - 결제 설정
 * - 배송 설정
 * - 파일 업로드 제한
 * - UI 설정
 */

import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

// ============================================================================
// Order Status
// ============================================================================

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type OrderStatusType = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

/**
 * 주문 상태 설정 (한글 라벨, 색상, 아이콘)
 */
export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    label: '결제완료',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: Package,
  },
  [ORDER_STATUS.PROCESSING]: {
    label: '상품준비중',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: Package,
  },
  [ORDER_STATUS.SHIPPED]: {
    label: '배송중',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: Truck,
  },
  [ORDER_STATUS.DELIVERED]: {
    label: '배송완료',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: CheckCircle,
  },
  [ORDER_STATUS.COMPLETED]: {
    label: '구매확정',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: CheckCircle,
  },
  [ORDER_STATUS.CANCELLED]: {
    label: '취소됨',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: XCircle,
  },
  [ORDER_STATUS.REFUNDED]: {
    label: '환불됨',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: XCircle,
  },
} as const;

// ============================================================================
// Payment Status
// ============================================================================

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatusType = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// ============================================================================
// Shipping Settings
// ============================================================================

/**
 * 배송비 설정
 */
export const SHIPPING = {
  FEE: 3000,                    // 기본 배송비
  FREE_THRESHOLD: 50000,        // 무료 배송 기준 금액
  DEFAULT_DELIVERY_DAYS: '2-3', // 예상 배송일
} as const;

/**
 * 택배사 목록
 */
export const SHIPPING_COMPANIES = [
  { value: 'cj', label: 'CJ대한통운' },
  { value: 'hanjin', label: '한진택배' },
  { value: 'lotte', label: '롯데택배' },
  { value: 'logen', label: '로젠택배' },
  { value: 'post', label: '우체국택배' },
  { value: 'gts', label: '경동택배' },
] as const;

// ============================================================================
// Payment Settings
// ============================================================================

/**
 * 테스트 카드 정보
 */
export const TEST_CARD = {
  NUMBER: '4242-4242-4242-4242',
  EXPIRY: '12/25',
  CVC: '123',
  PASSWORD: '00',
} as const;

/**
 * 결제 수단
 */
export const PAYMENT_METHODS = [
  { value: 'card', label: '신용/체크카드' },
  { value: 'transfer', label: '계좌이체' },
  { value: 'vbank', label: '가상계좌' },
  { value: 'phone', label: '휴대폰결제' },
  { value: 'naverpay', label: '네이버페이' },
  { value: 'kakaopay', label: '카카오페이' },
] as const;

// ============================================================================
// File Upload Limits
// ============================================================================

/**
 * 파일 업로드 제한
 */
export const FILE_UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,      // 5MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024,    // 100MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
} as const;

// ============================================================================
// Pagination
// ============================================================================

/**
 * 페이지네이션 설정
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// ============================================================================
// Review Settings
// ============================================================================

/**
 * 리뷰 설정
 */
export const REVIEW = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MAX_IMAGES: 5,
  MIN_CONTENT_LENGTH: 10,
  MAX_CONTENT_LENGTH: 1000,
} as const;

// ============================================================================
// Coupon Settings
// ============================================================================

/**
 * 쿠폰 타입
 */
export const COUPON_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;

export type CouponType = typeof COUPON_TYPE[keyof typeof COUPON_TYPE];

// ============================================================================
// Product Settings
// ============================================================================

/**
 * 상품 재고 경고 기준
 */
export const PRODUCT = {
  LOW_STOCK_THRESHOLD: 5,
  OUT_OF_STOCK: 0,
} as const;

/**
 * 상품 크기
 */
export const PRODUCT_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
] as const;

/**
 * 상품 색상
 */
export const PRODUCT_COLORS = [
  { value: 'black', label: '블랙', hex: '#000000' },
  { value: 'white', label: '화이트', hex: '#FFFFFF' },
  { value: 'navy', label: '네이비', hex: '#000080' },
  { value: 'beige', label: '베이지', hex: '#F5F5DC' },
  { value: 'gray', label: '그레이', hex: '#808080' },
  { value: 'brown', label: '브라운', hex: '#A52A2A' },
  { value: 'red', label: '레드', hex: '#FF0000' },
  { value: 'pink', label: '핑크', hex: '#FFC0CB' },
  { value: 'yellow', label: '옐로우', hex: '#FFFF00' },
  { value: 'blue', label: '블루', hex: '#0000FF' },
] as const;

// ============================================================================
// Inquiry Status
// ============================================================================

/**
 * 문의 상태
 */
export const INQUIRY_STATUS = {
  PENDING: 'pending',
  ANSWERED: 'answered',
} as const;

export const INQUIRY_STATUS_CONFIG = {
  [INQUIRY_STATUS.PENDING]: {
    label: '답변대기',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  [INQUIRY_STATUS.ANSWERED]: {
    label: '답변완료',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
} as const;

// ============================================================================
// Booking Status
// ============================================================================

/**
 * 예약 상태
 */
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const BOOKING_STATUS_CONFIG = {
  [BOOKING_STATUS.PENDING]: {
    label: '예약대기',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  [BOOKING_STATUS.CONFIRMED]: {
    label: '예약확정',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  [BOOKING_STATUS.COMPLETED]: {
    label: '촬영완료',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  [BOOKING_STATUS.CANCELLED]: {
    label: '예약취소',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
} as const;

// ============================================================================
// Routes
// ============================================================================

/**
 * 주요 라우트 경로
 */
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PHOTOSHOOTS: '/photoshoots',
  CART: '/cart',
  CHECKOUT: '/checkout',
  MY_PAGE: '/my-page',
  MY_ORDERS: '/my-page/orders',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_BOOKINGS: '/admin/bookings',
} as const;

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * API 엔드포인트
 */
export const API = {
  ORDERS: '/api/orders',
  BOOKINGS: '/api/bookings',
  PAYMENT_VERIFY: '/api/payment/verify',
  UPLOAD: '/api/upload',
  UPLOAD_VIDEO: '/api/upload-video',
} as const;
