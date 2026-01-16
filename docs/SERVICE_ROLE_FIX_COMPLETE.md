# ✅ Supabase Service Role Key - Permission Fixed!

## 📋 작업 완료 요약

**문제**: SERVICE_ROLE_KEY를 사용해도 "permission denied" 에러 발생  
**원인**: RLS가 활성화되었지만 service_role에 대한 bypass 정책이 없음  
**해결**: service_role 전체 접근 정책 추가

---

## 🎯 즉시 실행 가능 (1분)

### Dashboard에서 SQL 실행 (가장 빠름!)

1. **SQL Editor 열기**
   ```
   https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
   ```

2. **파일 열기 & 복사**
   - 경로: `docs/QUICK_FIX_SERVICE_ROLE.sql`
   - 전체 내용 복사

3. **SQL Editor에 붙여넣고 Run**

4. **성공 메시지 확인**
   ```
   "Service role policies created successfully! You can now run: npm run test:supabase"
   ```

5. **테스트 실행**
   ```bash
   npm run test:supabase
   ```

---

## 📝 수정된 파일

### 1. 마이그레이션 파일
**파일**: `supabase/migrations/20260116090920_enable_rls_and_policies.sql`

**추가된 내용** (STEP 5):
```sql
-- Service role bypass policies
CREATE POLICY "service_role_full_access_categories"
ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_access_products"
ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ... (bookings, orders, photoshoot_looks도 동일)
```

### 2. 빠른 실행 SQL
**파일**: `docs/QUICK_FIX_SERVICE_ROLE.sql`
- Dashboard에서 바로 실행 가능한 SQL
- GRANT + CREATE POLICY + COMMENT
- 1분 안에 완료 가능

### 3. 상세 가이드
**파일**: `docs/FIX_SERVICE_ROLE_PERMISSION.md`
- 문제 분석
- 3가지 해결 방법
- 디버깅 방법
- 예상 결과

### 4. 디버그 스크립트
**파일**: `docs/DEBUG_RLS_CHECK.sql`
- RLS 상태 확인
- 정책 확인
- 권한 확인

### 5. 테스트 스크립트 (이미 수정됨)
**파일**: `test-supabase.mjs`
- SERVICE_ROLE_KEY 사용 ✅
- 자세한 에러 메시지
- 단계별 진행 상황 표시

---

## 🚀 실행 방법 (선택)

### 방법 1: Dashboard SQL (권장 - 1분)
```bash
# 1. docs/QUICK_FIX_SERVICE_ROLE.sql 내용 복사
# 2. Dashboard SQL Editor에 붙여넣기
# 3. Run 버튼 클릭
# 4. 테스트 실행
npm run test:supabase
```

### 방법 2: CLI 마이그레이션 (3분)
```bash
# 1. 최신 코드 받기
git pull origin main

# 2. 마이그레이션 실행
npx supabase db push --include-all

# 3. 테스트 실행
npm run test:supabase
```

### 방법 3: 개별 테이블 권한 부여 (수동, 비권장)
```sql
-- 각 테이블마다 수동으로 실행
GRANT ALL ON categories TO service_role;
CREATE POLICY "service_role_full_access_categories" 
ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);
-- ... 반복
```

---

## ✅ 예상 결과

### 실행 전 (에러 상태)
```bash
$ npm run test:supabase

❌ categories 테이블 조회 실패: permission denied for table categories
❌ products 테이블 조회 실패: permission denied for table products
❌ photoshoot_looks 테이블 조회 실패: permission denied
❌ bookings 테이블 조회 실패: permission denied
❌ orders 테이블 조회 실패: permission denied

전체: 0/5 테이블 조회 성공
```

### 실행 후 (성공 상태)
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
   ℹ️  예약 데이터가 없습니다 (정상)

📦 orders 테이블 조회 중...
   ✅ orders: 0개 조회 성공
   ℹ️  주문 데이터가 없습니다 (정상)

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

## 🔍 무엇이 변경되었나?

### Before (에러 발생)
```sql
-- RLS 활성화만 함
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 일반 사용자 정책만 생성
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- ❌ service_role 정책 없음!
-- 결과: SERVICE_ROLE_KEY를 사용해도 permission denied
```

