// TossPayments 테스트 API 키
// 실제 프로덕션에서는 환경 변수로 관리

export const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

export const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';

// Get site URL with proper fallback
const getSiteUrl = () => {
  // 1. 환경 변수에서 확인
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // 2. Vercel 환경에서는 자동으로 제공되는 URL 사용
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // 3. 개발 환경에서만 localhost 사용
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // 4. 프로덕션에서 환경 변수가 없으면 경고
  console.warn('⚠️ NEXT_PUBLIC_SITE_URL is not set. Payment redirects may fail.');
  return 'http://localhost:3000';
};

export const PAYMENT_CONFIG = {
  clientKey: TOSS_CLIENT_KEY,
  successUrl: `${getSiteUrl()}/payment/success`,
  failUrl: `${getSiteUrl()}/payment/fail`,
};

// 테스트 카드 정보
export const TEST_CARD = {
  number: '4242-4242-4242-4242',
  expiry: '12/25',
  cvc: '123',
  password: '00',
};
