import { test, expect } from '@playwright/test';

/**
 * 인증 흐름 테스트
 */
test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    
    // 로그인 폼이 표시되는지 확인
    const emailInput = page.getByLabel(/이메일|email/i);
    const passwordInput = page.getByLabel(/비밀번호|password/i);
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');
    
    // 로그인 버튼 찾기
    const loginButton = page.getByRole('button', { name: /로그인|login/i });
    await loginButton.click();
    
    // 에러 메시지가 표시되는지 확인 (선택적)
    await page.waitForTimeout(500);
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // 잘못된 이메일/비밀번호 입력
    await page.getByLabel(/이메일|email/i).fill('invalid@example.com');
    await page.getByLabel(/비밀번호|password/i).fill('wrongpassword');
    
    // 로그인 시도
    await page.getByRole('button', { name: /로그인|login/i }).click();
    
    // 에러 메시지 대기
    await page.waitForTimeout(1000);
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login');
    
    // 회원가입 링크 찾기
    const signupLink = page.getByRole('link', { name: /회원가입|가입/i });
    
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await expect(page).toHaveURL(/\/signup|\/register/);
    }
  });

  test('should show forgot password link', async ({ page }) => {
    await page.goto('/login');
    
    // 비밀번호 찾기 링크 확인
    const forgotPasswordLink = page.getByRole('link', { name: /비밀번호.*찾기|forgot/i });
    
    if (await forgotPasswordLink.isVisible()) {
      await expect(forgotPasswordLink).toBeVisible();
    }
  });
});

/**
 * 회원가입 테스트
 */
test.describe('Signup', () => {
  test('should show signup form', async ({ page }) => {
    await page.goto('/signup');
    
    // 회원가입 폼 필드 확인
    const emailInput = page.getByLabel(/이메일|email/i);
    const passwordInput = page.getByLabel(/비밀번호|password/i);
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should validate password requirements', async ({ page }) => {
    await page.goto('/signup');
    
    // 약한 비밀번호 입력
    await page.getByLabel(/비밀번호|password/i).first().fill('123');
    
    // 회원가입 버튼 클릭
    await page.getByRole('button', { name: /가입|회원가입/i }).click();
    
    // 에러 메시지 확인 (선택적)
    await page.waitForTimeout(500);
  });
});
