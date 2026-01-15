# 🧪 Supabase 마이그레이션 로컬 테스트 가이드

> **중요**: 이 프로젝트는 Prisma가 아닌 **Supabase를 직접 사용**합니다!

---

## 📋 **테스트 준비**

### 1️⃣ **Supabase CLI 설치**

```bash
# macOS
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase

# NPM (모든 OS)
npm install -g supabase
```

**설치 확인:**
```bash
supabase --version
# ✅ Supabase CLI 1.x.x
```

---

## 🚀 **방법 1: 원격 Supabase DB에 직접 적용 (권장)**

### **장점**
- ✅ 간단하고 빠름
- ✅ Supabase Dashboard에서 바로 확인 가능
- ✅ 로컬 Docker 불필요

### **Step 1: Supabase Dashboard에서 SQL 실행**

1. **Supabase Dashboard 접속**
   - URL: https://supabase.com/dashboard
   - 프로젝트 선택: `uuiresymwsjpamntmkyb` (현재 DB)

2. **SQL Editor 열기**
   - 왼쪽 메뉴 → `SQL Editor` 클릭

3. **마이그레이션 파일 내용 복사**

   **Option A: 완전 초기화 (Fresh Install)**
   ```bash
   # 로컬에서 파일 내용 보기
   cat supabase/migrations/99999999999999_complete_fresh_install.sql
   ```
   - 전체 복사 → SQL Editor에 붙여넣기 → `Run` 클릭

   **Option B: 특정 마이그레이션만 적용**
   ```bash
   # 예: 리뷰 테이블만 추가
   cat supabase/migrations/20260114000001_create_reviews_table.sql
   ```

4. **결과 확인**
   - `Success` 메시지 확인
   - 왼쪽 메뉴 → `Table Editor`에서 테이블 생성 확인

---

### **Step 2: 로컬에서 확인**

```bash
# 개발 서버 실행
npm run dev

# 브라우저 열기
open http://localhost:3000/test

# ✅ 환경 변수 확인
# ✅ Supabase URL: https://uuiresymwsjpamntmkyb.supabase.co
```

---

## 🐳 **방법 2: 로컬 Supabase 인스턴스로 테스트**

### **장점**
- ✅ 운영 DB를 건드리지 않음
- ✅ 반복 테스트 가능
- ✅ Git 기반 마이그레이션 히스토리 관리

### **단점**
- ❌ Docker Desktop 필요 (무거움)
- ❌ 초기 셋업 시간 필요

---

### **Step 1: Docker 설치**

**Docker Desktop 설치:**
- macOS/Windows: https://www.docker.com/products/docker-desktop
- Linux: Docker Engine 설치

**Docker 실행 확인:**
```bash
docker --version
# ✅ Docker version 24.x.x
```

---

### **Step 2: Supabase 로컬 초기화**

```bash
# 프로젝트 디렉토리로 이동
cd /path/to/arco-web

# Supabase 로컬 초기화
supabase init

# 기존 설정 유지 (이미 supabase/ 폴더 존재)
```

---

### **Step 3: 로컬 Supabase 시작**

```bash
# Docker 컨테이너 시작 (첫 실행은 5-10분 소요)
supabase start

# ✅ 성공 시 출력:
# Started supabase local development setup.
#
# API URL: http://localhost:54321
# GraphQL URL: http://localhost:54321/graphql/v1
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
# Inbucket URL: http://localhost:54324
# JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
# anon key: eyJh...
# service_role key: eyJh...
```

---

### **Step 4: 마이그레이션 적용**

```bash
# 모든 마이그레이션 파일 적용
supabase db reset

# ✅ 성공 메시지:
# Applying migration 20260110000001_initial_schema.sql...
# Applying migration 20260110000002_rls_policies.sql...
# ...
# Applying migration 99999999999999_complete_fresh_install.sql...
# Done.
```

---

### **Step 5: 로컬 Studio에서 확인**

```bash
# 브라우저 열기
open http://localhost:54323

# ✅ Supabase Studio에서 확인:
# - Table Editor → 모든 테이블 생성 확인
# - SQL Editor → 쿼리 테스트
```

---

### **Step 6: 로컬 앱 테스트**

```bash
# .env.local 수정 (로컬 Supabase ���결)
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh... (위 출력값 복사)

# 개발 서버 실행
npm run dev

# 브라우저 열기
open http://localhost:3000/test
```

---

### **Step 7: 로컬 Supabase 중지**

```bash
# 컨테이너 중지 (데이터 유지)
supabase stop

# 컨테이너 삭제 + 데이터 초기화
supabase stop --no-backup
```

---

## 🧪 **마이그레이션 테스트 체크리스트**

### **✅ 필수 확인 사항**

#### **1. 테이블 생성 확인**
```sql
-- Supabase Dashboard → SQL Editor에서 실행
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ✅ 예상 결과:
-- bookings
-- categories
-- coupon_usage
-- coupons
-- inquiries
-- orders
-- photoshoot_looks
-- products
-- profiles
-- reviews
-- stock_notifications
-- users
```

