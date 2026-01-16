# 🔧 RLS 활성화 및 정책 적용 (완전판)

## 🚨 문제 진단

**증상**: 정책을 만들었는데도 여전히 "permission denied"

**원인**: RLS 정책은 있지만 **테이블의 RLS가 비활성화** 상태

---

## ✅ 해결 방법: Dashboard에서 실행

### Step 1: Dashboard SQL Editor 열기
```
https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
```

### Step 2: 아래 **전체 SQL**을 복사해서 실행

```sql
-- ============================================================================
-- ARCO RLS 완전 설정: 활성화 + 정책 생성
-- ============================================================================

-- 1단계: 기존 정책 삭제 (중복 방지)
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "products_public_read" ON products;
DROP POLICY IF EXISTS "photoshoot_looks_public_read" ON photoshoot_looks;
DROP POLICY IF EXISTS "bookings_user_read" ON bookings;
DROP POLICY IF EXISTS "bookings_anonymous_insert" ON bookings;
DROP POLICY IF EXISTS "orders_user_read" ON orders;
DROP POLICY IF EXISTS "orders_anonymous_insert" ON orders;

-- 2단계: RLS 활성화 (중요!)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 3단계: 공개 테이블 정책 생성
CREATE POLICY "categories_public_read" 
  ON categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "products_public_read" 
  ON products 
  FOR SELECT 
  USING (true);

CREATE POLICY "photoshoot_looks_public_read" 
  ON photoshoot_looks 
  FOR SELECT 
  USING (true);

-- 4단계: 비공개 테이블 정책 생성
-- Bookings: 읽기는 본인 이메일, 생성은 누구나
CREATE POLICY "bookings_user_read" 
  ON bookings 
  FOR SELECT 
  USING (
    customer_email = (auth.jwt()->>'email')::text
    OR (auth.jwt()->>'role')::text = 'admin'
  );

CREATE POLICY "bookings_anonymous_insert" 
  ON bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Orders: 읽기는 본인 user_id/email, 생성은 누구나
CREATE POLICY "orders_user_read" 
  ON orders 
  FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR customer_email = (auth.jwt()->>'email')::text
    OR (auth.jwt()->>'role')::text = 'admin'
  );

CREATE POLICY "orders_anonymous_insert" 
  ON orders 
  FOR INSERT 
  WITH CHECK (true);

-- 완료 메시지
SELECT 'RLS 활성화 및 정책 생성 완료!' as status;
```

### Step 3: Run 버튼 클릭

**예상 결과**:
```
status: RLS 활성화 및 정책 생성 완료!
```

---

## 🔍 검증 방법

### 1. RLS 활성화 확인
```sql
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('categories', 'products', 'photoshoot_looks', 'bookings', 'orders')
ORDER BY tablename;
```

**예상 결과**: 모두 `rls_enabled = true` ✅

### 2. 정책 목록 확인
```sql
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**예상 결과**: 7개 정책이 보여야 함
- categories_public_read
- products_public_read
- photoshoot_looks_public_read
- bookings_user_read
- bookings_anonymous_insert
- orders_user_read
- orders_anonymous_insert

### 3. 공개 데이터 조회 테스트
```sql
-- 이 쿼리들이 모두 성공해야 함
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM photoshoot_looks;
```

### 4. 로컬 테스트
```bash
npm run test:supabase
```

**예상 결과**:
```
✅ Categories: 7 개
✅ Products: X 개
✅ Photoshoot Looks: X 개
❌ Bookings: 0 개 (비로그인이라 정상)
❌ Orders: 0 개 (비로그인이라 정상)
```

---

## 🎯 핵심 포인트

### RLS 정책만으로는 부족!

```sql
-- ❌ 이것만 하면 안됨
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- ✅ RLS를 먼저 활성화해야 함
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
```

### RLS 활성화 + 정책 = 완료

| 단계 | 명령어 | 효과 |
|-----|--------|------|
| 1 | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` | 테이블에 RLS 활성화 |
| 2 | `CREATE POLICY ...` | 접근 규칙 정의 |
| 3 | 테스트 | 정상 작동 확인 ✅ |

---

## 🐛 여전히 문제가 있다면

### 문제 1: "permission denied" 계속 발생

**확인**:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'categories';
```

**결과**:
- `rowsecurity = false` → RLS가 비활성화됨 (문제!)
- `rowsecurity = true` → RLS가 활성화됨 (정상)

**해결**:
```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
```

---

### 문제 2: "policy already exists"

**해결**: 기존 정책 삭제 후 재생성
```sql
DROP POLICY IF EXISTS "categories_public_read" ON categories;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
```

---

### 문제 3: 일부 테이블만 작동

**원인**: 일부 테이블은 RLS가 활성화되었지만 다른 테이블은 비활성화

**해결**: 모든 테이블에 RLS 활성화
```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

---

## 📋 체크리스트

실행 전:
- [ ] Dashboard SQL Editor 열림
- [ ] 위의 완전한 SQL 복사함

실행 중:
- [ ] SQL 전체를 Editor에 붙여넣음
- [ ] Run 버튼 클릭
- [ ] "RLS 활성화 및 정책 생성 완료!" 메시지 확인

실행 후:
- [ ] RLS 활성화 확인 (모두 `true`)
- [ ] 정책 목록 확인 (7개)
- [ ] 공개 데이터 조회 테스트 (성공)
- [ ] `npm run test:supabase` 실행
- [ ] Categories, Products, Photoshoot Looks 성공 확인 ✅

---

## 🎉 성공 기준

```bash
npm run test:supabase
```

**성공 결과**:
```
✅ Categories: 7 개          ← 성공!
✅ Products: X 개             ← 성공!
✅ Photoshoot Looks: X 개     ← 성공!
❌ Bookings: 0 개            ← 정상 (비로그인)
❌ Orders: 0 개              ← 정상 (비로그인)
```

---

## 💡 왜 이렇게 해야 하나?

### Supabase RLS 작동 방식

```
1. 테이블에 RLS 활성화
   ↓
2. 정책이 없으면 모든 접근 거부 (기본값)
   ↓
3. 정책을 만들면 정책에 따라 접근 허용
```

### 순서가 중요

```sql
-- ❌ 잘못된 순서: 정책만 만들고 RLS 활성화 안함
CREATE POLICY ... 
-- 결과: permission denied (RLS가 비활성화되어 정책이 작동 안함)

-- ✅ 올바른 순서: RLS 활성화 → 정책 생성
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...
-- 결과: 정책에 따라 접근 허용
```

---

## 🚀 지금 바로 실행!

**Dashboard**: https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor

**위의 완전한 SQL을 복사해서 실행하세요!**

3분이면 완료됩니다! ⚡
