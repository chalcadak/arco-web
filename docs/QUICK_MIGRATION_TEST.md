# 🚀 Supabase 마이그레이션 빠른 테스트 (5분)

> **가장 간단한 방법**: Supabase Dashboard에서 직접 SQL 실행

---

## ⚡ **5분 완성 가이드**

### **Step 1: Supabase Dashboard 접속 (30초)**

```bash
# 브라우저 열기
open https://supabase.com/dashboard
```

1. 로그인
2. 프로젝트 선택: `uuiresymwsjpamntmkyb`

---

### **Step 2: SQL Editor 열기 (10초)**

1. 왼쪽 메뉴 → **`SQL Editor`** 클릭
2. 새 쿼리 생성: **`New query`** 버튼 클릭

---

### **Step 3: 테스트 쿼리 실행 (30초)**

**현재 테이블 목록 확인:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**실행:** `Run` 버튼 클릭 (또는 `Cmd/Ctrl + Enter`)

**✅ 예상 결과:**
```
bookings
categories
coupon_usage
coupons
inquiries
orders
photoshoot_looks
products
profiles
reviews
stock_notifications
users
```

---

### **Step 4: 완전 초기화 (선택사항, 3분)**

**⚠️ 주의**: 기존 데이터가 삭제됩니다!

**Option A: 전체 스키마 재설치**
```bash
# 로컬에서 파일 내용 보기
cat supabase/migrations/99999999999999_complete_fresh_install.sql

# 전체 복사 → SQL Editor에 붙여넣기 → Run
```

**Option B: 특정 마이그레이션만 실행**
```bash
# 예: 리뷰 테이블만 추가
cat supabase/migrations/20260114000001_create_reviews_table.sql

# 복사 → SQL Editor에 붙여넣기 → Run
```

---

### **Step 5: 로컬 앱에서 확인 (1분)**

```bash
# 개발 서버 실행
cd /path/to/arco-web
npm run dev

# 브라우저 열기
open http://localhost:3000/test

# ✅ 환경 변수 확인
# ✅ Supabase URL: https://uuiresymwsjpamntmkyb.supabase.co
```

---

## 🧪 **검증 쿼리 모음**

### **1. 테이블 개수 확인**
```sql
SELECT COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- ✅ 예상: 12개
```

### **2. RLS 정책 확인**
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ✅ 각 테이블별 정책 존재
```

### **3. 관리자 계정 확인**
```sql
SELECT id, email, role 
FROM profiles 
WHERE role = 'admin';

-- ✅ admin@arco.com 확인
```

### **4. 카테고리 데이터 확인**
```sql
SELECT id, name, slug, type 
FROM categories 
ORDER BY display_order;

-- ✅ 7개 기본 카테고리
```

### **5. 관리자 권한 부여**
```sql
-- 기존 사용자를 관리자로 승격
SELECT promote_to_admin('your-email@example.com');

-- ✅ Notice: User promoted to admin
```

---

## 🛠️ **로컬 스크립트 사용 (고급)**

### **마이그레이션 파일 검증만**
```bash
cd /path/to/arco-web
./scripts/test-migration.sh --verify

# ✅ 출력:
# ✅ 14개의 마이그레이션 파일 발견
# 마이그레이션 파일 목록:
#   - 20260110000001_initial_schema.sql
#   - 20260110000002_rls_policies.sql
#   - ...
```

### **로컬 Docker 테스트 (Docker 필요)**
```bash
./scripts/test-migration.sh --local

# ✅ 자동으로:
# 1. Docker 확인
# 2. Supabase 시작
# 3. 마이그레이션 적용
# 4. 로컬 Studio 접속 안내
```

### **원격 DB 테스트 안내**
```bash
./scripts/test-migration.sh --remote

# ✅ 단계별 안내 표시
```

---

## 📊 **테스트 체크리스트**

- [ ] Supabase Dashboard 접속 성공
- [ ] SQL Editor 쿼리 실행 성공
- [ ] 12개 테이블 생성 확인
- [ ] RLS 정책 적용 확인
- [ ] 관리자 계정 확인 (admin@arco.com)
- [ ] 카테고리 데이터 7개 확인
- [ ] 로컬 앱 테스트 페이지 확인

---

## 🚨 **문제 해결**

### **문제 1: "relation already exists" 오류**

**원인**: 테이블이 이미 존재함

**해결:**
```sql
-- 기존 테이블 삭제 (⚠️ 데이터 손실!)
DROP TABLE IF EXISTS table_name CASCADE;

-- 또는 전체 초기화
```

### **문제 2: "permission denied" 오류**

**원인**: 관리자 권한 부족

**해결:**
- Supabase Dashboard의 Project Owner 계정으로 로그인
- Service Role Key 사용

### **문제 3: RLS 정책 충돌**

**원인**: 기존 정책과 중복

**해결:**
```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS policy_name ON table_name;

-- 새 정책 생성
```

---

## 🎯 **권장 워크플로우**

### **개발 중**
1. ✅ SQL Editor에서 빠르게 테스트
2. ✅ 작동 확인 후 마이그레이션 파일로 저장

### **배포 전**
1. ✅ 로컬 Docker로 전체 마이그레이션 테스트
2. ✅ 테스트 DB에 적용 (`arco-db-test`)
3. ✅ 통합 테스트 실행

### **운영 배포**
1. ✅ 백업 먼저! (`Supabase Dashboard → Database → Backups`)
2. ✅ 운영 DB에 마이그레이션 적용
3. ✅ 모니터링 및 롤백 준비

---

## 💡 **핵심 팁**

1. **Dashboard SQL Editor가 가장 빠름**: 로컬 Docker 없이 즉시 테스트
2. **RLS는 나중에**: 테이블 생성 먼저, 정책은 검증 후 적용
3. **백업은 필수**: 운영 DB 변경 전 항상 백업
4. **점진적 적용**: 한 번에 하나씩 마이그레이션 테스트

---

## 📚 **참고 파일**

- **상세 가이드**: [docs/SUPABASE_MIGRATION_TEST.md](./SUPABASE_MIGRATION_TEST.md)
- **전체 스키마**: [supabase/migrations/99999999999999_complete_fresh_install.sql](../supabase/migrations/99999999999999_complete_fresh_install.sql)
- **초기 스키마**: [supabase/migrations/20260110000001_initial_schema.sql](../supabase/migrations/20260110000001_initial_schema.sql)

---

## ✅ **완료!**

이제 **Supabase 마이그레이션 테스트**가 완료되었습니다! 🎉

**다음 단계:**
1. ✅ 테스트 데이터 추가 ([supabase/seed.sql](../supabase/seed.sql))
2. ✅ 관리자 계정 설정
3. ✅ 앱 기능 테스트

---

**💬 질문이나 문제가 있으신가요?**
- GitHub Issues: https://github.com/chalcadak/arco-web/issues
- 문서 확인: docs/ 디렉토리
