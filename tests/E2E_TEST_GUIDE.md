# Playwright E2E 테스트 가이드

## 📦 설치

```bash
# 의존성 설치
npm install

# Playwright 브라우저 설치
npx playwright install
```

## 🚀 테스트 실행

### 기본 실행
```bash
# 모든 테스트 실행 (헤드리스)
npm run test:e2e

# UI 모드로 실행 (디버깅에 유용)
npm run test:e2e:ui

# 브라우저를 띄워서 실행
npm run test:e2e:headed

# 디버그 모드
npm run test:e2e:debug

# 특정 브라우저만 실행
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### 특정 테스트 실행
```bash
# 특정 파일만 실행
npx playwright test tests/e2e/home.spec.ts

# 특정 테스트만 실행
npx playwright test -g "should load homepage"
```

### 리포트 보기
```bash
# HTML 리포트 열기
npm run test:e2e:report

# 또는
npx playwright show-report
```

## 🎬 테스트 코드 자동 생성

```bash
# Codegen으로 테스트 자동 생성
npm run test:e2e:codegen

# 특정 URL에서 시작
npx playwright codegen http://localhost:3000/products
```

## 📁 디렉토리 구조

```
tests/
└── e2e/
    ├── home.spec.ts           # 홈페이지 테스트
    ├── products.spec.ts       # 상품 페이지 테스트
    ├── auth.spec.ts           # 인증 테스트
    └── helpers.ts             # 공통 헬퍼 함수
```

## 📝 테스트 작성 예시

### 기본 테스트
```typescript
import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ARCO/i);
});
```

### 헬퍼 사용
```typescript
import { test, expect, login } from './helpers';

test('should access profile page', async ({ page }) => {
  await login(page, 'user@example.com', 'password123');
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/profile/);
});
```

### 인증된 사용자 테스트
```typescript
import { test, expect } from './helpers';

test('should view orders', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/orders');
  await expect(authenticatedPage).toHaveURL(/\/orders/);
});
```

## 🎯 테스트 선택자 규칙

### 권장 순서
1. `data-testid` 속성 사용 (가장 안정적)
```typescript
page.locator('[data-testid="product-item"]')
```

2. 역할 기반 선택자
```typescript
page.getByRole('button', { name: /로그인/ })
page.getByRole('link', { name: /상품/ })
```

3. 레이블 기반 선택자
```typescript
page.getByLabel(/이메일/)
page.getByLabel(/비밀번호/)
```

4. 텍스트 기반 선택자
```typescript
page.getByText('장바구니')
```

### 컴포넌트에 testid 추가
```tsx
// 예시: 상품 카드 컴포넌트
<div data-testid="product-item">
  <h3 data-testid="product-name">{product.name}</h3>
  <button data-testid="add-to-cart">장바구니 담기</button>
</div>
```

## 🔧 환경 변수

`.env.test.local` 파일 생성:
```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000
TEST_EMAIL=test@arco.com
TEST_PASSWORD=test1234
ADMIN_EMAIL=admin@arco.com
ADMIN_PASSWORD=admin1234
```

## 📊 CI/CD 통합

### GitHub Actions 예시
```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        
      - name: Run dev server
        run: npm run dev &
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

## 🐛 디버깅 팁

### 1. UI 모드 사용
```bash
npm run test:e2e:ui
```

### 2. 디버그 모드
```bash
npm run test:e2e:debug
```

### 3. 스크린샷 확인
실패한 테스트의 스크린샷은 `test-results/` 폴더에 자동 저장됩니다.

### 4. 트레이스 확인
```bash
npx playwright show-trace test-results/trace.zip
```

### 5. 슬로우 모션
```typescript
test('slow motion test', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // 1초 대기
});
```

## 📋 체크리스트

### 테스트 작성 전
- [ ] 로컬 서버 실행 (`npm run dev`)
- [ ] Playwright 브라우저 설치 (`npx playwright install`)
- [ ] 테스트 데이터 준비

### 테스트 작성 시
- [ ] 명확한 테스트 이름
- [ ] `data-testid` 속성 사용
- [ ] 에러 처리 (try-catch)
- [ ] 타임아웃 설정
- [ ] 클린업 (로그아웃, 데이터 삭제)

### 테스트 실행 후
- [ ] 모든 테스트 통과 확인
- [ ] 리포트 검토
- [ ] 실패한 테스트 스크린샷 확인

## 🔥 자주 사용하는 명령어

```bash
# 빠른 테스트 (Chrome만)
npx playwright test --project=chromium

# 특정 테스트만 실행
npx playwright test home.spec.ts

# 마지막 실패한 테스트만 재실행
npx playwright test --last-failed

# 브라우저 업데이트
npx playwright install

# 설정 파일 검증
npx playwright test --list
```

## 📚 참고 자료

- [Playwright 공식 문서](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## 🎉 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. Playwright 설치
npx playwright install

# 3. 개발 서버 실행
npm run dev

# 4. (다른 터미널에서) 테스트 실행
npm run test:e2e:ui
```

---

**Happy Testing! 🚀**
