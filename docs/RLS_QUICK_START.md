# 🚀 RLS 정책 추가 완료!

## ✅ 작업 완료

### 📝 생성된 파일
1. **supabase/migrations/20260116084708_add_rls_policies.sql**
   - 8개 RLS 정책 정의
   - 공개 데이터: categories, products, photoshoot_looks
   - 비공개 데이터: bookings, orders

2. **docs/RLS_POLICY_GUIDE.md**
   - 완전한 적용 가이드
   - Dashboard 방법 + CLI 방법
   - 검증 쿼리 포함

### 🎯 정책 요약
| 테이블 | 정책 | 설명 |
|-------|------|------|
| categories | 공개 읽기 | 누구나 조회 가능 |
| products | 공개 읽기 | 누구나 조회 가능 |
| photoshoot_looks | 공개 읽기 | 누구나 조회 가능 |
| bookings | 비공개 읽기 | customer_email로 본인 데이터만 |
| bookings | 공개 생성 | 익명 사용자도 예약 가능 |
| orders | 비공개 읽기 | user_id 또는 customer_email로 본인 데이터만 |
| orders | 공개 생성 | 익명 사용자도 주문 가능 |

---

## 🔥 지금 바로 적용하기 (3분)

### Step 1: Dashboard 열기
```
https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
```

### Step 2: SQL 복사
아래 SQL을 **전체 복사**하세요:

```sql
-- Categories: Public read
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- Products: Public read
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);

-- Photoshoot looks: Public read
CREATE POLICY "photoshoot_looks_public_read" ON photoshoot_looks FOR SELECT USING (true);

-- Bookings: Private read by email
CREATE POLICY "bookings_user_read" ON bookings FOR SELECT 
  USING (customer_email = (auth.jwt()->>'email')::text OR (auth.jwt()->>'role')::text = 'admin');

-- Bookings: Anyone can create
CREATE POLICY "bookings_anonymous_insert" ON bookings FOR INSERT WITH CHECK (true);

-- Orders: Private read by user_id or email
CREATE POLICY "orders_user_read" ON orders FOR SELECT 
  USING (auth.uid() = user_id OR customer_email = (auth.jwt()->>'email')::text OR (auth.jwt()->>'role')::text = 'admin');

-- Orders: Anyone can create
CREATE POLICY "orders_anonymous_insert" ON orders FOR INSERT WITH CHECK (true);
```

### Step 3: SQL Editor에 붙여넣기
1. **SQL Editor** 탭 선택
2. 위 SQL 전체를 복사해서 붙여넣기
3. **Run** 버튼 클릭 (또는 `Ctrl+Enter`)

### Step 4: 성공 확인
```
Success. No rows returned
```
이 메시지가 표시되면 완료!

---

## ✅ 검증하기

### 터미널에서 테스트
```bash
npm run test:supabase
```

### 예상 결과
```
✅ Categories: 7 rows (성공!)
✅ Products: X rows (성공!)
✅ Photoshoot Looks: X rows (성공!)
❌ Bookings: Permission denied (예상됨 - 비로그인)
❌ Orders: Permission denied (예상됨 - 비로그인)
```

### Dashboard에서 직접 확인
```sql
-- 공개 데이터 조회 (성공해야 함)
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM photoshoot_looks;
```

---

## 🐛 문제 발생 시

### "Policy already exists" 오류
기존 정책을 먼저 삭제:
```sql
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "products_public_read" ON products;
DROP POLICY IF EXISTS "photoshoot_looks_public_read" ON photoshoot_looks;
DROP POLICY IF EXISTS "bookings_user_read" ON bookings;
DROP POLICY IF EXISTS "bookings_anonymous_insert" ON bookings;
DROP POLICY IF EXISTS "orders_user_read" ON orders;
DROP POLICY IF EXISTS "orders_anonymous_insert" ON orders;
```

그 다음 다시 생성 SQL 실행

### 여전히 "Permission denied"
RLS가 활성화되어 있는지 확인:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('categories', 'products', 'photoshoot_looks');
```

모두 `rowsecurity = true`여야 합니다.

---

## 📚 상세 문서

**완전한 가이드**: `docs/RLS_POLICY_GUIDE.md`
- Dashboard 방법
- CLI 방법 (`npx supabase db push`)
- 정책 상세 설명
- 문제 해결
- 다음 단계

---

## 🎉 완료!

**커밋**: 054c785  
**GitHub**: https://github.com/chalcadak/arco-web

**지금 바로 Dashboard에서 SQL을 실행하세요!** 🚀

3분이면 완료됩니다! ⚡
