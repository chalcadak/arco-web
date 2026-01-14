# 🔐 테스트 관리자 계정 생성 가이드

## 📋 준비사항
- Supabase 프로젝트 설정 완료
- `.env.local` 파일에 환경 변수 설정
- 마이그레이션 적용 완료

---

## 🚀 방법 1: 자동 스크립트 사용 (가장 쉬움 ⭐)

### Step 1: 환경 변수 확인

`.env.local` 파일에 다음 변수가 있는지 확인:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 2: 스크립트 실행

```bash
cd /home/user/webapp
node scripts/create-test-admin.mjs
```

### Step 3: 로그인 테스트

```
이메일: admin@arco.com
비밀번호: Admin123!@#
URL: http://localhost:3000/admin/login
```

---

## 🛠️ 방법 2: Supabase Dashboard 사용

### Step 1: 마이그레이션 적용

Supabase Dashboard > SQL Editor:

```sql
-- 파일 내용 붙여넣기
supabase/migrations/20260114000008_add_user_roles.sql
```

### Step 2: 사용자 생성

**Authentication > Users > Add user**

```
Email: admin@arco.com
Password: Admin123!@#
Auto Confirm User: ✅ 체크
```

### Step 3: 관리자 권한 부여

SQL Editor:

```sql
SELECT promote_to_admin('admin@arco.com');
```

### Step 4: 확인

```sql
SELECT email, role FROM users WHERE email = 'admin@arco.com';
```

---

## 🔍 방법 3: 수동 설정

### Step 1: 회원가입

1. http://localhost:3000/signup 접속
2. 다음 정보 입력:
   ```
   이메일: admin@arco.com
   비밀번호: Admin123!@#
   이름: ARCO 관리자
   ```

### Step 2: 이메일 확인

Supabase Dashboard > Authentication > Users에서:
- 방금 생성한 사용자 찾기
- **Confirm Email** 클릭

### Step 3: User ID 복사

사용자의 UUID를 복사

### Step 4: 관리자 권한 부여

SQL Editor:

```sql
-- User ID를 복사한 UUID로 변경
UPDATE users 
SET role = 'admin' 
WHERE id = 'your-user-id-here';

UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-id-here';
```

---

## ✅ 테스트

### 1. 관리자 로그인

http://localhost:3000/admin/login

```
이메일: admin@arco.com
비밀번호: Admin123!@#
```

### 2. 대시보드 접근

로그인 후 자동으로 `/admin/dashboard`로 이동

### 3. 권한 확인

- 좌측 메뉴에서 모든 관리 기능 접근 가능
- 헤더에 이메일 표시
- 로그아웃 기능 정상 작동

---

## 🔐 계정 정보

**테스트용 관리자 계정:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 이메일: admin@arco.com
🔑 비밀번호: Admin123!@#
🔗 URL: http://localhost:3000/admin/login
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**⚠️ 보안 주의사항:**
- 이 계정은 개발/테스트용입니다
- 프로덕션 배포 전에 비밀번호 변경 필수
- 또는 새로운 관리자 계정 생성 후 이 계정 삭제

---

## 🚨 문제 해결

### "관리자 권한이 없습니다" 오류

```sql
-- 현재 role 확인
SELECT email, role FROM users WHERE email = 'admin@arco.com';

-- 관리자 권한 재부여
SELECT promote_to_admin('admin@arco.com');

-- 다시 확인
SELECT email, role FROM users WHERE email = 'admin@arco.com';
```

### "이메일 또는 비밀번호가 올바르지 않습니다" 오류

Supabase Dashboard > Authentication > Users:
- 사용자가 **Confirmed** 상태인지 확인
- **Confirm Email** 클릭하여 확인

### 테이블에 레코드 없음

```sql
-- auth.users ID 찾기
SELECT id, email FROM auth.users WHERE email = 'admin@arco.com';

-- users 테이블에 추가 (UUID를 위에서 복사한 ID로 변경)
INSERT INTO users (id, email, role) 
VALUES ('your-auth-uid', 'admin@arco.com', 'admin');

-- profiles 테이블에 추가
INSERT INTO profiles (id, email, role) 
VALUES ('your-auth-uid', 'admin@arco.com', 'admin');
```

---

## 📝 추가 관리자 추가

### 방법 1: SQL 함수 사용

```sql
-- 이메일만 변경하여 실행
SELECT promote_to_admin('another-admin@arco.com');
```

### 방법 2: 직접 수정

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'another-admin@arco.com';
```

---

## 🎯 완료 체크리스트

- [ ] 마이그레이션 적용 완료
- [ ] 테스트 계정 생성 완료
- [ ] 관리자 권한 부여 완료
- [ ] 로그인 테스트 성공
- [ ] 대시보드 접근 확인
- [ ] 관리 기능 테스트 완료

---

**설정 완료!** 이제 관리자 페이지를 테스트할 수 있습니다. 🎉
