# 🚀 Supabase DB Push 가이드 (npx supabase db push)

> **최적화 완료**: 증분 마이그레이션 파일만 유지 (12개)

---

## ✅ **준비 완료**

### **마이그레이션 파일 현황**
```
supabase/migrations/
├── 20260110000001_initial_schema.sql              # 초기 스키마
├── 20260110000002_rls_policies.sql                # RLS 정책
├── 20260112000001_create_orders_table.sql         # 주문 테이블
├── 20260112000002_add_video_uid.sql               # 동영상 UID
├── 20260114000001_create_reviews_table.sql        # 리뷰
├── 20260114000002_create_stock_notifications_table.sql
├── 20260114000003_create_profiles_table.sql       # 프로필
├── 20260114000004_create_coupons_tables.sql       # 쿠폰
├── 20260114000005_create_inquiries_table.sql      # 문의
├── 20260114000006_update_orders_workflow.sql      # 주문 워크플로우
├── 20260114000007_add_orders_missing_columns.sql  # 주문 컬럼 추가
└── 20260114000008_add_user_roles.sql              # 사용자 역할
```

**✅ 총 12개 파일**  
**❌ 중복 파일 삭제 완료**:
- ~~99999999999998_fix_rls_recursion.sql~~
- ~~99999999999999_complete_fresh_install.sql~~

---

## 🔑 **Step 1: .env.local 설정**

### **필수 환경 변수**
```bash
# .env.local 파일에 추가

# Supabase 연결 정보
SUPABASE_ACCESS_TOKEN=your-access-token-here
SUPABASE_DB_PASSWORD=your-database-password-here
SUPABASE_PROJECT_REF=uuiresymwsjpamntmkyb

# 또는 연결 문자열 직접 입력
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.uuiresymwsjpamntmkyb.supabase.co:5432/postgres
```

### **Access Token 발급 방법**

1. **Supabase Dashboard 접속**
   ```bash
   open https://supabase.com/dashboard/account/tokens
   ```

2. **Personal Access Token 생성**
   - `Generate New Token` 클릭
   - Name: `arco-migration`
   - Scope: `All` 선택
   - `Generate Token` 클릭
   - **⚠️ 토큰 즉시 복사** (다시 볼 수 없음!)

3. **.env.local에 저장**
   ```bash
   SUPABASE_ACCESS_TOKEN=sbp_1234567890abcdef...
   ```

---

## 🚀 **Step 2: 마이그레이션 실행**

### **방법 1: npx supabase db push (권장)**

```bash
# 프로젝트 디렉토리로 이동
cd /path/to/arco-web

# Supabase 로그인 (한 번만)
npx supabase login

# 프로젝트 연결
npx supabase link --project-ref uuiresymwsjpamntmkyb

# 마이그레이션 푸시
npx supabase db push

# ✅ 성공 메시지:
# Applying migration 20260110000001_initial_schema.sql...
# Applying migration 20260110000002_rls_policies.sql...
# ...
# Done.
```

---

### **방법 2: Database URL 직접 연결**

```bash
# .env.local 설정
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.uuiresymwsjpamntmkyb.supabase.co:5432/postgres

# 마이그레이션 푸시
npx supabase db push --db-url $DATABASE_URL
```

---

## 🧪 **Step 3: 검증**

### **1. 테이블 생성 확인**

```bash
# Supabase Dashboard → SQL Editor
open https://supabase.com/dashboard/project/uuiresymwsjpamntmkyb/editor
```

```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ✅ 예상 결과: 12개 테이블
-- bookings, categories, coupon_usage, coupons, inquiries,
-- orders, photoshoot_looks, products, profiles, reviews,
-- stock_notifications, users
```

---

### **2. 마이그레이션 히스토리 확인**

```sql
-- 적용된 마이그레이션 확인
SELECT version, name, executed_at
FROM supabase_migrations.schema_migrations
ORDER BY executed_at DESC;

-- ✅ 12개 마이그레이션 확인
```

---

### **3. 로컬 앱 테스트**

```bash
# 개발 서버 실행
npm run dev

# 테스트 페이지 접속
open http://localhost:3000/test

# ✅ 환경 변수 확인
# ✅ Supabase 연결 확인
```

---

## 📊 **전체 프로세스 요약**

```bash
# 1. Supabase 로그인
npx supabase login

# 2. 프로젝트 연결
npx supabase link --project-ref uuiresymwsjpamntmkyb

# 3. 마이그레이션 푸시
npx supabase db push

# 4. 검증
open https://supabase.com/dashboard/project/uuiresymwsjpamntmkyb/editor

# 5. 로컬 테스트
npm run dev
open http://localhost:3000/test
```

**⏱️ 예상 시간**: 5-10분

---

## 🚨 **트러블슈팅**

### **문제 1: "Login required"**

**원인**: Supabase 로그인 필요

**해결:**
```bash
npx supabase login

# 브라우저에서 인증 완료
# ✅ Logged in.
```

---

