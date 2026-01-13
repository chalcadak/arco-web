# 🚀 ARCO Supabase 연동 테스트 가이드

**작성일:** 2026-01-12  
**프로젝트:** ARCO Web Application  
**목적:** Supabase 연동 상태를 빠르게 확인하는 방법

---

## 📋 목차

1. [개요](#개요)
2. [사전 준비](#사전-준비)
3. [테스트 방법](#테스트-방법)
4. [테스트 결과 해석](#테스트-결과-해석)
5. [문제 해결](#문제-해결)
6. [추가 정보](#추가-정보)

---

## 🎯 개요

ARCO 프로젝트의 Supabase 연동 상태를 **3초 안에** 확인할 수 있는 자동화된 테스트 도구입니다.

### 테스트 항목
- ✅ 환경 변수 확인 (SUPABASE_URL, ANON_KEY)
- ✅ 데이터베이스 연결 상태
- ✅ 모든 핵심 테이블 접근 가능 여부
- ✅ 샘플 데이터 존재 여부

### 특징
- 🚀 **빠름**: 3초 안에 완료
- 🎯 **정확**: 모든 테이블 자동 체크
- 📊 **명확**: 성공/실패 한눈에 확인
- 🔧 **간편**: 한 줄 명령으로 실행

---

## 📦 사전 준비

### 1. 환경 변수 설정

`.env.local` 파일에 다음 변수들이 설정되어 있어야 합니다:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. 환경 변수 확인 방법

**Supabase 대시보드에서:**
1. https://supabase.com/dashboard 접속
2. ARCO 프로젝트 선택
3. Settings > API 메뉴 클릭
4. 다음 정보 확인:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (비밀, 절대 노출 금지)

### 3. 로컬에서 환경 변수 확인

```bash
cd arco-web
cat .env.local | grep SUPABASE
```

---

## 🧪 테스트 방법

### 방법 1: npm 스크립트 사용 (추천)

```bash
cd arco-web
npm run test:supabase
```

**장점:**
- ✅ 가장 간단
- ✅ package.json에 정의됨
- ✅ CI/CD 파이프라인에 추가 가능

### 방법 2: npx 직접 실행

```bash
cd arco-web
npx tsx test-supabase.mjs
```

**장점:**
- ✅ 별도 설치 불필요
- ✅ 일회성 테스트에 적합
- ✅ tsx가 자동으로 설치됨

### 방법 3: Node.js 직접 실행

```bash
cd arco-web
node test-supabase.mjs
```

**주의:** ES Module을 지원하는 Node.js 버전(v14+)이 필요합니다.

---

## 📊 테스트 결과 해석

### ✅ 성공 예시

```
🚀 ARCO Supabase 연동 테스트 시작...

📋 1단계: 환경 변수 확인
   ✅ NEXT_PUBLIC_SUPABASE_URL: https://uuiresymwsjpamntmkyb.s...
   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...

📡 2단계: Supabase 클라이언트 생성
   ✅ 클라이언트 생성 완료

🗄️  3단계: 데이터베이스 연결 테스트
   📦 categories 테이블 조회 중...
   ✅ categories: 5개 조회 성공
   📋 샘플 데이터: 아우터
   📦 products 테이블 조회 중...
   ✅ products: 4개 조회 성공
   📋 샘플 데이터: 클래식 코튼 티셔츠
   📦 photoshoot_looks 테이블 조회 중...
   ✅ photoshoot_looks: 3개 조회 성공
   📋 샘플 데이터: 빈티지 에디토리얼
   📦 bookings 테이블 조회 중...
   ✅ bookings: 0개 조회 성공
   📦 orders 테이블 조회 중...
   ✅ orders: 0개 조회 성공

✅ 모든 테스트 완료!

📊 요약:
   - Categories: ✅ 5 개
   - Products: ✅ 4 개
   - Photoshoot Looks: ✅ 3 개
   - Bookings: ✅ 0 개
   - Orders: ✅ 0 개

🎉 Supabase 연동이 정상적으로 작동합니다!
```

**해석:**
- ✅ 모든 환경 변수가 올바르게 설정됨
- ✅ 데이터베이스 연결 성공
- ✅ 모든 테이블에 정상 접근 가능
- ✅ 샘플 데이터가 존재함 (Categories, Products, Photoshoot Looks)
- ✅ Bookings와 Orders는 0개 (아직 사용자가 만들지 않음, 정상)

### ❌ 실패 예시 1: 환경 변수 누락

```
🚀 ARCO Supabase 연동 테스트 시작...

📋 1단계: 환경 변수 확인
❌ 환경 변수가 설정되지 않았습니다!
   NEXT_PUBLIC_SUPABASE_URL: ❌ 없음
   NEXT_PUBLIC_SUPABASE_ANON_KEY: ❌ 없음
```

**해결 방법:**
1. `.env.local` 파일이 존재하는지 확인
2. 파일 내용에 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 있는지 확인
3. Supabase 대시보드에서 올바른 값 복사
4. `.env.local` 파일에 저장

### ❌ 실패 예시 2: 테이블 접근 실패

```
🗄️  3단계: 데이터베이스 연결 테스트
   📦 categories 테이블 조회 중...
   ❌ categories 테이블 조회 실패: relation "public.categories" does not exist
```

**해결 방법:**
1. Supabase 대시보드 > SQL Editor 접속
2. `supabase/migrations/20260110000001_initial_schema.sql` 파일 실행
3. 모든 테이블이 생성되었는지 확인
4. 테스트 재실행

### ❌ 실패 예시 3: RLS 정책 에러

```
🗄️  3단계: 데이터베이스 연결 테스트
   📦 products 테이블 조회 중...
   ❌ products 테이블 조회 실패: new row violates row-level security policy
```

**해결 방법:**
1. Supabase 대시보드 > Authentication > Policies
2. RLS 정책이 올바르게 설정되었는지 확인
3. 개발 환경에서는 RLS를 임시로 비활성화할 수 있습니다 (프로덕션에서는 금지):
   ```sql
   ALTER TABLE products DISABLE ROW LEVEL SECURITY;
   ```

---

## 🔧 문제 해결

### 문제 1: `.env.local` 파일을 찾을 수 없습니다

**증상:**
```
⚠️  .env.local 파일을 읽을 수 없습니다: ENOENT: no such file or directory
```

**해결 방법:**
1. 프로젝트 루트 디렉토리에 `.env.local` 파일 생성
2. `.env.example` 파일을 복사하여 사용:
   ```bash
   cp .env.example .env.local
   ```
3. `.env.local` 파일에 올바른 값 입력

### 문제 2: tsx를 찾을 수 없습니다

**증상:**
```
sh: 1: tsx: not found
```

**해결 방법:**
```bash
npm install -D tsx
```

### 문제 3: 네트워크 연결 오류

**증상:**
```
❌ 오류 발생: fetch failed
```

**해결 방법:**
1. 인터넷 연결 확인
2. Supabase 서비스 상태 확인: https://status.supabase.com
3. 방화벽/VPN 설정 확인
4. Supabase URL이 올바른지 확인 (https:// 포함)

### 문제 4: API 키가 잘못되었습니다

**증상:**
```
❌ categories 테이블 조회 실패: Invalid API key
```

**해결 방법:**
1. Supabase 대시보드에서 API 키 재확인
2. `.env.local` 파일에 복사한 키가 완전한지 확인 (줄바꿈 없이)
3. 키의 앞뒤 공백 제거
4. 파일 저장 후 테스트 재실행

---

## 📚 추가 정보

### 테스트 스크립트 구조

`test-supabase.mjs` 파일은 다음 단계로 동작합니다:

1. **환경 변수 로드**: `.env.local` 파일에서 환경 변수 읽기
2. **클라이언트 생성**: Supabase 클라이언트 인스턴스 생성
3. **테이블 조회**: 각 테이블에 대해 `SELECT` 쿼리 실행
4. **결과 출력**: 성공/실패 여부와 데이터 개수 표시

### 커스터마이징

더 많은 테이블을 테스트하고 싶다면 `test-supabase.mjs` 파일을 수정하세요:

```javascript
// 새 테이블 테스트 추가
console.log('   📦 my_custom_table 테이블 조회 중...');
const { data: customData, error: customError } = await supabase
  .from('my_custom_table')
  .select('*')
  .limit(5);

if (customError) {
  console.error('   ❌ my_custom_table 테이블 조회 실패:', customError.message);
} else {
  console.log('   ✅ my_custom_table:', customData.length + '개 조회 성공');
}
```

### CI/CD 통합

GitHub Actions나 다른 CI/CD 파이프라인에서 사용하려면:

```yaml
# .github/workflows/test.yml
name: Test Supabase Connection

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test:supabase
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

### 테스트 데이터 삽입

테스트를 위해 샘플 데이터가 필요하다면:

```bash
# Supabase SQL Editor에서 실행
INSERT INTO categories (name, slug, type, description) VALUES
  ('아우터', 'outer', 'product', '반려견 아우터'),
  ('이너웨어', 'innerwear', 'product', '반려견 이너웨어'),
  ('액세서리', 'accessory', 'product', '반려견 액세서리');

INSERT INTO products (name, slug, description, price, category_id, stock_quantity, is_active)
SELECT 
  '클래식 코튼 티셔츠',
  'classic-cotton-tshirt',
  '편안한 일상복',
  29000,
  id,
  100,
  true
FROM categories WHERE slug = 'innerwear' LIMIT 1;
```

---

## 🎯 다음 단계

Supabase 연동이 정상적으로 확인되었다면:

1. **로컬 개발 서버 시작**
   ```bash
   npm run dev
   ```

2. **브라우저에서 확인**
   - http://localhost:3000 (홈페이지)
   - http://localhost:3000/products (상품 목록)
   - http://localhost:3000/photoshoots (촬영룩 목록)
   - http://localhost:3000/admin/login (관리자 로그인)

3. **전체 Phase 1-6 테스트 진행**
   - [LOCAL_TEST_REPORT.md](./LOCAL_TEST_REPORT.md) 참고

4. **Vercel 배포**
   - [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) 참고

---

## 📞 문의 및 지원

**프로젝트 저장소:** https://github.com/chalcadak/arco-web  
**브랜치:** genspark_ai_developer  
**담당:** GenSpark AI Developer

**이슈 발생 시:**
1. 위 문제 해결 섹션 참고
2. GitHub Issues에 보고
3. 테스트 결과 스크린샷 첨부

---

## 📝 변경 이력

**2026-01-12**
- 초기 버전 작성
- npm 스크립트 추가 (`test:supabase`)
- tsx 의존성 추가
- 전체 테이블 테스트 구현
- 문제 해결 가이드 추가

---

## 🎉 요약

이제 **3초 안에** Supabase 연동을 확인할 수 있습니다!

```bash
npm run test:supabase
```

**결과:**
- ✅ Categories: 5개
- ✅ Products: 4개
- ✅ Photoshoot Looks: 3개
- ✅ Bookings: 0개
- ✅ Orders: 0개

🎊 **Supabase 연동이 정상적으로 작동합니다!**
