import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 테스트 설정
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 테스트 디렉토리
  testDir: './tests/e2e',
  
  // 병렬 실행 설정
  fullyParallel: true,
  
  // CI 환경에서 재시도 없음, 로컬에서는 실패 시 재시도 안함
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  
  // CI에서는 병렬 실행 제한
  workers: process.env.CI ? 1 : undefined,
  
  // 리포터 설정
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  
  // 공통 설정
  use: {
    // Base URL (환경변수로 오버라이드 가능)
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // 트레이스 수집 (실패 시에만)
    trace: 'on-first-retry',
    
    // 스크린샷 (실패 시에만)
    screenshot: 'only-on-failure',
    
    // 비디오 (실패 시에만)
    video: 'retain-on-failure',
    
    // 타임아웃
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // 프로젝트별 브라우저 설정
  projects: [
    // Desktop Chrome
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Desktop Firefox
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Desktop Safari
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile Chrome
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },

    // Mobile Safari
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },

    // Tablet
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
      },
    },
  ],

  // 개발 서버 자동 실행 (선택사항)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});
