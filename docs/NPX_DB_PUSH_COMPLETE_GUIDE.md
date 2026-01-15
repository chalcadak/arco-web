# 🚀 npx supabase db push 완벽 가이드

> **목표**: 로컬에서 `npx supabase db push`로 마이그레이션 성공시키기

---

## 📋 **준비사항**

### ✅ **환경 변수 설정 완료**
- `.env.local` 파일 생성됨
- Supabase URL: `https://xlclmfgsijexddigxvzz.supabase.co`
- Project Ref: `xlclmfgsijexddigxvzz`

---

## 🔑 **Step 1: Supabase Access Token 발급**

### **방법 A: Dashboard에서 발급 (권장)**

```bash
# 브라우저 열기
open https://supabase.com/dashboard/account/tokens
```

**실행 단계**:
1. **Generate New Token** 클릭
2. **Name**: `arco-cli-access`
3. **Scope**: `All` 선택
4. **Generate Token** 클릭
5. **⚠️ 토큰 즉시 복사** (다시 볼 수 없음!)

**토큰 저장**:
```bash
# .env.local에 추가
echo "SUPABASE_ACCESS_TOKEN=sbp_your_token_here" >> .env.local
```

---

### **방법 B: 환경 변수로 직접 설정**

```bash
# 터미널에서 export (임시)
export SUPABASE_ACCESS_TOKEN=sbp_your_token_here

# 또는 .env.local에 추가 (영구)
echo "SUPABASE_ACCESS_TOKEN=sbp_your_token_here" >> .env.local
```

---

## 🔗 **Step 2: Supabase CLI 로그인**

### **Option A: 토큰으로 로그인 (추천)**

```bash
# 환경 변수 설정
export SUPABASE_ACCESS_TOKEN=sbp_your_token_here

# 로그인 확인
npx supabase projects list

# ✅ 프로젝트 목록이 보이면 성공!
```

---

### **Option B: 브라우저 인증**

```bash
# 로그인 (브라우저 열림)
npx supabase login

# 브라우저에서 인증 완료
# ✅ "Logged in" 메시지 확인
```

---

## 🔗 **Step 3: 프로젝트 연결**

### **데이터베이스 비밀번호 확인**

```bash
# Supabase Dashboard에서 확인
open https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/settings/database
```

**Database Password** 섹션에서 비밀번호 확인

---

### **프로젝트 연결**

```bash
cd /path/to/arco-web

# 프로젝트 연결
npx supabase link --project-ref xlclmfgsijexddigxvzz

# 비밀번호 입력 프롬프트:
# Enter your database password: [비밀번호 입력]

# ✅ "Linked to project" 메시지 확인
```

---

## 🚀 **Step 4: 마이그레이션 푸시**

```bash
# 마이그레이션 적용
npx supabase db push

# ✅ 성공 메시지:
# Applying migration 20260110000001_initial_schema.sql...
# Applying migration 20260110000002_rls_policies.sql...
# Applying migration 20260112000001_create_orders_table.sql...
# Applying migration 20260112000002_add_video_uid.sql...
# Applying migration 20260114000001_create_reviews_table.sql...
# Applying migration 20260114000002_create_stock_notifications_table.sql...
# Applying migration 20260114000003_create_profiles_table.sql...
# Applying migration 20260114000004_create_coupons_tables.sql...
# Applying migration 20260114000005_create_inquiries_table.sql...
# Applying migration 20260114000006_update_orders_workflow.sql...
# Applying migration 20260114000007_add_orders_missing_columns.sql...
# Applying migration 20260114000008_add_user_roles.sql...
# Done.
```

---

## 🧪 **Step 5: 검증**

### **테이블 생성 확인**

```bash
# Supabase Dashboard SQL Editor
open https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
```

```sql
-- 테이블 개수 확인
SELECT COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- ✅ 예상: 12개 이상
```

```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ✅ 예상 결과:
-- bookings, categories, coupon_usage, coupons, 
-- galleries, gallery_images, inquiries, order_items, 
-- orders, photoshoot_looks, products, profiles, 
-- reviews, stock_notifications, users
```

---

### **로컬 앱 테스트**

```bash
# 개발 서버 시작
npm run dev

# 테스트 페이지 접속
open http://localhost:3000/test

# ✅ Supabase 연결 확인
# ✅ 환경 변수 확인
```

---

## 🚨 **트러블슈팅**

### **문제 1: "Access token not provided"**

**원인**: Access token 미설정

**해결**:
```bash
# 토큰 발급 (Dashboard)
open https://supabase.com/dashboard/account/tokens

# 환경 변수 설정
export SUPABASE_ACCESS_TOKEN=sbp_your_token_here

# 또는 로그인
npx supabase login
```

