# 🔐 ARCO Admin 초기 설정 가이드

## 📋 Overview

ARCO 플랫폼의 관리자 계정을 설정하는 방법입니다.

---

## 🚀 빠른 시작

### 1. Supabase 마이그레이션 적용

```bash
# 터미널에서 실행
cd /home/user/webapp
```

Supabase Studio(https://supabase.com/dashboard)에서:
1. 프로젝트 선택
2. SQL Editor 메뉴 클릭
3. 다음 마이그레이션 파일 순서대로 실행:

```sql
-- 1. User roles 추가
supabase/migrations/20260114000008_add_user_roles.sql
```

---

## 👤 관리자 계정 생성

### Option 1: 기존 계정을 관리자로 승격 (권장)

1. **회원가입**: 먼저 일반 사용자로 회원가입
   - https://your-domain.com/signup
   - 이메일/비밀번호 입력

2. **관리자 권한 부여**: Supabase Studio > SQL Editor에서 실행

```sql
-- 이메일을 본인 계정으로 변경
SELECT promote_to_admin('admin@arco.com');
```

3. **완료**: 이제 `/admin/login`에서 로그인 가능

---

### Option 2: Supabase Dashboard에서 직접 설정

1. **Supabase Dashboard** > Authentication > Users
2. 사용자 선택
3. SQL Editor에서 실행:

```sql
-- user_id를 본인 계정 ID로 변경
UPDATE users 
SET role = 'admin' 
WHERE id = 'your-user-id-here';

UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-user-id-here';
```

---

## 🔑 테스트 관리자 계정 (개발용)

### 개발 환경에서만 사용

```sql
-- 1. 테스트 사용자 생성 (Supabase Auth에서 먼저 회원가입 필요)
-- 2. 관리자 권한 부여
SELECT promote_to_admin('admin@arco.com');
```

**⚠️ 프로덕션 주의사항:**
- 반드시 강력한 비밀번호 사용
- 테스트 계정은 프로덕션에서 삭제
- 2FA(Two-Factor Authentication) 활성화 권장

---

## 📝 관리자 계정 관리

### 관리자 승격

```sql
SELECT promote_to_admin('user@example.com');
```

### 관리자 권한 해제

```sql
SELECT demote_to_customer('user@example.com');
```

### 현재 관리자 목록 조회

```sql
SELECT id, email, role, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;
```

---

## 🛡️ 보안 체크리스트

- [ ] 강력한 비밀번호 설정 (12자 이상, 특수문자 포함)
- [ ] 관리자 이메일을 회사 도메인으로 사용 (@arco.com)
- [ ] 개발 계정과 프로덕션 계정 분리
- [ ] 정기적인 권한 검토
- [ ] Supabase Row Level Security (RLS) 정책 확인
- [ ] API 키 환경 변수로 관리
- [ ] HTTPS 사용 강제

---

## 🚨 문제 해결

### "관리자 권한이 없습니다" 오류

**원인**: users 테이블의 role이 'customer'로 설정됨

**해결**:
```sql
-- 본인 이메일 확인
SELECT email, role FROM users WHERE email = 'your@email.com';

-- 관리자 권한 부여
SELECT promote_to_admin('your@email.com');

-- 확인
SELECT email, role FROM users WHERE email = 'your@email.com';
```

### "사용자 정보를 불러올 수 없습니다" 오류

**원인**: users 테이블에 레코드 없음

**해결**:
```sql
-- 먼저 회원가입 후, users 테이블 확인
SELECT * FROM users WHERE email = 'your@email.com';

-- 없으면 수동 생성
INSERT INTO users (id, email, role) 
VALUES (
  'your-auth-uid-here',  -- auth.users의 id
  'your@email.com',
  'admin'
);
```

### 로그인 후 대시보드 접근 불가

**원인**: middleware에서 role 체크 실패

**확인**:
```sql
-- users와 profiles 테이블 모두 확인
SELECT 'users' as table_name, role FROM users WHERE email = 'your@email.com'
UNION ALL
SELECT 'profiles' as table_name, role FROM profiles WHERE email = 'your@email.com';
```

**해결**:
```sql
-- 양쪽 테이블 모두 업데이트
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📊 관리자 대시보드 기능

로그인 성공 후 사용 가능한 기능:

1. **대시보드** - 실시간 통계 및 현황
2. **상품 관리** - 상품 CRUD
3. **주문 관리** - 주문 처리 및 배송 관리
4. **촬영룩 관리** - 촬영룩 CRUD
5. **예약 관리** - 촬영 예약 관리
6. **리뷰 관리** - 리뷰 승인/거부
7. **쿠폰 관리** - 쿠폰 생성/관리
8. **1:1 문의** - 고객 문의 답변
9. **재입고 알림** - 재입고 알림 관리

---

## 🔗 관련 링크

- **관리자 로그인**: `/admin/login`
- **관리자 대시보드**: `/admin/dashboard`
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Repository**: https://github.com/chalcadak/arco-web

---

## ✅ 초기 설정 완료 확인

- [ ] Supabase 마이그레이션 적용 완료
- [ ] 관리자 계정 생성 완료
- [ ] 로그인 테스트 성공
- [ ] 대시보드 접근 확인
- [ ] 주요 기능 테스트 완료

---

**설정 완료!** 이제 ARCO 관리자 페이지를 사용할 수 있습니다. 🎉