#### **2. RLS 정책 확인**
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ✅ 예상 결과: 각 테이블별 정책 존재
```

#### **3. 관리자 계정 확인**
```sql
SELECT id, email, role 
FROM profiles 
WHERE role = 'admin';

-- ✅ admin@arco.com 계정 확인
```

#### **4. 카테고리 데이터 확인**
```sql
SELECT id, name, slug, type 
FROM categories 
ORDER BY display_order;

-- ✅ 7개 기본 카테고리 존재
```

---

## 🔄 **새 마이그레이션 파일 추가**

### **Step 1: 새 마이그레이션 파일 생성**

```bash
# 타임스탬프 형식의 파일명 생성
supabase migration new add_feature_xyz

# ✅ 생성됨:
# supabase/migrations/20260115120000_add_feature_xyz.sql
```

### **Step 2: SQL 작성**

```sql
-- supabase/migrations/20260115120000_add_feature_xyz.sql

-- 예: 상품에 할인율 컬럼 추가
ALTER TABLE products 
ADD COLUMN discount_percentage INTEGER DEFAULT 0 
CHECK (discount_percentage >= 0 AND discount_percentage <= 100);

COMMENT ON COLUMN products.discount_percentage IS '할인율 (0-100%)';
```

### **Step 3: 테스트**

**로컬 테스트:**
```bash
supabase db reset
```

**원격 적용:**
```bash
# Supabase Dashboard → SQL Editor에서 실행
```

---

## 🚨 **트러블슈팅**

### **문제 1: `supabase: command not found`**

**해결:**
```bash
# NPM 글로벌 설치
npm install -g supabase

# 또는 npx 사용
npx supabase --version
```

---

### **문제 2: Docker 컨테이너 시작 실패**

**해결:**
```bash
# Docker Desktop이 실행 중인지 확인
docker ps

# 기존 컨테이너 정리
supabase stop --no-backup
docker system prune -a

# 다시 시작
supabase start
```

---

### **문제 3: 포트 충돌 (54321, 54322 등)**

**해결:**
```bash
# 사용 중인 포트 확인
lsof -i :54321

# 프로세스 종료
kill -9 <PID>

# 또는 supabase/config.toml에서 포트 변경
```

---

### **문제 4: 마이그레이션 적용 실패**

**해결:**
```bash
# 특정 마이그레이션만 실행
supabase db push

# 또는 수동 실행
psql postgresql://postgres:postgres@localhost:54322/postgres -f supabase/migrations/20260115120000_add_feature_xyz.sql
```

---

## 📊 **권장 워크플로우**

### **개발 단계**
1. ✅ **로컬 Docker 테스트** (방법 2)
   - 새 마이그레이션 파일 작성
   - `supabase db reset`로 반복 테스트
   - 문제 없을 때까지 수정

2. ✅ **원격 테스트 DB 적용**
   - Supabase Dashboard → SQL Editor
   - 테스트 DB에 적용 (`arco-db-test`)

3. ✅ **통합 테스트**
   - 로컬 앱에서 기능 확인
   - API 엔드포인트 테스트

4. ✅ **운영 DB 적용**
   - 최종 검증 후 운영 DB에 적용 (`arco-db-prod`)

---

## 🎯 **빠른 시작 (추천)**

### **지금 당장 테스트하기 (5분)**

```bash
# 1. Supabase Dashboard 접속
open https://supabase.com/dashboard

# 2. SQL Editor 열기
# 왼쪽 메뉴 → SQL Editor

# 3. 테스트 쿼리 실행
SELECT COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

# ✅ 12개 테이블 확인
```

---

## 📚 **추가 리소스**

- **Supabase CLI 문서**: https://supabase.com/docs/guides/cli
- **마이그레이션 가이드**: https://supabase.com/docs/guides/cli/local-development
- **SQL 참고**: https://supabase.com/docs/guides/database

---

## ✅ **완료 체크리스트**

- [ ] Supabase CLI 설치 (`supabase --version`)
- [ ] Docker 설치 (로컬 테스트 시)
- [ ] 로컬 Supabase 시작 (`supabase start`)
- [ ] 마이그레이션 적용 (`supabase db reset`)
- [ ] 로컬 Studio 확인 (http://localhost:54323)
- [ ] 로컬 앱 테스트 (http://localhost:3000/test)
- [ ] 원격 DB 적용 (Supabase Dashboard)

---

## 🚀 **다음 단계**

1. ✅ **테스트 데이터 추가**: `supabase/seed.sql` 실행
2. ✅ **관리자 계정 설정**: `promote_to_admin('admin@arco.com')`
3. ✅ **앱 기능 테스트**: 상품 등록, 주문 테스트
4. ✅ **운영 배포**: Vercel에 배포

---

**💡 팁**: 원격 DB에 바로 적용하는 것이 가장 간단합니다! (방법 1 권장)
