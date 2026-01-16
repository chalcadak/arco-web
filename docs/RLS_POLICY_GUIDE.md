# 🔒 RLS 정책 추가 가이드

## 📋 개요

Supabase 테스트에서 "Permission denied" 오류가 발생하는 이유는 RLS(Row Level Security) 정책이 없기 때문입니다. 이 가이드는 적절한 RLS 정책을 추가하여 공개 데이터와 비공개 데이터를 구분하는 방법을 안내합니다.

---

## 🎯 목표

### 공개 데이터 (누구나 조회 가능)
- ✅ `categories` - 카테고리 목록
- ✅ `products` - 상품 목록
- ✅ `photoshoot_looks` - 촬영룩 목록

### 비공개 데이터 (본인만 조회 가능)
- 🔒 `bookings` - 예약 내역 (customer_email로 확인)
- 🔒 `orders` - 주문 내역 (user_id 또는 customer_email로 확인)

---

## 🚀 실행 방법

### Option 1: Dashboard SQL Editor (권장) ⭐

#### Step 1: Dashboard 열기
```
https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
```

#### Step 2: SQL 복사
아래 전체 SQL을 복사하세요:

```sql
-- ============================================================================
-- Add RLS Policies for ARCO Database
-- ============================================================================

-- Categories: Public read access
CREATE POLICY "categories_public_read" 
  ON categories 
  FOR SELECT 
  USING (true);

-- Products: Public read access
CREATE POLICY "products_public_read" 
  ON products 
  FOR SELECT 
  USING (true);

-- Photoshoot looks: Public read access
CREATE POLICY "photoshoot_looks_public_read" 
  ON photoshoot_looks 
  FOR SELECT 
  USING (true);

-- Bookings: Users can view their own bookings by email
CREATE POLICY "bookings_user_read" 
  ON bookings 
  FOR SELECT 
  USING (
    customer_email = (auth.jwt()->>'email')::text
    OR (auth.jwt()->>'role')::text = 'admin'
  );

-- Bookings: Anyone can create bookings
CREATE POLICY "bookings_anonymous_insert" 
  ON bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Orders: Users can view their own orders by user_id or email
CREATE POLICY "orders_user_read" 
  ON orders 
  FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR customer_email = (auth.jwt()->>'email')::text
    OR (auth.jwt()->>'role')::text = 'admin'
  );

-- Orders: Anyone can create orders
CREATE POLICY "orders_anonymous_insert" 
  ON orders 
  FOR INSERT 
  WITH CHECK (true);

-- Comments
COMMENT ON POLICY "categories_public_read" ON categories 
  IS 'Allow everyone to view all categories';
COMMENT ON POLICY "products_public_read" ON products 
  IS 'Allow everyone to view all products';
COMMENT ON POLICY "photoshoot_looks_public_read" ON photoshoot_looks 
  IS 'Allow everyone to view all photoshoot looks';
COMMENT ON POLICY "bookings_user_read" ON bookings 
  IS 'Allow users to view bookings by their email or admins to view all';
COMMENT ON POLICY "orders_user_read" ON orders 
  IS 'Allow users to view orders by user_id or email, or admins to view all';
```

#### Step 3: SQL Editor에 붙여넣기 후 실행
1. SQL Editor 탭 선택
2. 위 SQL 전체를 복사해서 붙여넣기
3. **Run** 버튼 클릭 또는 `Ctrl+Enter`

#### Step 4: 성공 확인
다음과 같은 메시지가 표시되어야 합니다:
```
Success. No rows returned
```

---

### Option 2: npx supabase db push

#### Step 1: Supabase 로그인
```bash
npx supabase login
```

#### Step 2: 프로젝트 연결
```bash
npx supabase link --project-ref xlclmfgsijexddigxvzz
```

#### Step 3: 마이그레이션 적용
```bash
npx supabase db push
```

**예상 출력**:
```
Applying migration 20260116084708_add_rls_policies.sql...
Done.
```

---

## ✅ 검증 방법

