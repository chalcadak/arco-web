# 🚨 npx supabase db push 오류 해결 가이드

## ❌ **현재 문제**

```
ERROR: relation "products" does not exist
```

**원인**: 
- `20260110000001_initial_schema.sql`이 제대로 적용되지 않음
- 테이블들이 생성되지 않은 상태

---

## ✅ **해결 방법 (3가지)**

---

### **방법 1: Supabase Dashboard에서 직접 실행 (가장 간단, 권장)**

#### **Step 1: Dashboard SQL Editor 접속**
```bash
open https://supabase.com/dashboard/project/uuiresymwsjpamntmkyb/editor
```

#### **Step 2: 초기 스키마 실행**

**파일 경로**: `supabase/migrations/20260110000001_initial_schema.sql`

로컬에서 파일 내용 확인:
```bash
cat supabase/migrations/20260110000001_initial_schema.sql
```

**전체 내용을 복사** → SQL Editor에 붙여넣기 → **Run** 클릭

#### **Step 3: 나머지 마이그레이션 파일들 순서대로 실행**

```bash
# 순서대로 복사-붙여넣기-실행
cat supabase/migrations/20260110000002_rls_policies.sql
cat supabase/migrations/20260112000001_create_orders_table.sql
cat supabase/migrations/20260112000002_add_video_uid.sql
cat supabase/migrations/20260114000001_create_reviews_table.sql
cat supabase/migrations/20260114000002_create_stock_notifications_table.sql
cat supabase/migrations/20260114000003_create_profiles_table.sql
cat supabase/migrations/20260114000004_create_coupons_tables.sql
cat supabase/migrations/20260114000005_create_inquiries_table.sql
cat supabase/migrations/20260114000006_update_orders_workflow.sql
cat supabase/migrations/20260114000007_add_orders_missing_columns.sql
cat supabase/migrations/20260114000008_add_user_roles.sql
```

**⏱️ 소요 시간**: 10-15분

---

### **방법 2: 로컬에서 npx supabase db push 재시도**

#### **Step 1: Supabase 재로그인**
```bash
cd /path/to/arco-web

# 로그아웃 후 재로그인
npx supabase logout
npx supabase login

# 브라우저에서 인증 완료
```

#### **Step 2: 프로젝트 재연결**
```bash
# DB 비밀번호 필요 (Dashboard → Settings → Database)
npx supabase link --project-ref uuiresymwsjpamntmkyb

# 비밀번호 입력
```

#### **Step 3: 마이그레이션 푸시**
```bash
npx supabase db push --debug
```

**⏱️ 소요 시간**: 5분

---

### **방법 3: 단일 SQL 파일로 통합 실행**

#### **Step 1: 모든 마이그레이션 통합**

```bash
cd /path/to/arco-web

# 모든 마이그레이션을 하나로 합치기
cat supabase/migrations/*.sql > /tmp/all_migrations.sql

# 파일 확인
ls -lh /tmp/all_migrations.sql
```

#### **Step 2: Dashboard에서 실행**

1. `/tmp/all_migrations.sql` 파일 열기
2. 전체 내용 복사
3. Dashboard SQL Editor에 붙여넣기
4. Run 클릭

**⚠️ 주의**: 에러 발생 시 어느 부분에서 실패했는지 확인 어려움

**⏱️ 소요 시간**: 3분

---

## 🧪 **검증 방법**

### **테이블 생성 확인**

```sql
-- Dashboard SQL Editor에서 실행
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ✅ 예상 결과: 12개 이상의 테이블
```

### **주요 테이블 확인**
```sql
-- 각 테이블 존재 여부 확인
SELECT 'users' as table_name, COUNT(*) as exists FROM information_schema.tables WHERE table_name = 'users'
UNION ALL
SELECT 'products', COUNT(*) FROM information_schema.tables WHERE table_name = 'products'
UNION ALL
SELECT 'orders', COUNT(*) FROM information_schema.tables WHERE table_name = 'orders'
UNION ALL
SELECT 'categories', COUNT(*) FROM information_schema.tables WHERE table_name = 'categories'
UNION ALL
SELECT 'profiles', COUNT(*) FROM information_schema.tables WHERE table_name = 'profiles';

-- ✅ 모두 1이어야 함
```

