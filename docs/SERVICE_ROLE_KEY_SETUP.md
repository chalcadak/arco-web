# 🔧 Supabase Test Script - SERVICE_ROLE_KEY Setup Guide

## 📋 Overview

The `test-supabase.mjs` script has been **already configured** to use `SUPABASE_SERVICE_ROLE_KEY` instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY` to bypass RLS (Row Level Security) for testing purposes.

## ✅ Current Configuration

### 1. Environment Variables (`.env.local`)

```env
# ✅ Already configured
NEXT_PUBLIC_SUPABASE_URL=https://xlclmfgsijexddigxvzz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Test Script (`test-supabase.mjs`)

```javascript
// ✅ Already using SERVICE_ROLE_KEY
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,  // ← Not ANON_KEY!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

## ⚠️ Current Issue: Permission Denied

Even with `SERVICE_ROLE_KEY`, you're seeing:

```
❌ permission denied for table categories (SQLSTATE 42501)
```

### 🔍 Root Cause

**RLS is enabled on tables, but policies haven't been applied yet!**

- When RLS is enabled without policies → **ALL access denied** (even SERVICE_ROLE_KEY)
- When RLS is enabled WITH policies → SERVICE_ROLE_KEY bypasses RLS

### 📊 What's Happening

```sql
-- Current state in your database:
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ❌ NO policies created yet!

-- Expected state:
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
-- ✅ Now it works!
```

## 🚀 Solution: Apply RLS Migration

### Option 1: Dashboard SQL Editor (Recommended - 2 minutes)

1. **Open SQL Editor**
   ```
   https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
   ```

2. **Copy Migration File**
   - Open: `supabase/migrations/20260116090920_enable_rls_and_policies.sql`
   - Copy entire contents (Ctrl+A, Ctrl+C)

3. **Paste and Run**
   - Paste into SQL Editor
   - Click "Run" button
   - Wait for success message

4. **Verify**
   ```bash
   npm run test:supabase
   ```

### Option 2: CLI (Alternative - requires setup)

```bash
# 1. Link project (IPv4 setup)
npx supabase link --project-ref xlclmfgsijexddigxvzz

# 2. Push migrations
npx supabase db push --include-all

# 3. Verify
npm run test:supabase
```

## 📝 Migration File Contents

The migration file `20260116090920_enable_rls_and_policies.sql` contains:

### STEP 1: Enable RLS
```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

### STEP 2: Drop Existing Policies (Idempotent)
```sql
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "products_public_read" ON products;
-- ... (7 policies total)
```

### STEP 3: Create Public Read Policies
```sql
CREATE POLICY "categories_public_read" ON categories
FOR SELECT USING (true);

CREATE POLICY "products_public_read" ON products
FOR SELECT USING (true);

CREATE POLICY "photoshoot_looks_public_read" ON photoshoot_looks
FOR SELECT USING (true);
```

### STEP 4: Create Private Policies
```sql
-- Bookings: Owner or admin can read
CREATE POLICY "bookings_user_read" ON bookings
FOR SELECT
USING (
  customer_email = (auth.jwt()->>'email')::text
  OR (auth.jwt()->>'role')::text = 'admin'
);

-- Bookings: Anyone can create (guest checkout)
CREATE POLICY "bookings_anonymous_insert" ON bookings
FOR INSERT WITH CHECK (true);

-- Orders: Similar policies
-- ...
```

## ✅ Expected Results After Migration

### Test Output
```bash
$ npm run test:supabase

🚀 ARCO Supabase 연동 테스트 시작...
🔐 테스트 모드: SERVICE_ROLE_KEY 사용 (RLS 우회)

📋 1단계: 환경 변수 확인
   ✅ NEXT_PUBLIC_SUPABASE_URL: https://xlclmfgsijexddigxvzz.supabase.co...
   ✅ SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   🔑 Using SERVICE_ROLE_KEY (bypasses RLS for testing)

📡 2단계: Supabase 클라이언트 생성
   ✅ 클라이언트 생성 완료 (SERVICE_ROLE_KEY 사용)

🔍 2.5단계: SERVICE_ROLE_KEY 권한 확인
   ✅ SERVICE_ROLE_KEY 권한 정상 확인됨

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

## 🔍 Debugging Tips

### Check Current RLS Status

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('categories', 'products', 'photoshoot_looks', 'bookings', 'orders');

-- Expected: rowsecurity = true for all
```

### Check Existing Policies

```sql
-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected: 7 policies
-- - categories_public_read
-- - products_public_read
-- - photoshoot_looks_public_read
-- - bookings_user_read
-- - bookings_anonymous_insert
-- - orders_user_read
-- - orders_anonymous_insert
```

### Temporarily Disable RLS (Testing Only!)

```sql
-- ⚠️ ONLY FOR TESTING! Not for production!
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Test again
-- Then re-enable with:
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ... (apply policies after)
```

## 🎯 Summary

### What's Already Done ✅
- [x] Test script uses `SUPABASE_SERVICE_ROLE_KEY`
- [x] `.env.local` has `SUPABASE_SERVICE_ROLE_KEY` configured
- [x] Migration file ready (`20260116090920_enable_rls_and_policies.sql`)
- [x] Test script has proper error handling

### What You Need to Do 📝
1. [ ] Open Supabase Dashboard SQL Editor
2. [ ] Copy and run migration file
3. [ ] Run `npm run test:supabase`
4. [ ] Verify all tables return success

### Key Concept 💡

```
SERVICE_ROLE_KEY = Admin key that bypasses RLS
ANON_KEY = Public key that respects RLS

For testing: Use SERVICE_ROLE_KEY ✅
For production: Use ANON_KEY ✅
```

---

**Status**: ✅ Script configured correctly, migration needed  
**Next Step**: Apply RLS migration via Dashboard  
**ETA**: 2 minutes

---

**Related Files**:
- Test script: `test-supabase.mjs`
- Migration: `supabase/migrations/20260116090920_enable_rls_and_policies.sql`
- Env file: `.env.local`
- Documentation: `docs/RLS_MIGRATION_FINAL.md`
