import { test, expect } from '@playwright/test';

/**
 * 홈페이지 기본 테스트
 */
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 홈페이지로 이동
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/ARCO/i);
  });

  test('should display navigation menu', async ({ page }) => {
    // 네비게이션 메뉴가 보이는지 확인
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have working links', async ({ page }) => {
    // 링크가 작동하는지 확인 (예: 상품 페이지로 이동)
    const productsLink = page.getByRole('link', { name: /상품/i });
    
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await expect(page).toHaveURL(/\/products/);
    }
  });

  test('should be responsive', async ({ page }) => {
    // 모바일 뷰포트에서 테스트
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // 페이지가 정상적으로 렌더링되는지 확인
    await expect(page.locator('body')).toBeVisible();
  });
});