### After (정상 작동)
```sql
-- RLS 활성화
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 일반 사용자 정책
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- ✅ service_role bypass 정책 추가!
GRANT ALL ON categories TO service_role;
CREATE POLICY "service_role_full_access_categories"
ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 결과: SERVICE_ROLE_KEY가 RLS를 우회하여 모든 데이터 접근 가능
```

---

## 📊 정책 요약

| 테이블 | 일반 사용자 정책 | service_role 정책 |
|--------|----------------|------------------|
| categories | public read (SELECT) | full access (ALL) |
| products | public read (SELECT) | full access (ALL) |
| photoshoot_looks | public read (SELECT) | full access (ALL) |
| bookings | private (owner/admin) | full access (ALL) |
| orders | private (owner/admin) | full access (ALL) |

**총 정책 수**: 12개
- 일반 사용자: 7개
- service_role: 5개

---

## 🛠️ 트러블슈팅

### 문제: SQL 실행 후에도 에러가 계속됨

**확인사항**:
1. SQL이 정상적으로 실행되었는지 확인
   ```sql
   SELECT policyname FROM pg_policies 
   WHERE tablename = 'categories' 
     AND policyname LIKE '%service_role%';
   ```
   예상: `service_role_full_access_categories` 존재

2. SERVICE_ROLE_KEY가 올바른지 확인
   ```bash
   grep SUPABASE_SERVICE_ROLE_KEY .env.local
   ```

3. 캐시 클리어
   ```bash
   # 테스트 스크립트 재실행
   npm run test:supabase
   ```

### 문제: CLI로 마이그레이션 실행 시 "already exists" 에러

**해결**:
- Dashboard SQL을 먼저 실행한 경우 이미 정책이 생성되어 있음
- 무시해도 됨 (이미 적용됨)
- 또는 `DROP POLICY IF EXISTS`가 이미 포함되어 있으므로 재실행 가능

---

## 📚 관련 파일

### 실행 파일
- `docs/QUICK_FIX_SERVICE_ROLE.sql` - 즉시 실행용 SQL
- `supabase/migrations/20260116090920_enable_rls_and_policies.sql` - 전체 마이그레이션

### 문서
- `docs/FIX_SERVICE_ROLE_PERMISSION.md` - 상세 가이드
- `docs/DEBUG_RLS_CHECK.sql` - 디버깅 쿼리
- `docs/RLS_MIGRATION_FINAL.md` - RLS 마이그레이션 가이드

### 테스트 스크립트
- `test-supabase.mjs` - Supabase 연결 테스트
- `check-rls.mjs` - RLS 상태 확인

---

## 🎯 핵심 포인트

1. **SERVICE_ROLE_KEY는 RLS 우회**해야 하지만
2. **RLS 정책에 명시하지 않으면** 우회되지 않음
3. **해결책**: `FOR ALL TO service_role` 정책 추가
4. **권한도 필요**: `GRANT ALL ON table TO service_role`

---

## ✅ 체크리스트

- [x] service_role 정책 추가 (마이그레이션 파일)
- [x] QUICK_FIX SQL 파일 생성
- [x] 상세 가이드 문서 작성
- [x] Git 커밋 및 푸시 완료
- [ ] **당신**: Dashboard에서 SQL 실행
- [ ] **당신**: `npm run test:supabase` 실행
- [ ] **당신**: 결과 확인 (5/5 성공)

---

## 🚀 다음 단계

1. **즉시 실행** (1분)
   ```
   Dashboard > SQL Editor > QUICK_FIX_SERVICE_ROLE.sql 붙여넣기 > Run
   ```

2. **테스트 검증**
   ```bash
   npm run test:supabase
   ```

3. **성공 확인**
   ```
   ✅ categories: 7개 조회 성공
   ✅ products: 0개 조회 성공
   ... (5/5 테이블 성공)
   🎉 모든 테이블 조회 성공!
   ```

---

**커밋**: 23ea325  
**GitHub**: https://github.com/chalcadak/arco-web  
**상태**: ✅ 수정 완료, Dashboard 실행 대기  
**소요 시간**: 1분 (Dashboard SQL 실행)

---

**이제 Dashboard에서 `QUICK_FIX_SERVICE_ROLE.sql`을 실행하시면 됩니다!** 🎯
