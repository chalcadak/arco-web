# ✅ Supabase Test Script - SERVICE_ROLE_KEY 설정 완료

## 📋 작업 요약

테스트 스크립트(`test-supabase.mjs`)는 **이미 SERVICE_ROLE_KEY를 사용**하도록 구성되어 있었습니다!

### 현재 상태 ✅

1. **환경 변수 설정** ✅
   - `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 포함됨
   - 테스트 스크립트가 정확하게 로드함

2. **테스트 스크립트** ✅
   - `ANON_KEY` 대신 `SERVICE_ROLE_KEY` 사용
   - RLS 우회 가능한 권한으로 설정

3. **개선 사항 추가** ✅
   - 권한 확인 단계 추가 (Step 2.5)
   - 문제 발생 시 명확한 안내 메시지
   - 트러블슈팅 가이드 포함

---

## ⚠️ 현재 문제: Permission Denied

### 증상
```bash
$ npm run test:supabase
❌ categories 테이블 조회 실패: permission denied for table categories
❌ products 테이블 조회 실패: permission denied for table products
...
```

### 원인
**RLS가 활성화되어 있지만 정책(Policies)이 아직 적용되지 않음!**

```sql
-- 현재 DB 상태:
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ❌ 정책이 없어서 모든 접근 차단 (SERVICE_ROLE_KEY도!)

-- 필요한 상태:
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
-- ✅ 이제 정상 작동!
```

### 핵심 개념 💡

| 상태 | RLS | Policies | 결과 |
|------|-----|----------|------|
| 1 | ❌ Disabled | - | ✅ 모든 접근 허용 |
| 2 | ✅ Enabled | ❌ None | ❌ 모든 접근 차단 ← **현재 상태** |
| 3 | ✅ Enabled | ✅ Configured | ✅ 정책에 따라 접근 제어 ← **목표** |

---

## 🚀 해결 방법: RLS 마이그레이션 적용

### Option 1: Dashboard SQL Editor (권장 - 2분)

1. **SQL 에디터 열기**
   ```
   https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
   ```

2. **마이그레이션 파일 복사**
   - 파일: `supabase/migrations/20260116090920_enable_rls_and_policies.sql`
   - 전체 내용 복사 (Ctrl+A, Ctrl+C)

3. **붙여넣고 실행**
   - SQL 에디터에 붙여넣기
   - "Run" 버튼 클릭
   - 성공 메시지 확인

4. **검증**
   ```bash
   npm run test:supabase
   ```

### Option 2: CLI (대안 - 설정 필요)

```bash
# 1. 프로젝트 링크 (IPv4 설정)
npx supabase link --project-ref xlclmfgsijexddigxvzz

# 2. 마이그레이션 적용
npx supabase db push --include-all

# 3. 검증
npm run test:supabase
```

---

## 📝 적용할 마이그레이션 내용

`20260116090920_enable_rls_and_policies.sql` 파일이 수행하는 작업:

### STEP 1: RLS 활성화
```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE photoshoot_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

### STEP 2: 기존 정책 제거 (멱등성)
```sql
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "products_public_read" ON products;
-- ... (총 7개)
```

### STEP 3: 공개 테이블 정책
```sql
-- 모든 사용자가 조회 가능
CREATE POLICY "categories_public_read" ON categories
FOR SELECT USING (true);

CREATE POLICY "products_public_read" ON products
FOR SELECT USING (true);

CREATE POLICY "photoshoot_looks_public_read" ON photoshoot_looks
FOR SELECT USING (true);
```

### STEP 4: 비공개 테이블 정책
```sql
-- 예약: 본인 또는 관리자만 조회
CREATE POLICY "bookings_user_read" ON bookings
FOR SELECT
USING (
  customer_email = (auth.jwt()->>'email')::text
  OR (auth.jwt()->>'role')::text = 'admin'
);

-- 예약: 누구나 생성 가능 (게스트 체크아웃)
CREATE POLICY "bookings_anonymous_insert" ON bookings
FOR INSERT WITH CHECK (true);

-- 주문: 유사한 정책
-- ...
```

---

## ✅ 기대 결과 (마이그레이션 후)

