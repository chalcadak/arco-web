# 🚨 마이그레이션 버전 충돌 해결 가이드

## ❌ **에러 메시지**

```
Remote migration versions not found in local migrations directory.

Make sure your local git repo is up-to-date. If the error persists, 
try repairing the migration history table:
supabase migration repair --status reverted 20260110000002
```

---

## 🔍 **문제 원인**

1. 원격 DB에 `20260110000002_rls_policies.sql`이 **이미 적용됨**
2. 로컬에서 이 파일을 `99999999999999_rls_policies.sql`로 **이름 변경**
3. Supabase CLI가 버전 불일치 감지

---

## ✅ **해결 방법 (2가지)**

---

### **방법 1: 마이그레이션 히스토리 복구 (권장)**

#### **Step 1: 기존 마이그레이션 복구**

```bash
cd /path/to/arco-web

# 원격 DB의 마이그레이션을 되돌림으로 표시
npx supabase migration repair --status reverted 20260110000002

# ✅ 성공 메시지:
# Repaired migration 20260110000002 in remote database
```

#### **Step 2: 마이그레이션 재푸시**

```bash
# 이제 다시 푸시
npx supabase db push

# ✅ 새로운 순서로 적용:
# Applying migration 20260110000001_initial_schema.sql...
# Applying migration 20260112000001_create_orders_table.sql...
# ...
# Applying migration 99999999999999_rls_policies.sql...
# Done.
```

---

### **방법 2: 원격 DB 완전 초기화 (더 깔끔)**

**⚠️ 주의**: 모든 데이터가 삭제됩니다!

#### **Step 1: 원격 DB 초기화**

```bash
# Dashboard SQL Editor에서 실행
open https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
```

```sql
-- 모든 테이블 삭제
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- 마이그레이션 히스토리 테이블 삭제
DROP TABLE IF EXISTS supabase_migrations.schema_migrations CASCADE;
```

#### **Step 2: 마이그레이션 재푸시**

```bash
cd /path/to/arco-web

# 깨끗한 상태에서 다시 푸시
npx supabase db push

# ✅ 모든 마이그레이션 새로 적용
# Applying migration 20260110000001_initial_schema.sql...
# Applying migration 20260112000001_create_orders_table.sql...
# ...
# Done.
```

---

### **방법 3: 로컬 마이그레이션 동기화**

#### **Step 1: 원격 DB 마이그레이션 상태 확인**

```bash
# 원격 DB의 마이그레이션 목록 확인
npx supabase migration list
```

#### **Step 2: 원격과 동기화**

```bash
# 원격 DB의 현재 상태를 로컬로 가져오기
npx supabase db pull

# ✅ 원격 DB 스키마를 새 마이그레이션 파일로 생성
# Created new migration: 20260115073000_remote_schema.sql
```

#### **Step 3: 기존 마이그레이션 정리**

```bash
# 기존 마이그레이션 파일 백업
mkdir -p supabase/migrations_backup
mv supabase/migrations/*.sql supabase/migrations_backup/

# pull로 받은 새 마이그레이션만 유지
# (가장 최신 타임스탬프 파일 하나만)
```

---

## 🎯 **권장 방법**

### **테스트 DB라면 → 방법 2 (완전 초기화)**

**장점**:
- ✅ 가장 깔끔함
- ✅ 버전 충돌 완전 해결
- ✅ 새 시작

**단점**:
- ❌ 모든 데이터 삭제

**실행 코드**:
```bash
# 1. Dashboard에서 DB 초기화
open https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor

# SQL 실행:
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

# 2. 마이그레이션 재푸시
npx supabase db push
```

---

### **운영 DB라면 → 방법 1 (히스토리 복구)**

**장점**:
- ✅ 데이터 보존
- ✅ 안전함

**단점**:
- ❌ 복잡할 수 있음

**실행 코드**:
```bash
# 1. 기존 마이그레이션 되돌림
npx supabase migration repair --status reverted 20260110000002

# 2. 마이그레이션 재푸시
npx supabase db push
```

---

## 📊 **각 방법 비교**

| 방법 | 소요 시간 | 데이터 보존 | 복잡도 | 권장 대상 |
|------|----------|------------|--------|-----------|
| **방법 1: 히스토리 복구** | 2분 | ✅ 보존 | 중간 | 운영 DB |
| **방법 2: 완전 초기화** | 3분 | ❌ 삭제 | 쉬움 | 테스트 DB |
| **방법 3: DB Pull** | 5분 | ✅ 보존 | 어려움 | 복잡한 경우 |

---

## 🚀 **지금 바로 실행하기**

### **테스트 DB (arco-db-test)이므로 방법 2 권장**

```bash
# Step 1: Dashboard SQL Editor
open https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor
```

**SQL 실행**:
```sql
-- 완전 초기화
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public IS 'standard public schema';
```

```bash
# Step 2: 마이그레이션 푸시
cd /path/to/arco-web
npx supabase db push

# ✅ Done!
```

---

## 🧪 **검증**

```sql
-- Dashboard SQL Editor에서 실행
SELECT version, name, executed_at 
FROM supabase_migrations.schema_migrations 
ORDER BY version;

-- ✅ 예상 결과:
-- 20260110000001 | initial_schema.sql
-- 20260112000001 | create_orders_table.sql
-- ...
-- 99999999999999 | rls_policies.sql
```

```sql
-- 테이블 확인
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
-- ✅ 12개 이상
```

---

## 💡 **왜 이런 문제가 발생했나?**

### **타임라인**
1. 처음에 `20260110000002_rls_policies.sql`로 푸시 시도
2. 일부 적용되거나 히스토리에만 기록됨
3. 로컬에서 파일명을 `99999999999999_rls_policies.sql`로 변경
4. Supabase CLI가 `20260110000002`를 찾지 못함 → 충돌!

### **해결 원리**
- **방법 1**: 원격 DB에 "이 마이그레이션은 되돌렸다"고 표시
- **방법 2**: 원격 DB를 완전히 비우고 새로 시작
- **방법 3**: 원격 DB 상태를 로컬로 가져와서 동기화

---

## 🎯 **대표님께 추천**

### **지금 상황**
- ✅ 테스트 DB (arco-db-test)
- ✅ 데이터 없음 (또는 테스트 데이터만)
- ✅ 빠른 해결 필요

### **권장 방법: 완전 초기화 (방법 2)**

**실행 순서**:
```bash
# 1. Dashboard 열기
open https://supabase.com/dashboard/project/xlclmfgsijexddigxvzz/editor

# 2. SQL 복사-붙여넣기-실행
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

# 3. 마이그레이션 푸시
npx supabase db push

# 4. 검증
npx supabase migration list
```

**⏱️ 소요 시간**: 3분

---

## 🔗 **참고 문서**

- **Supabase Migration Repair**: https://supabase.com/docs/reference/cli/supabase-migration-repair
- **DB Pull**: https://supabase.com/docs/reference/cli/supabase-db-pull

---

## ✅ **완료 후 확인**

```bash
# 마이그레이션 목록 확인
npx supabase migration list

# ✅ 예상 출력:
# │ 20260110000001 │ initial_schema.sql              │ Applied │
# │ 20260112000001 │ create_orders_table.sql         │ Applied │
# │ 20260112000002 │ add_video_uid.sql               │ Applied │
# ...
# │ 99999999999999 │ rls_policies.sql                │ Applied │

# 테이블 확인
npx supabase db pull --schema public --dry-run
```

---

**🎉 이 방법으로 완벽하게 해결됩니다!**
