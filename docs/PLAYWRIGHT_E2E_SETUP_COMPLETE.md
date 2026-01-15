# 🎭 Playwright E2E 테스트 환경 구축 완료!

## ✅ 설치 완료 항목

### 📦 패키지 설치
```json
"devDependencies": {
  "@playwright/test": "^1.49.0"
}
```

### 🎬 NPM Scripts 추가
```json
"scripts": {
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:codegen": "playwright codegen http://localhost:3000",
  "test:e2e:report": "playwright show-report"
}
```

---

## 📁 생성된 파일

### 1. **playwright.config.ts** (2KB)
Playwright 메인 설정 파일
- **6개 브라우저 프로젝트**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari, iPad
- **병렬 실행**: 빠른 테스트
- **자동 리포트**: HTML, JSON, List 리포터
- **실패 시**: 스크린샷, 비디오, 트레이스 자동 수집
- **타임아웃**: Action 10초, Navigation 30초

### 2. **tests/e2e/home.spec.ts** (1KB)
홈페이지 E2E 테스트
- 페이지 로딩 확인
- 네비게이션 메뉴 확인
- 링크 작동 확인
- 반응형 확인

### 3. **tests/e2e/products.spec.ts** (2.7KB)
상품 페이지 E2E 테스트
- 상품 목록 로딩
- 카테고리 필터링
- 상품 검색
- 상품 상세 페이지 이동
- 장바구니 담기

### 4. **tests/e2e/auth.spec.ts** (2.6KB)
인증 흐름 E2E 테스트
- 로그인 페이지 확인
- 빈 폼 검증
- 잘못된 인증 정보 처리
- 회원가입 페이지 이동
- 비밀번호 찾기 링크 확인
- 회원가입 폼 검증

### 5. **tests/e2e/helpers.ts** (3KB)
재사용 가능한 헬퍼 함수
- `login()`: 로그인 자동화
- `logout()`: 로그아웃 자동화
- `generateTestData()`: 테스트 데이터 생성
- `waitForApiResponse()`: API 응답 대기
- `authenticatedPage`: 로그인된 페이지 픽스처
- `adminPage`: 관리자 페이지 픽스처

### 6. **tests/E2E_TEST_GUIDE.md** (4.7KB)
완전한 E2E 테스트 가이드
- 설치 방법
- 테스트 실행 방법 (모든 시나리오)
- 테스트 작성 가이드
- 디버깅 팁
- CI/CD 통합 예시
- 자주 사용하는 명령어

### 7. **.gitignore** (수정)
Playwright 테스트 결과 제외
```
test-results/
playwright-report/
playwright/.cache/
```

---

## 🚀 빠른 시작 (3단계)

### Step 1: 의존성 설치
```bash
cd /path/to/arco-web
npm install
```

### Step 2: Playwright 브라우저 설치
```bash
npx playwright install
```

### Step 3: 테스트 실행
```bash
# 개발 서버 실행 (터미널 1)
npm run dev

# UI 모드로 테스트 (터미널 2)
npm run test:e2e:ui
```

---

## 🎯 주요 명령어

### 테스트 실행
```bash
# 모든 테스트 (헤드리스)
npm run test:e2e

# UI 모드 (시각적 디버깅)
npm run test:e2e:ui

# 브라우저 보이게 실행
npm run test:e2e:headed

# 디버그 모드
npm run test:e2e:debug

# 특정 브라우저만
npx playwright test --project=chromium
```

### 테스트 생성
```bash
# 자동 코드 생성
npm run test:e2e:codegen

# 특정 페이지에서 시작
npx playwright codegen http://localhost:3000/products
```

### 리포트
```bash
# HTML 리포트 열기
npm run test:e2e:report
```

---

## 🧪 테스트 예시

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

test('should view profile', async ({ page }) => {
  await login(page, 'user@example.com', 'password');
  await page.goto('/profile');
  await expect(page).toHaveURL(/\/profile/);
});
```

### 인증된 사용자 테스트
```typescript
import { test, expect } from './helpers';

