# 🚀 Supabase 마이그레이션 자동화 가이드

## ✅ 질문의 핵심

> "Vercel 배포 후 테스트하면서 DB 스키마를 수정할 때마다  
> Supabase Dashboard에 수동으로 SQL 실행해야 하나요?"

**답변: 아니요! 자동화 가능합니다! ✨**

---

## 🎯 3가지 마이그레이션 방법

### **방법 1: Supabase CLI (추천 ⭐⭐⭐)**

#### 1) 설치 (이미 완료!)
```bash
npm install --save-dev supabase
npx supabase init
```

#### 2) 프로젝트 연결
```bash
# Supabase 프로젝트 링크
npx supabase link --project-ref uuiresymwsjpamntmkyb

# 프로젝트 ID: uuiresymwsjpamntmkyb
# Database password 입력 필요 (Supabase Dashboard → Settings → Database)
```

#### 3) 마이그레이션 파일 작성
```bash
# 새 마이그레이션 생성
npx supabase migration new add_new_column

# 생성된 파일: supabase/migrations/20260114000009_add_new_column.sql
```

`supabase/migrations/20260114000009_add_new_column.sql`:
```sql
-- 예: orders 테이블에 delivery_memo 컬럼 추가
ALTER TABLE orders ADD COLUMN delivery_memo TEXT;
```

#### 4) 자동으로 적용!
```bash
# 로컬에서 테스트
npx supabase db push

# 또는 원격 DB에 직접 적용
npx supabase db push --linked
```

**결과:**
- ✅ 자동으로 Supabase에 적용
- ✅ 수동으로 SQL 실행 불필요!
- ✅ Git에 마이그레이션 파일 관리 가능

---

### **방법 2: npm 스크립트로 간편하게 (매우 추천 ⭐⭐⭐)**

`package.json`에 추가:
```json
{
  "scripts": {
    "db:push": "supabase db push --linked",
    "db:reset": "supabase db reset --linked",
    "db:diff": "supabase db diff",
    "migration:new": "supabase migration new"
  }
}
```

**사용:**
```bash
# 새 마이그레이션 생성
npm run migration:new add_delivery_memo

# 마이그레이션 적용
npm run db:push

# DB 초기화 (전체 리셋)
npm run db:reset
```

---

### **방법 3: GitHub Actions로 자동 배포 (프로덕션용 ⭐⭐)**

`.github/workflows/deploy-migration.yml`:
```yaml
name: Deploy Migration

on:
  push:
    branches: [main]
    paths:
      - 'supabase/migrations/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        run: |
          npm install -g supabase
      
      - name: Deploy Migration
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
        run: |
          supabase link --project-ref uuiresymwsjpamntmkyb
          supabase db push --linked
```

**작동 방식:**
1. 마이그레이션 파일 작성
2. Git push
3. 자동으로 Supabase에 적용! 🎉

---

## 📋 실무 워크플로우 (추천)

### **개발 중 (로컬)**

```bash
# 1. 새 기능 개발하면서 DB 스키마 변경 필요
npm run migration:new add_order_status_history

# 2. 마이그레이션 파일 작성
# supabase/migrations/20260114000009_add_order_status_history.sql
```

```sql
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  status VARCHAR(20) NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users(id)
);
```

```bash
# 3. 자동으로 원격 DB에 적용
npm run db:push

# 완료! ✅
```

### **Vercel 배포 후 테스트**

```bash
# 1. 테스트 중 문제 발견
# 2. 스키마 수정 필요
npm run migration:new fix_order_table

# 3. 수정
# supabase/migrations/20260114000010_fix_order_table.sql
```

```sql
ALTER TABLE orders ADD COLUMN cancellation_reason TEXT;
ALTER TABLE orders ADD COLUMN cancelled_by UUID REFERENCES auth.users(id);
```

```bash
# 4. 자동 적용!
npm run db:push

# 5. Git에 커밋
git add supabase/migrations/
git commit -m "feat: Add order cancellation tracking"
git push

# 6. Vercel 자동 재배포
# 7. 변경사항 즉시 반영! ✅
```

---

## 🎯 시나리오별 가이드

### **시나리오 1: 테이블 추가**

```bash
npm run migration:new add_wishlists_table
```

