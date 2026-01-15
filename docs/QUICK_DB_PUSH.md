# ⚡ 빠른 시작: npx supabase db push (3분)

> **목표**: 로컬 마이그레이션을 Supabase DB에 푸시

---

## 🚀 **3단계로 완료**

### **Step 1: Supabase 로그인 (1분)**

```bash
# 프로젝트 디렉토리로 이동
cd /path/to/arco-web

# Supabase 로그인
npx supabase login

# 브라우저가 열리면 인증 완료
# ✅ Logged in.
```

---

### **Step 2: 프로젝트 연결 (1분)**

```bash
# 프로젝트 연결
npx supabase link --project-ref uuiresymwsjpamntmkyb

# 데이터베이스 비밀번호 입력
# (Dashboard → Settings → Database → Database Password)
```

**비밀번호 찾는 방법:**
1. https://supabase.com/dashboard/project/uuiresymwsjpamntmkyb/settings/database
2. `Database Password` 확인
3. 또는 프로젝트 생성 시 저장한 비밀번호 사용

---

### **Step 3: 마이그레이션 푸시 (1분)**

```bash
# 마이그레이션 푸시
npx supabase db push

# ✅ 성공 메시지:
# Applying migration 20260110000001_initial_schema.sql...
# Applying migration 20260110000002_rls_policies.sql...
# ...
# Applying migration 20260114000008_add_user_roles.sql...
# Done.
```

---

## ✅ **검증 (30초)**

```bash
# Supabase Dashboard SQL Editor 열기
open https://supabase.com/dashboard/project/uuiresymwsjpamntmkyb/editor
```

**검증 쿼리:**
```sql
-- 테이블 개수 확인
SELECT COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- ✅ 예상 결과: 12
```

---

## 🎯 **전체 명령어 (복사-붙여넣기)**

```bash
# 한 번에 실행
cd /path/to/arco-web
npx supabase login
npx supabase link --project-ref uuiresymwsjpamntmkyb
npx supabase db push
```

---

## 🚨 **문제 해결**

### **"Login required"**
```bash
npx supabase login
```

### **"Project not found"**
```bash
# 프로젝트 ID 확인
# uuiresymwsjpamntmkyb

# 재연결
npx supabase link --project-ref uuiresymwsjpamntmkyb
```

### **"Migration already applied"**
```bash
# 이미 적용된 마이그레이션 건너뛰기 (정상)
# 새 마이그레이션만 적용됨
```

---

## 📚 **상세 가이드**

더 자세한 내용은 다음 문서를 참고하세요:
- **DB Push 가이드**: [docs/SUPABASE_DB_PUSH_GUIDE.md](./SUPABASE_DB_PUSH_GUIDE.md)
- **마이그레이션 테스트**: [docs/SUPABASE_MIGRATION_TEST.md](./SUPABASE_MIGRATION_TEST.md)

---

## 🎉 **완료!**

이제 **Supabase DB에 마이그레이션이 적용**되었습니다!

**다음 단계:**
1. ✅ 테스트 데이터 추가
2. ✅ 관리자 계정 설정
3. ✅ 로컬 앱 테스트 (npm run dev)

---

**⏱️ 총 소요 시간**: 3분