---

### **문제 2: "Project not found"**

**원인**: 프로젝트 연결 안 됨

**해결**:
```bash
# 프로젝트 ID 확인
echo "xlclmfgsijexddigxvzz"

# 재연결
npx supabase link --project-ref xlclmfgsijexddigxvzz
```

---

### **문제 3: "Authentication failed"**

**원인**: 잘못된 DB 비밀번호

**해결**:
```bash
# Dashboard에서 비밀번호 확인
open https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/settings/database

# 프로젝트 재연결
npx supabase unlink
npx supabase link --project-ref xlclmfgsijexddigxvzz
```

---

### **문제 4: "relation does not exist"**

**원인**: 마이그레이션 파일 순서 문제 또는 이전 마이그레이션 실패

**해결**:
```bash
# 디버그 모드로 실행
npx supabase db push --debug

# 실패한 마이그레이션 확인
# Dashboard SQL Editor에서 수동 실행
```

---

### **문제 5: 마이그레이션 일부만 적용됨**

**해결**:
```bash
# 현재 적용된 마이그레이션 확인
npx supabase migration list

# 다시 푸시 (이미 적용된 것은 건너뜀)
npx supabase db push
```

---

## 📊 **전체 명령어 요약**

```bash
# 1. 프로젝트로 이동
cd /path/to/arco-web

# 2. 최신 코드 받기
git pull origin main

# 3. Access Token 설정
export SUPABASE_ACCESS_TOKEN=sbp_your_token_here

# 4. 로그인 (또는 토큰 사용 시 생략 가능)
npx supabase login

# 5. 프로젝트 연결
npx supabase link --project-ref xlclmfgsijexddigxvzz

# 6. 마이그레이션 푸시
npx supabase db push

# 7. 검증
open https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
```

---

## 🎯 **빠른 시작 (복사-붙여넣기)**

```bash
# 환경 설정
cd ~/arco-web
git pull origin main

# Access Token 발급 (한 번만)
open https://supabase.com/dashboard/account/tokens
# → 토큰 복사

# 환경 변수 설정
export SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxx

# 프로젝트 연결 (한 번만)
npx supabase link --project-ref xlclmfgsijexddigxvzz
# → DB 비밀번호 입력

# 마이그레이션 적용
npx supabase db push

# 검증
npx supabase migration list
```

---

## 📁 **프로젝트 정보**

### **Supabase 프로젝트**
- **Project Name**: acro-db-test
- **Project Ref**: `xlclmfgsijexddigxvzz`
- **Project URL**: `https://xlclmfgsijexddigxvzz.supabase.co`
- **Dashboard**: https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz

### **마이그레이션 파일**
```
supabase/migrations/
├── 20260110000001_initial_schema.sql              (12개 테이블)
├── 20260110000002_rls_policies.sql                (RLS 정책)
├── 20260112000001_create_orders_table.sql         (주문)
├── 20260112000002_add_video_uid.sql               (동영상)
├── 20260114000001_create_reviews_table.sql        (리뷰)
├── 20260114000002_create_stock_notifications_table.sql
├── 20260114000003_create_profiles_table.sql       (프로필)
├── 20260114000004_create_coupons_tables.sql       (쿠폰)
├── 20260114000005_create_inquiries_table.sql      (문의)
├── 20260114000006_update_orders_workflow.sql      (워크플로우)
├── 20260114000007_add_orders_missing_columns.sql  (컬럼 추가)
└── 20260114000008_add_user_roles.sql              (역할)
```

**총 12개 마이그레이션 파일**

---

## ✅ **성공 기준**

### **마이그레이션 성공 시**
```
✅ 12개 마이그레이션 파일 모두 적용
✅ "Done" 메시지 출력
✅ 에러 없음
```

### **Dashboard 확인**
```
✅ 12개 이상의 테이블 생성
✅ 카테고리 데이터 7개
✅ RLS 정책 적용
✅ 인덱스 생성
```

### **로컬 앱 테스트**
```
✅ npm run dev 실행
✅ http://localhost:3000/test 접속
✅ Supabase 연결 확인
✅ 환경 변수 정상
```

---

## 🎉 **완료!**

이제 `npx supabase db push`로 마이그레이션을 성공적으로 완료할 수 있습니다!

**다음 단계**:
1. ✅ 테스트 데이터 추가 (`supabase/seed.sql`)
2. ✅ 관리자 계정 설정
3. ✅ 앱 기능 테스트
4. ✅ Vercel 배포

---

**⏱️ 예상 소요 시간**: 10분

**💡 핵심**: Access Token 발급 → 프로젝트 연결 → db push → 완료!