```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user ON wishlists(user_id);
```

```bash
npm run db:push
```

### **시나리오 2: 컬럼 추가**

```bash
npm run migration:new add_product_sku
```

```sql
ALTER TABLE products ADD COLUMN sku VARCHAR(50) UNIQUE;
CREATE INDEX idx_products_sku ON products(sku);
```

```bash
npm run db:push
```

### **시나리오 3: RLS 정책 수정**

```bash
npm run migration:new fix_orders_rls
```

```sql
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    user_id = auth.uid() OR
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
```

```bash
npm run db:push
```

### **시나리오 4: 전체 DB 리셋 (개발 환경)**

```bash
# 주의: 모든 데이터 삭제!
npm run db:reset

# 확인 후 Y 입력
# 모든 마이그레이션이 처음부터 다시 적용됨
```

---

## ⚙️ 설정 방법 (지금 바로!)

### Step 1: Supabase 프로젝트 링크

```bash
cd /home/user/webapp

# 프로젝트 연결
npx supabase link --project-ref uuiresymwsjpamntmkyb
```

**입력 필요:**
- Database password: Supabase Dashboard → Settings → Database → Database Password

### Step 2: package.json 스크립트 추가

`package.json`에 추가:
```json
{
  "scripts": {
    "db:push": "supabase db push --linked",
    "db:reset": "supabase db reset --linked",
    "migration:new": "supabase migration new"
  }
}
```

### Step 3: 테스트!

```bash
# 새 마이그레이션 생성
npm run migration:new test_migration

# 파일 작성 (예)
echo "SELECT NOW();" > supabase/migrations/$(ls -t supabase/migrations/ | head -1)

# 적용
npm run db:push
```

---

## 🎉 결론

### **수동 방식 (지금까지)**
```
1. 스키마 변경 필요
2. Supabase Dashboard 접속
3. SQL Editor 열기
4. SQL 작성
5. 실행
6. 확인
```
소요 시간: 5-10분 😓

### **자동 방식 (앞으로)**
```
1. npm run migration:new my_change
2. SQL 파일 작성
3. npm run db:push
```
소요 시간: 1분! ⚡

---

## 📊 비교표

| 항목 | 수동 (Dashboard) | 자동 (CLI) |
|------|-----------------|-----------|
| 소요 시간 | 5-10분 | 1분 |
| Git 관리 | ❌ 어려움 | ✅ 자동 |
| 롤백 | ❌ 어려움 | ✅ 쉬움 |
| 히스토리 | ❌ 없음 | ✅ 자동 |
| 팀 협업 | ❌ 어려움 | ✅ 쉬움 |
| 자동화 | ❌ 불가 | ✅ 가능 |

---

## 🚨 주의사항

### 1) DB 비밀번호 관리
```bash
# .env.local에 추가 (절대 커밋하지 말 것!)
SUPABASE_DB_PASSWORD=your_password
```

### 2) 프로덕션 환경
- ⚠️ 직접 push 전에 충분히 테스트
- ✅ 백업 먼저
- ✅ 마이그레이션 롤백 계획

### 3) 마이그레이션 순서
- 마이그레이션은 **순서대로** 실행됨
- 파일명의 타임스탬프 중요!

---

## 💡 팁

### 1) 마이그레이션 롤백
```bash
# 마지막 마이그레이션 취소
npx supabase migration repair <timestamp> --status reverted
```

### 2) 로컬 DB 테스트 (선택)
```bash
# Docker로 로컬 Supabase 실행
npx supabase start

# 로컬에서 마이그레이션 테스트
npx supabase db push

# 문제 없으면 원격에 적용
npx supabase db push --linked
```

### 3) 현재 적용된 마이그레이션 확인
```bash
npx supabase migration list
```

---

## 📞 문제 해결

### Q: "Project not linked" 에러
```bash
npx supabase link --project-ref uuiresymwsjpamntmkyb
```

### Q: "Database password required" 에러
Supabase Dashboard → Settings → Database → Database Password 확인

### Q: 마이그레이션 실패
```bash
# 로그 확인
npx supabase db push --debug
```

---

**대표님, 이제 수동으로 SQL 실행 안 하셔도 됩니다! 🎉**

`npm run db:push` 한 줄이면 끝! ⚡