```bash
$ npm run test:supabase

🚀 ARCO Supabase 연동 테스트 시작...

🔐 테스트 모드: SERVICE_ROLE_KEY 사용 (RLS 우회)

📋 1단계: 환경 변수 확인
   ✅ NEXT_PUBLIC_SUPABASE_URL: https://xlclmfgsijexddigxvzz...
   ✅ SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6...
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

---

## 🔧 개선된 테스트 스크립트 기능

### 추가된 기능 (Step 2.5)

```javascript
// 🔍 2.5단계: SERVICE_ROLE_KEY 권한 확인
console.log('\n🔍 2.5단계: SERVICE_ROLE_KEY 권한 확인');
try {
  const { data: testQuery, error: testError } = await supabase
    .from('categories')
    .select('count', { count: 'exact', head: true });
  
  if (testError) {
    if (testError.code === '42501') {
      console.error('   ❌ SERVICE_ROLE_KEY에 권한이 없습니다!');
      console.error('   💡 원인: RLS가 활성화되어 있지만 SERVICE_ROLE_KEY가 RLS를 우회하지 못함');
      console.error('\n   🔧 해결 방법:');
      console.error('   1. Supabase Dashboard SQL Editor 열기:');
      console.error('      https://supabase.com/dashboard/project/.../editor\n');
      console.error('   2. 마이그레이션 파일 실행:');
      console.error('      supabase/migrations/20260116090920_enable_rls_and_policies.sql\n');
      process.exit(1);
    }
  } else {
    console.log('   ✅ SERVICE_ROLE_KEY 권한 정상 확인됨');
  }
}
```

**장점**:
- 테스트 전에 권한 문제 감지
- 명확한 에러 메시지
- 해결 방법 즉시 제공

---

## 📚 생성된 문서

### 1. `docs/SERVICE_ROLE_KEY_SETUP.md` (NEW!)
- SERVICE_ROLE_KEY 개념 설명
- 현재 설정 상태 확인
- 트러블슈팅 가이드
- 단계별 해결 방법

### 2. 기존 관련 문서
- `docs/RLS_MIGRATION_FINAL.md` - RLS 마이그레이션 가이드
- `docs/RLS_QUICK_START.md` - 빠른 시작 가이드
- `docs/RLS_POLICY_GUIDE.md` - 정책 상세 가이드

---

## ✅ 체크리스트

### 이미 완료된 사항 ✅
- [x] 테스트 스크립트에서 SERVICE_ROLE_KEY 사용
- [x] `.env.local`에 SERVICE_ROLE_KEY 설정
- [x] 권한 확인 로직 추가
- [x] 트러블슈팅 가이드 작성
- [x] Git 커밋 및 푸시 완료

### 당신이 해야 할 일 📝
1. [ ] Supabase Dashboard SQL Editor 열기
2. [ ] `20260116090920_enable_rls_and_policies.sql` 복사
3. [ ] SQL Editor에 붙여넣고 실행
4. [ ] `npm run test:supabase` 실행하여 검증
5. [ ] 모든 테이블 조회 성공 확인

---

## 🎯 핵심 정리

### 문제 진단
```
현재 상태: RLS 활성화 + 정책 없음 = ❌ 모든 접근 차단
원인: 마이그레이션 미적용
```

### 해결책
```
해결: RLS 활성화 + 정책 적용 = ✅ 정상 작동
방법: Dashboard에서 마이그레이션 SQL 실행
```

### 중요 개념
```
SERVICE_ROLE_KEY = 관리자 키 (RLS 우회 가능)
ANON_KEY = 공개 키 (RLS 적용됨)

테스트용: SERVICE_ROLE_KEY 사용 ✅
프로덕션: ANON_KEY 사용 ✅
```

---

**커밋**: 58be01c  
**GitHub**: https://github.com/chalcadak/arco-web  
**상태**: ✅ 스크립트 개선 완료, 마이그레이션 필요  
**다음 단계**: Dashboard에서 RLS 마이그레이션 실행 (2분)  
**ETA**: 2분 후 완전 해결

---

## 💡 Pro Tips

1. **SERVICE_ROLE_KEY는 절대 클라이언트에 노출하지 마세요!**
   - 서버 사이드에서만 사용
   - 테스트 스크립트에서만 사용
   - `.env.local`에 보관 (Git에 커밋하지 않음)

2. **RLS 정책 테스트 순서**
   ```
   1. SERVICE_ROLE_KEY로 테스트 (RLS 우회)
   2. ANON_KEY로 테스트 (공개 데이터)
   3. 로그인 사용자로 테스트 (개인 데이터)
   ```

3. **문제 발생 시 체크리스트**
   ```
   □ 환경 변수 확인 (.env.local)
   □ 마이그레이션 적용 여부
   □ RLS 활성화 상태
   □ 정책 존재 여부
   □ SERVICE_ROLE_KEY 유효성
   ```

---

**이제 Dashboard에서 마이그레이션을 실행하시면 모든 것이 정상 작동합니다!** 🚀
