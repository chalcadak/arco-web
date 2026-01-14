/**
 * Validators Module
 * 
 * 프로젝트 전체에서 사용하는 유효성 검증 함수들
 * - 이메일 검증
 * - 전화번호 검증
 * - 비밀번호 검증
 * - 파일 검증
 * - 상품 검증
 */

import { FILE_UPLOAD } from './constants';

// ============================================================================
// Email Validation
// ============================================================================

/**
 * 이메일 형식 검증
 * @example validateEmail("test@example.com") // true
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 이메일 검증 (에러 메시지 포함)
 */
export function validateEmailWithMessage(email: string): { valid: boolean; message?: string } {
  if (!email) {
    return { valid: false, message: '이메일을 입력해주세요.' };
  }
  
  if (!validateEmail(email)) {
    return { valid: false, message: '올바른 이메일 형식이 아닙니다.' };
  }
  
  return { valid: true };
}

// ============================================================================
// Phone Number Validation
// ============================================================================

/**
 * 한국 전화번호 형식 검증
 * @example validatePhone("010-1234-5678") // true
 * @example validatePhone("01012345678") // true
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned) || /^01[0-9]{8,9}$/.test(cleaned);
}

/**
 * 전화번호 검증 (에러 메시지 포함)
 */
export function validatePhoneWithMessage(phone: string): { valid: boolean; message?: string } {
  if (!phone) {
    return { valid: false, message: '전화번호를 입력해주세요.' };
  }
  
  if (!validatePhone(phone)) {
    return { valid: false, message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)' };
  }
  
  return { valid: true };
}

// ============================================================================
// Password Validation
// ============================================================================

/**
 * 비밀번호 강도 검증
 * @param password - 검증할 비밀번호
 * @param minLength - 최소 길이 (기본: 6)
 */
export function validatePassword(password: string, minLength: number = 6): boolean {
  return password.length >= minLength;
}

/**
 * 비밀번호 강도 검증 (상세)
 */
export interface PasswordStrength {
  valid: boolean;
  score: number; // 0-4
  message: string;
  suggestions: string[];
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const suggestions: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 6) {
    return {
      valid: false,
      score: 0,
      message: '비밀번호는 최소 6자 이상이어야 합니다.',
      suggestions: ['최소 6자 이상 입력해주세요'],
    };
  }
  score += 1;

  // Contains number
  if (/\d/.test(password)) {
    score += 1;
  } else {
    suggestions.push('숫자를 포함하면 더 안전합니다');
  }

  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('소문자를 포함하면 더 안전합니다');
  }

  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('대문자를 포함하면 더 안전합니다');
  }

  // Contains special character
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('특수문자를 포함하면 더 안전합니다');
  }

  const messages = [
    '매우 약함',
    '약함',
    '보통',
    '강함',
    '매우 강함',
  ];

  return {
    valid: score >= 2,
    score: Math.min(score, 4),
    message: messages[Math.min(score, 4)],
    suggestions,
  };
}

/**
 * 비밀번호 확인 일치 검증
 */
export function validatePasswordMatch(password: string, confirmPassword: string): { valid: boolean; message?: string } {
  if (password !== confirmPassword) {
    return { valid: false, message: '비밀번호가 일치하지 않습니다.' };
  }
  return { valid: true };
}

// ============================================================================
// File Validation
// ============================================================================

/**
 * 이미지 파일 검증
 */
export function validateImageFile(file: File): { valid: boolean; message?: string } {
  // Size check
  if (file.size > FILE_UPLOAD.MAX_IMAGE_SIZE) {
    return {
      valid: false,
      message: `이미지 크기는 ${FILE_UPLOAD.MAX_IMAGE_SIZE / 1024 / 1024}MB 이하여야 합니다.`,
    };
  }

  // Type check
  if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: '지원하지 않는 이미지 형식입니다. (JPG, PNG, WEBP만 가능)',
    };
  }

  return { valid: true };
}

/**
 * 비디오 파일 검증
 */
export function validateVideoFile(file: File): { valid: boolean; message?: string } {
  // Size check
  if (file.size > FILE_UPLOAD.MAX_VIDEO_SIZE) {
    return {
      valid: false,
      message: `동영상 크기는 ${FILE_UPLOAD.MAX_VIDEO_SIZE / 1024 / 1024}MB 이하여야 합니다.`,
    };
  }

  // Type check
  if (!FILE_UPLOAD.ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: '지원하지 않는 동영상 형식입니다. (MP4, WEBM만 가능)',
    };
  }

  return { valid: true };
}

// ============================================================================
// Product Validation
// ============================================================================

/**
 * 상품 가격 검증
 */
export function validatePrice(price: number): { valid: boolean; message?: string } {
  if (price < 0) {
    return { valid: false, message: '가격은 0원 이상이어야 합니다.' };
  }
  
  if (price > 10000000) {
    return { valid: false, message: '가격은 1000만원 이하여야 합니다.' };
  }
  
  return { valid: true };
}

/**
 * 상품 재고 검증
 */
export function validateStock(stock: number): { valid: boolean; message?: string } {
  if (stock < 0) {
    return { valid: false, message: '재고는 0개 이상이어야 합니다.' };
  }
  
  if (stock > 9999) {
    return { valid: false, message: '재고는 9999개 이하여야 합니다.' };
  }
  
  return { valid: true };
}

// ============================================================================
// Form Validation
// ============================================================================

/**
 * 필수 필드 검증
 */
export function validateRequired(value: any, fieldName: string = '필드'): { valid: boolean; message?: string } {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: `${fieldName}을(를) 입력해주세요.` };
  }
  return { valid: true };
}

/**
 * 최소/최대 길이 검증
 */
export function validateLength(
  value: string,
  minLength: number = 0,
  maxLength: number = Infinity,
  fieldName: string = '필드'
): { valid: boolean; message?: string } {
  if (value.length < minLength) {
    return { valid: false, message: `${fieldName}은(는) 최소 ${minLength}자 이상이어야 합니다.` };
  }
  
  if (value.length > maxLength) {
    return { valid: false, message: `${fieldName}은(는) 최대 ${maxLength}자 이하여야 합니다.` };
  }
  
  return { valid: true };
}

/**
 * 숫자 범위 검증
 */
export function validateRange(
  value: number,
  min: number = -Infinity,
  max: number = Infinity,
  fieldName: string = '값'
): { valid: boolean; message?: string } {
  if (value < min) {
    return { valid: false, message: `${fieldName}은(는) ${min} 이상이어야 합니다.` };
  }
  
  if (value > max) {
    return { valid: false, message: `${fieldName}은(는) ${max} 이하여야 합니다.` };
  }
  
  return { valid: true };
}

// ============================================================================
// URL Validation
// ============================================================================

/**
 * URL 형식 검증
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * URL 검증 (에러 메시지 포함)
 */
export function validateUrlWithMessage(url: string): { valid: boolean; message?: string } {
  if (!url) {
    return { valid: false, message: 'URL을 입력해주세요.' };
  }
  
  if (!validateUrl(url)) {
    return { valid: false, message: '올바른 URL 형식이 아닙니다.' };
  }
  
  return { valid: true };
}

// ============================================================================
// Slug Validation
// ============================================================================

/**
 * URL slug 검증 (영문, 숫자, 하이픈만 허용)
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Slug 생성 (한글 → 영문 변환)
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/[\s가-힣]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
