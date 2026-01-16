# 🚨 Supabase Service Role Key - Permission Denied 해결 가이드

## 📋 현재 상황

- **테스트 스크립트**: `test-supabase.mjs`
- **사용 키**: `SUPABASE_SERVICE_ROLE_KEY` ✅ (올바름)
- **에러**: `permission denied for table categories` (에러 코드: 42501)
- **문제**: SERVICE_ROLE_KEY를 사용해도 RLS로 인해 접근이 차단됨

---

## 🔍 문제 분석

### SERVICE_ROLE_KEY란?

- **일반 키 (ANON_KEY)**: RLS 정책을 따름 (일반 사용자 권한)
- **서비스 롤 키 (SERVICE_ROLE_KEY)**: RLS를 **우회**해야 함 (관리자 권한)

### 현재 문제

SERVICE_ROLE_KEY를 사용하고 있음에도 불구하고 `permission denied` 에러가 발생하는 이유:

1. **RLS가 활성화**되어 있지만
2. **service_role에 대한 정책이 없거나**
3. **service_role에 대한 권한이 제대로 설정되지 않음**

---

## ✅ 해결 방법 1: RLS 정책 추가 (권장)

RLS를 활성화한 상태에서 `service_role`이 모든 작업을 할 수 있도록 정책을 추가합니다.

### Dashboard에서 실행

1. **SQL Editor 열기**
   ```
   https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
   ```

2. **다음 SQL 실행** (복사 & 붙여넣기)

```sql
-- ============================================================================
-- Grant full access to service_role on all tables
-- ============================================================================
-- This allows SERVICE_ROLE_KEY to bypass RLS policies for testing/admin tasks
-- ============================================================================

-- Grant ALL privileges to service_role (if not already granted)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Create admin bypass policies for service_role
-- These policies allow service_role to do anything, bypassing RLS

-- Categories
DROP POLICY IF EXISTS "service_role_full_access_categories" ON categories;
CREATE POLICY "service_role_full_access_categories"
ON categories
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Products
DROP POLICY IF EXISTS "service_role_full_access_products" ON products;
CREATE POLICY "service_role_full_access_products"
ON products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Photoshoot Looks
DROP POLICY IF EXISTS "service_role_full_access_photoshoot_looks" ON photoshoot_looks;
CREATE POLICY "service_role_full_access_photoshoot_looks"
ON photoshoot_looks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Bookings
DROP POLICY IF EXISTS "service_role_full_access_bookings" ON bookings;
CREATE POLICY "service_role_full_access_bookings"
ON bookings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Orders
DROP POLICY IF EXISTS "service_role_full_access_orders" ON orders;
CREATE POLICY "service_role_full_access_orders"
ON orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Verify
SELECT 'Service role policies created successfully!' as status;
```

3. **실행 확인**
   - "Service role policies created successfully!" 메시지 확인

4. **테스트**
   ```bash
   npm run test:supabase
   ```

---

## ✅ 해결 방법 2: RLS 비활성화 (테스트 전용, 비권장)

**⚠️ 경고**: 프로덕션 환경에서는 절대 사용하지 마세요!

```sql
-- Temporarily disable RLS for testing (NOT RECOMMENDED FOR PRODUCTION!)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
```

테스트 완료 후 다시 활성화:
```sql
-- Re-enable RLS after testing
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

---

## ✅ 해결 방법 3: 마이그레이션 파일에 추가

기존 RLS 마이그레이션 파일에 service_role 정책을 추가합니다.

**파일**: `supabase/migrations/20260116090920_enable_rls_and_policies.sql`

다음 섹션을 추가:

```sql
-- ============================================================================
-- STEP 5: Create service_role bypass policies (for testing and admin access)
-- ============================================================================

-- Service role needs full access for testing and administrative tasks

-- Categories
CREATE POLICY "service_role_full_access_categories"
ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Products
CREATE POLICY "service_role_full_access_products"
ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Photoshoot Looks
CREATE POLICY "service_role_full_access_photoshoot_looks"
ON photoshoot_looks FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Bookings
CREATE POLICY "service_role_full_access_bookings"
ON bookings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Orders
CREATE POLICY "service_role_full_access_orders"
ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);
```

그 후:
```bash
npx supabase db push --include-all
```

---

## 🔍 디버깅 방법

### 1. RLS 상태 확인

Dashboard SQL Editor에서 실행:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('categories', 'products', 'photoshoot_looks', 'bookings', 'orders');
```

