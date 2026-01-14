# 🗄️ ARCO Supabase 마이그레이션 가이드

## 📋 목표
완전히 새로운 데이터베이스 스키마를 적용합니다.

---

## 🚀 3단계로 완료!

### **Step 1: 기존 테이블 삭제** (30초)

1. https://supabase.com/dashboard 접속
2. ARCO 프로젝트 선택
3. 좌측 메뉴에서 **SQL Editor** 클릭
4. **New query** 버튼 클릭
5. 아래 SQL 전체를 복사해서 붙여넣기:

```sql
-- ============================================================================
-- Step 1: Drop existing tables
-- ============================================================================
DROP TRIGGER IF EXISTS sync_users_role_trigger ON users CASCADE;
DROP TRIGGER IF EXISTS sync_profiles_role_trigger ON profiles CASCADE;
DROP FUNCTION IF EXISTS sync_user_role() CASCADE;
DROP FUNCTION IF EXISTS promote_to_admin(TEXT) CASCADE;
DROP FUNCTION IF EXISTS demote_to_customer(TEXT) CASCADE;

DROP TABLE IF EXISTS stock_notifications CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS coupon_usage CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS photoshoot_looks CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
```

6. 우측 하단 **Run** 버튼 클릭

---

### **Step 2: 전체 스키마 생성** (1분)

1. 동일한 SQL Editor에서 (또는 새 query 생성)
2. 아래 파일 내용을 **전체** 복사해서 붙여넣기:

```
📁 파일 위치: 
/home/user/webapp/supabase/migrations/99999999999999_complete_fresh_install.sql
```

또는 GitHub에서 복사:
```
https://github.com/chalcadak/arco-web/blob/main/supabase/migrations/99999999999999_complete_fresh_install.sql
```

3. **Run** 버튼 클릭

**결과:**
- ✅ 14개 테이블 생성
- ✅ users, profiles에 role 컬럼 추가
- ✅ RLS 정책 적용
- ✅ Admin 함수 생성 (promote_to_admin, demote_to_customer)
- ✅ 기본 카테고리 7개 삽입

---

### **Step 3: 관리자 권한 부여** (10초)

1. SQL Editor에서 새 query
2. 아래 SQL 붙여넣기:

```sql
-- 테스트 관리자 계정에 권한 부여
UPDATE users 
SET role = 'admin' 
WHERE id = '79908c48-a5e4-4ffd-a4a3-3f27a17d1663';

UPDATE profiles 
SET role = 'admin' 
WHERE id = '79908c48-a5e4-4ffd-a4a3-3f27a17d1663';
```

3. **Run** 클릭

---

## ✅ 확인

마이그레이션이 성공했는지 확인:

```sql
-- 테이블 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 관리자 계정 확인
SELECT id, email, role 
FROM users 
WHERE email = 'admin@arco.com';

SELECT id, email, role 
FROM profiles 
WHERE email = 'admin@arco.com';
```

**예상 결과:**
- 테이블 14개 존재
- users와 profiles에 role = 'admin' 확인

---

## 🎉 완료!

### 테스트 관리자 계정
```
이메일: admin@arco.com
비밀번호: Admin123!@#
로그인 URL: http://localhost:3000/admin/login
```

---

## 📊 생성된 테이블 목록

1. **users** - 회원 정보 (role 포함)
2. **profiles** - 사용자 프로필 (role 포함)
3. **categories** - 카테고리 (상품/촬영룩)
4. **products** - 판매 상품
5. **photoshoot_looks** - 촬영룩
6. **bookings** - 촬영 예약
7. **orders** - 주문 (완전한 스키마)
8. **reviews** - 리뷰
9. **stock_notifications** - 재입고 알림
10. **coupons** - 쿠폰
11. **coupon_usage** - 쿠폰 사용 내역
12. **inquiries** - 1:1 문의

---

## 🔐 Admin 기능

### 관리자 승격
```sql
SELECT promote_to_admin('user@example.com');
```

### 관리자 강등
```sql
SELECT demote_to_customer('user@example.com');
```

---

## 🚨 문제 해결

### 에러: "relation already exists"
→ Step 1의 DROP 문을 다시 실행하세요.

### 에러: "permission denied"
→ Supabase Dashboard에서 진행하세요. (Service Role Key 사용)

### 테이블이 안 보임
→ Table Editor에서 새로고침하세요.

---

## 📞 도움이 필요하시면

스크린샷과 함께 에러 메시지를 보내주세요! 🙏