test('should access orders', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/orders');
  await expect(authenticatedPage).toHaveURL(/\/orders/);
});
```

---

## 📋 테스트 대상 페이지

| 페이지 | 테스트 파일 | 주요 시나리오 |
|-------|-----------|-------------|
| 홈페이지 | `home.spec.ts` | 로딩, 네비게이션, 반응형 |
| 상품 목록 | `products.spec.ts` | 목록, 필터, 검색, 상세 |
| 로그인/가입 | `auth.spec.ts` | 로그인, 회원가입, 검증 |

---

## 🎨 테스트 선택자 권장 순서

### 1. data-testid (가장 안정적)
```typescript
page.locator('[data-testid="product-item"]')
```

### 2. 역할 기반
```typescript
page.getByRole('button', { name: /로그인/ })
```

### 3. 레이블 기반
```typescript
page.getByLabel(/이메일/)
```

### 4. 텍스트 기반
```typescript
page.getByText('장바구니')
```

---

## 🏗️ 프로젝트 구조

```
arco-web/
├── playwright.config.ts          # Playwright 설정
├── tests/
│   ├── E2E_TEST_GUIDE.md        # 완전한 가이드
│   └── e2e/
│       ├── home.spec.ts          # 홈페이지 테스트
│       ├── products.spec.ts      # 상품 테스트
│       ├── auth.spec.ts          # 인증 테스트
│       └── helpers.ts            # 공통 헬퍼
├── test-results/                 # 테스트 결과 (gitignore)
└── playwright-report/            # HTML 리포트 (gitignore)
```

---

## 🔧 환경 변수 (선택사항)

`.env.test.local` 파일 생성:
```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000
TEST_EMAIL=test@arco.com
TEST_PASSWORD=test1234
ADMIN_EMAIL=admin@arco.com
ADMIN_PASSWORD=admin1234
```

---

## 🐛 디버깅

### UI 모드 (권장)
```bash
npm run test:e2e:ui
```
- 시각적으로 테스트 실행
- 단계별 실행 가능
- 스크린샷 즉시 확인
- 선택자 확인 가능

### 디버그 모드
```bash
npm run test:e2e:debug
```
- 브레이크포인트 설정
- 단계별 실행
- 콘솔 로그 확인

### 트레이스 뷰어
```bash
npx playwright show-trace test-results/trace.zip
```

---

## 📊 CI/CD 통합

### GitHub Actions 예시
```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run dev &
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🎯 다음 단계

### 1. 즉시 실행 (5분)
```bash
# 1. 설치
npm install
npx playwright install

# 2. 서버 실행
npm run dev  # 터미널 1

# 3. UI 모드로 테스트
npm run test:e2e:ui  # 터미널 2
```

### 2. 컴포넌트에 testid 추가
```tsx
// 예: 상품 카드
<div data-testid="product-item">
  <h3 data-testid="product-name">{name}</h3>
  <button data-testid="add-to-cart">담기</button>
</div>
```

### 3. 추가 테스트 작성
- 장바구니 페이지
- 주문/결제 플로우
- 마이페이지
- 관리자 대시보드

### 4. CI/CD 통합
- GitHub Actions 설정
- 자동 테스트 실행
- PR마다 테스트

---

## 📚 참고 자료

- **완전한 가이드**: `tests/E2E_TEST_GUIDE.md`
- **Playwright 공식 문서**: https://playwright.dev
- **Best Practices**: https://playwright.dev/docs/best-practices
- **API Reference**: https://playwright.dev/docs/api/class-playwright

---

## 🎉 완료!

**✅ Playwright E2E 테스트 환경 구축 완료**

**커밋**: 054c565  
**GitHub**: https://github.com/chalcadak/arco-web

**지금 바로 시작하세요!** 🚀

```bash
npm install && npx playwright install
npm run dev  # 터미널 1
npm run test:e2e:ui  # 터미널 2
```