예상 결과:
```
tablename           | rowsecurity
--------------------+-------------
categories          | true
products            | true
photoshoot_looks    | true
bookings            | true
orders              | true
```

### 2. 정책 확인

```sql
SELECT tablename, policyname, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

예상: `service_role`에 대한 정책이 있어야 함

### 3. 권한 확인

```sql
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'categories'
  AND grantee IN ('service_role', 'postgres');
```

예상: service_role이 SELECT, INSERT, UPDATE, DELETE 권한을 가져야 함

---

## 📊 예상 결과

### 해결 후 테스트 결과

```bash
$ npm run test:supabase

🚀 ARCO Supabase 연동 테스트 시작...

🔐 테스트 모드: SERVICE_ROLE_KEY 사용 (RLS 우회)

📋 1단계: 환경 변수 확인
   ✅ NEXT_PUBLIC_SUPABASE_URL: https://xlclmfgsijexddigxvzz...
   ✅ SUPABASE_SERVICE_ROLE_KEY: eyJhbGci...
   🔑 Using SERVICE_ROLE_KEY (bypasses RLS for testing)

📡 2단계: Supabase 클라이언트 생성
   ✅ 클라이언트 생성 완료 (SERVICE_ROLE_KEY 사용)

🗄️  3단계: 데이터베이스 연결 테스트

📦 categories 테이블 조회 중...
   ✅ categories: 7개 조회 성공
   📋 샘플 데이터:
      • 아우터 (outer)
      • 이너웨어 (innerwear)
      • 액세서리 (accessories)

📦 products 테이블 조회 중...
   ✅ products: 0개 조회 성공
   ⚠️  제품 데이터가 없습니다.

📦 photoshoot_looks 테이블 조회 중...
   ✅ photoshoot_looks: 0개 조회 성공
   ⚠️  촬영룩 데이터가 없습니다.

📦 bookings 테이블 조회 중...
   ✅ bookings: 0개 조회 성공
   ℹ️  예약 데이터가 없습니다 (정상 - 아직 예약이 없을 수 있음).

📦 orders 테이블 조회 중...
   ✅ orders: 0개 조회 성공
   ℹ️  주문 데이터가 없습니다 (정상 - 아직 주문이 없을 수 있음).

============================================================
📊 테스트 요약

전체: 5/5 테이블 조회 성공

✅ categories           7개 조회 성공
✅ products             0개 조회 성공
✅ photoshoot_looks     0개 조회 성공
✅ bookings             0개 조회 성공
✅ orders               0개 조회 성공

============================================================

🎉 모든 테이블 조회 성공! Supabase 연동이 정상적으로 작동합니다!
```

---

## 🎯 권장 순서

1. ✅ **해결 방법 1** (Dashboard에서 SQL 실행) - 가장 빠름 (1분)
2. ✅ **테스트 실행** (`npm run test:supabase`) - 성공 확인
3. ✅ **해결 방법 3** (마이그레이션 파일에 추가) - 영구적 해결

---

## 📚 관련 문서

- `docs/DEBUG_RLS_CHECK.sql` - RLS 디버깅 쿼리
- `docs/RLS_MIGRATION_FINAL.md` - RLS 마이그레이션 가이드
- `supabase/migrations/20260116090920_enable_rls_and_policies.sql` - RLS 정책 파일

---

## 🔑 핵심 포인트

1. **SERVICE_ROLE_KEY는 RLS를 우회**해야 하지만
2. **RLS 정책에 service_role을 명시**하지 않으면 우회되지 않음
3. **해결**: service_role에 대한 BYPASS 정책 추가

---

**상태**: 🔴 문제 발견 → 해결 방법 제시  
**다음 단계**: Dashboard에서 SQL 실행  
**예상 소요 시간**: 1분

---

**작성일**: 2026-01-16
