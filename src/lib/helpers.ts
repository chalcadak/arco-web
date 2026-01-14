/**
 * Helpers Module
 * 
 * 프로젝트 전체에서 사용하는 헬퍼 함수들
 * - 주문 상태 관련
 * - 색상 관련
 * - 배열/객체 조작
 * - 문자열 조작
 */

import { ORDER_STATUS_CONFIG, PRODUCT_COLORS } from './constants';
import type { OrderStatusType } from './constants';

// ============================================================================
// Status Helpers
// ============================================================================

/**
 * 주문 상태에 따른 색상 클래스 가져오기
 */
export function getOrderStatusColor(status: OrderStatusType): string {
  const config = ORDER_STATUS_CONFIG[status];
  return config ? config.bgColor : 'bg-gray-100';
}

/**
 * 주문 상태에 따른 텍스트 색상 클래스 가져오기
 */
export function getOrderStatusTextColor(status: OrderStatusType): string {
  const config = ORDER_STATUS_CONFIG[status];
  return config ? config.textColor : 'text-gray-800';
}

/**
 * 주문 상태에 따른 한글 라벨 가져오기
 */
export function getOrderStatusLabel(status: OrderStatusType): string {
  const config = ORDER_STATUS_CONFIG[status];
  return config ? config.label : status;
}

/**
 * 주문 상태에 따른 아이콘 가져오기
 */
export function getOrderStatusIcon(status: OrderStatusType) {
  const config = ORDER_STATUS_CONFIG[status];
  return config ? config.icon : null;
}

// ============================================================================
// Color Helpers
// ============================================================================

/**
 * 색상 이름으로 hex 코드 가져오기
 */
export function getColorCode(colorName: string): string {
  const color = PRODUCT_COLORS.find(c => c.value === colorName.toLowerCase());
  return color ? color.hex : '#808080'; // Default gray
}

/**
 * 색상 이름으로 한글 라벨 가져오기
 */
export function getColorLabel(colorName: string): string {
  const color = PRODUCT_COLORS.find(c => c.value === colorName.toLowerCase());
  return color ? color.label : colorName;
}

// ============================================================================
// Array Helpers
// ============================================================================

/**
 * 배열을 청크로 나누기
 * @example chunk([1,2,3,4,5], 2) // [[1,2], [3,4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 배열에서 중복 제거
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * 배열을 무작위로 섞기
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 배열에서 랜덤 요소 선택
 */
export function randomItem<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

// ============================================================================
// Object Helpers
// ============================================================================

/**
 * 깊은 복사
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 객체에서 빈 값 제거
 */
export function removeEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * 객체를 쿼리 스트링으로 변환
 */
export function objectToQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });
  return params.toString();
}

// ============================================================================
// String Helpers
// ============================================================================

/**
 * 문자열 자르기 (말줄임표 추가)
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 첫 글자 대문자로 변환
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * 카멜케이스를 일반 텍스트로 변환
 * @example camelToText('helloWorld') // 'Hello World'
 */
export function camelToText(text: string): string {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * 스네이크케이스를 일반 텍스트로 변환
 * @example snakeToText('hello_world') // 'Hello World'
 */
export function snakeToText(text: string): string {
  return text
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
}

// ============================================================================
// Number Helpers
// ============================================================================

/**
 * 숫자를 범위 내로 제한
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 랜덤 숫자 생성
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 퍼센트 계산
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

// ============================================================================
// Debounce & Throttle
// ============================================================================

/**
 * Debounce 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ============================================================================
// Sleep/Delay
// ============================================================================

/**
 * 비동기 sleep 함수
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// Local Storage Helpers
// ============================================================================

/**
 * Local Storage에서 JSON 데이터 가져오기
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Local Storage에 JSON 데이터 저장하기
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Local Storage에서 데이터 삭제하기
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// ============================================================================
// Image Helpers
// ============================================================================

/**
 * 이미지 URL 또는 placeholder 반환
 */
export function getImageUrl(imageUrl: string | null | undefined, placeholder: string = '/placeholder-product.jpg'): string {
  return imageUrl || placeholder;
}

/**
 * Cloudflare R2 이미지 URL 생성
 */
export function getR2ImageUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || '';
  return `${baseUrl}/${path}`;
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * 에러 메시지 추출
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * 안전한 JSON 파싱
 */
export function safeParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}