### **문제 2: "Project not found"**

**원인**: 프로젝트 연결 안 됨

**해결:**
```bash
# 프로젝트 재연결
npx supabase link --project-ref uuiresymwsjpamntmkyb

# 비밀번호 입력 (Dashboard → Settings → Database)
```

---

### **문제 3: "Migration already applied"**

**원인**: 마이그레이션이 이미 적용됨

**해결:**
```bash
# 마이그레이션 상태 확인
npx supabase migration list

# 특정 마이그레이션 강제 재적용 (주의!)
npx supabase db push --force
```

---

### **문제 4: "Permission denied"**

**원인**: 데이터베이스 권한 부족

**해결:**
```bash
# Service Role Key 확인
# Dashboard → Settings → API → service_role key

# .env.local에 추가
SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

---

## 🔄 **새 마이그레이션 추가**

### **Step 1: 새 마이그레이션 파일 생성**

```bash
# 자동 생성 (타임스탬프 포함)
npx supabase migration new add_feature_xyz

# ✅ 생성됨:
# supabase/migrations/20260115120000_add_feature_xyz.sql
```

---

### **Step 2: SQL 작성**

```sql
-- supabase/migrations/20260115120000_add_feature_xyz.sql

-- 예: 상품에 할인율 추가
ALTER TABLE products 
ADD COLUMN discount_percentage INTEGER DEFAULT 0 
CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

COMMENT ON COLUMN products.discount_percentage IS '할인율 (0-100%)';
```

---

### **Step 3: 푸시**

```bash
# 새 마이그레이션 푸시
npx supabase db push

# ✅ Applying migration 20260115120000_add_feature_xyz.sql...
# ✅ Done.
```

---

## 📚 **명령어 치트시트**

```bash
# 로그인
npx supabase login

# 프로젝트 연결
npx supabase link --project-ref PROJECT_REF

# 마이그레이션 푸시
npx supabase db push

# 마이그레이션 목록
npx supabase migration list

# 새 마이그레이션 생성
npx supabase migration new NAME

# 마이그레이션 강제 재적용
npx supabase db push --force

# 프로젝트 상태 확인
npx supabase status

# 로그아웃
npx supabase logout
```

---

## 💡 **Best Practices**

### **1. 마이그레이션 전 백업**
```bash
# Supabase Dashboard → Database → Backups
# "Create backup" 클릭
```

### **2. 테스트 DB에서 먼저 테스트**
```bash
# 테스트 프로젝트 연결
npx supabase link --project-ref YOUR-TEST-PROJECT

# 마이그레이션 푸시
npx supabase db push

# ✅ 문제 없으면 운영 DB에 적용
```

### **3. Git 커밋과 함께**
```bash
# 마이그레이션 파일 생성
npx supabase migration new add_feature

# SQL 작성 후 커밋
git add supabase/migrations/
git commit -m "feat: Add new feature migration"

# 푸시
npx supabase db push
git push origin main
```

### **4. 마이그레이션 파일 순서 유지**
- ✅ 타임스탬프 순서대로 적용
- ✅ 의존성 있는 마이그레이션은 순서 고려
- ✅ 절대 과거 타임스탬프 파일 수정하지 않기

---

## 🎯 **지금 바로 시작하기 (5분)**

```bash
# 1. 프로젝트로 이동
cd /path/to/arco-web

# 2. Git 최신화
git pull origin main

# 3. Supabase 로그인
npx supabase login

# 4. 프로젝트 연결
npx supabase link --project-ref uuiresymwsjpamntmkyb

# 5. 마이그레이션 푸시
npx supabase db push

# 6. 검증
open https://supabase.com/dashboard/project/uuiresymwsjpamntmkyb/editor
```

---

## 📖 **참고 문서**

- **Supabase CLI**: https://supabase.com/docs/guides/cli
- **Migrations**: https://supabase.com/docs/guides/cli/local-development#database-migrations
- **DB Push**: https://supabase.com/docs/reference/cli/supabase-db-push

---

## ✅ **체크리스트**

- [ ] Supabase 로그인 (`npx supabase login`)
- [ ] 프로젝트 연결 (`npx supabase link`)
- [ ] 마이그레이션 파일 확인 (12개)
- [ ] 백업 생성 (Dashboard)
- [ ] 마이그레이션 푸시 (`npx supabase db push`)
- [ ] 테이블 생성 확인 (SQL Editor)
- [ ] 로컬 앱 테스트 (npm run dev)

---

## 🎉 **완료!**

이제 `npx supabase db push`로 **깔끔하게 마이그레이션**할 수 있습니다!

**다음 단계:**
1. ✅ 테스트 데이터 추가
2. ✅ 관리자 계정 설정
3. ✅ 앱 기능 테스트
4. ✅ Vercel 배포

---

**💬 질문이나 문제가 있으신가요?**
- 문서 확인: `docs/SUPABASE_MIGRATION_TEST.md`
- GitHub Issues: https://github.com/chalcadak/arco-web/issues