### 1. Dashboard에서 확인
```sql
-- RLS 정책 목록 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**예상 결과**: 8개 정책이 표시되어야 합니다
- categories_public_read
- products_public_read
- photoshoot_looks_public_read
- bookings_user_read
- bookings_anonymous_insert
- orders_user_read
- orders_anonymous_insert

### 2. 테스트 실행
```bash
npm run test:supabase
```

**예상 결과**:
```
✅ Categories: 7 rows (성공)
✅ Products: X rows (성공)
✅ Photoshoot Looks: X rows (성공)
❌ Bookings: Permission denied (예상됨 - 비로그인 상태)
❌ Orders: Permission denied (예상됨 - 비로그인 상태)
```

### 3. 공개 데이터 직접 확인
```sql
-- Categories 조회 (익명 사용자)
SELECT * FROM categories LIMIT 5;

-- Products 조회 (익명 사용자)
SELECT * FROM products LIMIT 5;

-- Photoshoot looks 조회 (익명 사용자)
SELECT * FROM photoshoot_looks LIMIT 5;
```

모두 성공해야 합니다!

---

## 📊 RLS 정책 상세

### Categories, Products, Photoshoot Looks
```sql
POLICY FOR SELECT USING (true)
```
- **의미**: 모든 사용자(익명 포함)가 조회 가능
- **적용 대상**: 공개 카탈로그 데이터

### Bookings
```sql
-- Read: Email 기반
POLICY FOR SELECT USING (
  customer_email = (auth.jwt()->>'email')::text
  OR (auth.jwt()->>'role')::text = 'admin'
)

-- Insert: 누구나 가능
POLICY FOR INSERT WITH CHECK (true)
```
- **Read**: 본인 이메일과 일치하거나 관리자만 조회
- **Insert**: 익명 사용자도 예약 생성 가능
- **이유**: bookings 테이블에 user_id 컬럼이 없음

### Orders
```sql
-- Read: User ID 또는 Email 기반
POLICY FOR SELECT USING (
  auth.uid() = user_id 
  OR customer_email = (auth.jwt()->>'email')::text
  OR (auth.jwt()->>'role')::text = 'admin'
)

-- Insert: 누구나 가능
POLICY FOR INSERT WITH CHECK (true)
```
- **Read**: user_id 일치, 이메일 일치, 또는 관리자만 조회
- **Insert**: 익명 사용자도 주문 생성 가능
- **이유**: 
  - 로그인 사용자: user_id로 조회
  - 비로그인 사용자: customer_email로 조회

---

## 🐛 문제 해결

### 문제 1: "Permission denied" 여전히 발생
**원인**: RLS 정책이 적용되지 않음

**해결**:
1. Dashboard에서 정책 존재 확인
2. 테이블의 RLS가 활성화되어 있는지 확인:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('categories', 'products', 'photoshoot_looks');
```
모두 `rowsecurity = true`여야 합니다.

### 문제 2: 정책 생성 시 오류
**원인**: 정책 이름 중복

**해결**:
```sql
-- 기존 정책 삭제 후 재생성
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "products_public_read" ON products;
DROP POLICY IF EXISTS "photoshoot_looks_public_read" ON photoshoot_looks;

-- 그 다음 정책 생성 SQL 실행
```

### 문제 3: Bookings/Orders는 여전히 실패
**이유**: 정상입니다!

비로그인 상태에서는 bookings와 orders를 조회할 수 없습니다. 이는 의도된 동작입니다.

**확인 방법**:
```sql
-- 로그인 사용자로 테스트 (Dashboard에서)
SELECT * FROM bookings 
WHERE customer_email = 'your-email@example.com';
```

---

## 🎯 다음 단계

### 1. 즉시 (5분)
- [ ] Dashboard SQL Editor 열기
- [ ] RLS 정책 SQL 복사 & 실행
- [ ] `npm run test:supabase` 실행
- [ ] Categories, Products, Photoshoot Looks 조회 성공 확인 ✅

### 2. 선택사항
- [ ] 추가 테이블에도 RLS 정책 적용
  - reviews, coupons, inquiries 등
- [ ] 관리자 전용 정책 추가
- [ ] Update/Delete 정책 추가

---

## 📚 참고 자료

- **마이그레이션 파일**: `supabase/migrations/20260116084708_add_rls_policies.sql`
- **Supabase RLS 문서**: https://supabase.com/docs/guides/auth/row-level-security
- **Dashboard**: https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz

---

## 🎉 완료!

RLS 정책을 적용하면:
- ✅ 공개 데이터(categories, products, photoshoot_looks)는 누구나 조회 가능
- ✅ 비공개 데이터(bookings, orders)는 본인만 조회 가능
- ✅ 테스트 통과! 🚀

**지금 바로 Dashboard에서 SQL을 실행하세요!**
