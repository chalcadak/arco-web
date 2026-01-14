// TossPayments 테스트 API 키
// 실제 프로덕션에서는 환경 변수로 관리

export const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

export const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';

export const PAYMENT_CONFIG = {
  clientKey: TOSS_CLIENT_KEY,
  successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success`,
  failUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/fail`,
};

// 테스트 카드 정보
export const TEST_CARD = {
  number: '4242-4242-4242-4242',
  expiry: '12/25',
  cvc: '123',
  password: '00',
};
