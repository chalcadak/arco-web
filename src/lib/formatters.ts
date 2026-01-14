/**
 * Formatters Module
 * 
 * 프로젝트 전체에서 사용하는 포맷팅 함수들
 * - 금액 포맷팅
 * - 날짜 포맷팅
 * - 전화번호 포맷팅
 * - 주문번호 포맷팅
 */

// ============================================================================
// Price/Money Formatting
// ============================================================================

/**
 * 금액을 한국 원화 형식으로 포맷팅
 * @example formatPrice(10000) // "10,000원"
 * @example formatPrice(10000, false) // "10,000"
 */
export function formatPrice(price: number, withUnit: boolean = true): string {
  const formatted = price.toLocaleString('ko-KR');
  return withUnit ? `${formatted}원` : formatted;
}

/**
 * 금액을 통화 기호와 함께 포맷팅
 * @example formatCurrency(10000) // "₩10,000"
 */
export function formatCurrency(price: number): string {
  return `₩${price.toLocaleString('ko-KR')}`;
}

/**
 * 할인율 계산 및 포맷팅
 * @example formatDiscount(10000, 8000) // "20%"
 */
export function formatDiscount(originalPrice: number, discountedPrice: number): string {
  const discountRate = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  return `${discountRate}%`;
}

// ============================================================================
// Date/Time Formatting
// ============================================================================

/**
 * 날짜를 한국 형식으로 포맷팅
 * @example formatDate(new Date()) // "2024년 1월 14일"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 날짜를 짧은 형식으로 포맷팅
 * @example formatDateShort(new Date()) // "2024.01.14"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 날짜와 시간을 포맷팅
 * @example formatDateTime(new Date()) // "2024년 1월 14일 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 상대 시간 포맷팅 (n분 전, n시간 전 등)
 * @example formatRelativeTime(new Date(Date.now() - 3600000)) // "1시간 전"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  
  return formatDateShort(d);
}

// ============================================================================
// Phone Number Formatting
// ============================================================================

/**
 * 전화번호를 하이픈 포맷으로 변환
 * @example formatPhoneNumber("01012345678") // "010-1234-5678"
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  return phone;
}

/**
 * 전화번호 마스킹 (중간 번호 숨김)
 * @example maskPhoneNumber("010-1234-5678") // "010-****-5678"
 */
export function maskPhoneNumber(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  return formatted.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
}

// ============================================================================
// Order Number Formatting
// ============================================================================

/**
 * 주문번호 생성
 * @example generateOrderNumber() // "ORD-20240114-A1B2C3"
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * 주문번호를 짧게 표시 (앞 8자리만)
 * @example formatOrderNumber("ORD-1705234567890-A1B2C3") // "ORD-1705..."
 */
export function formatOrderNumber(orderNumber: string, length: number = 12): string {
  if (orderNumber.length <= length) return orderNumber;
  return `${orderNumber.substring(0, length)}...`;
}

// ============================================================================
// File Size Formatting
// ============================================================================

/**
 * 파일 크기를 읽기 좋은 형식으로 포맷팅
 * @example formatFileSize(1536) // "1.5 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// ============================================================================
// Percentage Formatting
// ============================================================================

/**
 * 퍼센트 포맷팅
 * @example formatPercent(0.15) // "15%"
 * @example formatPercent(0.15, 1) // "15.0%"
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * 숫자를 한국어 단위로 포맷팅
 * @example formatNumberWithUnit(1500) // "1.5천"
 * @example formatNumberWithUnit(1500000) // "150만"
 */
export function formatNumberWithUnit(num: number): string {
  if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
  if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}천`;
  return num.toString();
}