---

## 🚨 **트러블슈팅**

### **문제 1: "extension already exists"**

**해결**: 무시해도 됨 (NOTICE 레벨)

### **문제 2: "relation already exists"**

**해결**: 
```sql
-- 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS table_name CASCADE;
```

**⚠️ 주의**: 데이터 손실 가능! 운영 DB에서는 절대 실행하지 말 것

### **문제 3: "foreign key constraint fails"**

**원인**: 테이블 생성 순서 문제

**해결**: 참조되는 테이블부터 먼저 생성
```
categories → products, photoshoot_looks
users → admin_users, orders
```

### **문제 4: RLS 정책 오류**

**해결**: RLS 정책은 나중에 적용
```sql
-- 테이블 생성 먼저
CREATE TABLE ...

-- RLS는 마지막에
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...
```

---

## 📊 **권장 순서**

### **1단계: 기본 테이블 (의존성 없음)**
```
✅ categories
✅ users
```

### **2단계: 참조 테이블**
```
✅ products (→ categories)
✅ photoshoot_looks (→ categories)
✅ admin_users (→ users)
```

### **3단계: 트랜잭션 테이블**
```
✅ orders
✅ order_items (→ orders)
✅ bookings
```

### **4단계: 추가 테이블**
```
✅ reviews
✅ stock_notifications
✅ profiles
✅ coupons
✅ coupon_usage
✅ inquiries
```

### **5단계: RLS 정책 & 인덱스**
```
✅ ALTER TABLE ... ENABLE ROW LEVEL SECURITY
✅ CREATE POLICY ...
✅ CREATE INDEX ...
```

---

## 🎯 **추천 방법**

### **지금 당장 해결하려면**
👉 **방법 1: Dashboard SQL Editor** (가장 확실)

### **나중에 자동화하려면**
👉 **방법 2: npx supabase db push** (재로그인 필요)

---

## 📚 **참고 파일**

- **전체 스키마**: `supabase/migrations/20260110000001_initial_schema.sql`
- **RLS 정책**: `supabase/migrations/20260110000002_rls_policies.sql`
- **Orders**: `supabase/migrations/20260112000001_create_orders_table.sql`

---

## 💡 **핵심 팁**

1. **Dashboard SQL Editor가 가장 확실**: 오류 메시지 즉시 확인
2. **한 번에 하나씩**: 파일 단위로 실행하면 어디서 실패했는지 파악 쉬움
3. **백업 먼저**: 운영 DB라면 반드시 백업 후 진행
4. **테스트 DB 활용**: 테스트 DB에서 먼저 실행 후 운영 DB 적용

---

## ✅ **성공 확인**

```sql
-- 테이블 개수 확인
SELECT COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- ✅ 예상: 12개 이상
```

```sql
-- 샘플 데이터 확인
SELECT COUNT(*) as category_count FROM categories;
-- ✅ 예상: 7개 (기본 카테고리)
```

---

## 🎉 **완료 후**

```bash
# 로컬 앱 테스트
npm run dev
open http://localhost:3000/test

# ✅ Supabase 연결 확인
# ✅ 테이블 데이터 조회 확인
```

---

**💬 대표님께**

가장 빠른 방법은 **Dashboard SQL Editor에서 직접 실행**하는 것입니다!

1. https://supabase.com/dashboard/project/uuiresymwsjpamntmkyb/editor
2. `supabase/migrations/20260110000001_initial_schema.sql` 내용 복사
3. SQL Editor에 붙여넣기
4. Run 클릭
5. 나머지 파일들 순서대로 반복

이렇게 하면 10-15분 안에 모든 테이블이 생성됩니다! 🚀
