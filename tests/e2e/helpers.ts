import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * 테스트 헬퍼 함수 및 유틸리티
 */

// 환경 변수
export const TEST_CONFIG = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  testEmail: process.env.TEST_EMAIL || 'test@arco.com',
  testPassword: process.env.TEST_PASSWORD || 'test1234',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@arco.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin1234',
};

/**
 * 페이지 로딩 대기
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * 로그인 헬퍼
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  
  await page.getByLabel(/이메일|email/i).fill(email);
  await page.getByLabel(/비밀번호|password/i).fill(password);
  await page.getByRole('button', { name: /로그인|login/i }).click();
  
  // 로그인 완료 대기
  await page.waitForURL('/', { timeout: 10000 }).catch(() => {
    // URL 변경이 없을 수도 있음
  });
  
  await waitForPageLoad(page);
}

/**
 * 로그아웃 헬퍼
 */
export async function logout(page: Page) {
  // 프로필 메뉴나 로그아웃 버튼 찾기
  const logoutButton = page.getByRole('button', { name: /로그아웃|logout/i });
  
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await waitForPageLoad(page);
  }
}

/**
 * 테스트 데이터 생성 헬퍼
 */
export function generateTestData() {
  const timestamp = Date.now();
  
  return {
    email: `test+${timestamp}@arco.com`,
    name: `Test User ${timestamp}`,
    phone: `010-1234-${String(timestamp).slice(-4)}`,
    address: '서울시 강남구 테스트로 123',
    zipcode: '12345',
  };
}

/**
 * 스크린샷 저장 헬퍼
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * 로컬 스토리지 클리어
 */
export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * 쿠키 클리어
 */
export async function clearCookies(page: Page) {
  await page.context().clearCookies();
}

/**
 * API 응답 대기 헬퍼
 */
export async function waitForApiResponse(
  page: Page, 
  urlPattern: string | RegExp,
  timeout = 10000
) {
  return page.waitForResponse(
    response => {
      const url = response.url();
      return typeof urlPattern === 'string' 
        ? url.includes(urlPattern)
        : urlPattern.test(url);
    },
    { timeout }
  );
}

/**
 * 확장된 테스트 픽스처
 */
type TestFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

export const test = base.extend<TestFixtures>({
  // 일반 사용자로 로그인된 페이지
  authenticatedPage: async ({ page }, use) => {
    await login(page, TEST_CONFIG.testEmail, TEST_CONFIG.testPassword);
    await use(page);
    await logout(page);
  },
  
  // 관리자로 로그인된 페이지
  adminPage: async ({ page }, use) => {
    await login(page, TEST_CONFIG.adminEmail, TEST_CONFIG.adminPassword);
    await use(page);
    await logout(page);
  },
});

export { expect };
