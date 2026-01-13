# Supabase Database Setup Guide

## 🚀 Quick Start

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 에서 새 프로젝트 생성
2. 프로젝트 설정에서 다음 정보 확인:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon key**: 공개 API 키
   - **service_role key**: 서버용 비밀 키

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. 데이터베이스 마이그레이션 실행

#### Option A: Supabase Dashboard (추천)

1. Supabase Dashboard → SQL Editor
2. `migrations/20260110000001_initial_schema.sql` 내용 복사 → 실행
3. `migrations/20260110000002_rls_policies.sql` 내용 복사 → 실행
4. `seed.sql` 내용 복사 → 실행 (선택적)

#### Option B: Supabase CLI

```bash
# Supabase CLI 설치
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push

# 시드 데이터 삽입
supabase db seed
```

---

## 📊 데이터베이스 스키마

### 주요 테이블

| 테이블 | 설명 | 관계 |
|--------|------|------|
| `users` | 회원 정보 | - |
| `categories` | 카테고리 | products, photoshoot_looks |
| `products` | 판매상품 | order_items |
| `photoshoot_looks` | 촬영룩 | bookings |
| `orders` | 주문 | order_items, users |
| `order_items` | 주문 상품 | orders, products |
| `bookings` | 촬영 예약 | galleries, users |
| `galleries` | 납품 갤러리 | gallery_images, bookings |
| `gallery_images` | 갤러리 이미지 | galleries |
| `admin_users` | 관리자 | users |

### ERD

```
users (1) ──< (N) orders (1) ──< (N) order_items (N) >── (1) products
  │
  └──< (N) bookings (1) ──< (1) galleries (1) ──< (N) gallery_images
  │
  └──< (1) admin_users

photoshoot_looks (1) ──< (N) bookings
categories (1) ──< (N) products
categories (1) ──< (N) photoshoot_looks
```

---

## 🔐 Row Level Security (RLS)

### 공개 읽기 권한
- ✅ 모든 사용자: 활성화된 상품 조회
- ✅ 모든 사용자: 활성화된 촬영룩 조회
- ✅ 모든 사용자: 카테고리 조회
- ✅ 토큰 소지자: 갤러리 조회 (토큰 검증은 애플리케이션에서)

### 사용자 권한
- ✅ 본인 프로필 조회/수정
- ✅ 본인 주문 조회
- ✅ 본인 예약 조회

### 익명 사용자 권한
- ✅ 주문 생성 (비회원 구매)
- ✅ 예약 생성 (비회원 예약)

### 관리자 권한
- ✅ 모든 데이터 읽기/쓰기/수정/삭제

---

## 📁 마이그레이션 파일

### `20260110000001_initial_schema.sql`
- 테이블 생성
- 인덱스 생성
- 기본 카테고리 데이터 삽입
- 트리거 및 함수 생성

### `20260110000002_rls_policies.sql`
- RLS 활성화
- 접근 권한 정책 설정

### `seed.sql`
- 샘플 상품 데이터
- 샘플 촬영룩 데이터
- 관리자 계정

---

## 🧪 데이터 확인

마이그레이션 후 SQL Editor에서 확인:

```sql
-- 카테고리 확인
SELECT * FROM categories;

-- 샘플 상품 확인
SELECT * FROM products;

-- 샘플 촬영룩 확인
SELECT * FROM photoshoot_looks;

-- 관리자 확인
SELECT * FROM admin_users;
```

---

## 🔧 유용한 SQL 쿼리

### 주문 번호 생성
```sql
SELECT generate_order_number();
```

### 예약 번호 생성
```sql
SELECT generate_booking_number();
```

### 관리자 권한 확인
```sql
SELECT is_admin();
```

---

## 📝 주의사항

### 관리자 계정 설정

`seed.sql`의 관리자 계정 UUID는 예시입니다. 실제 사용 시:

1. Supabase Auth에서 먼저 사용자 생성
2. 생성된 사용자의 UUID 확인
3. `users` 테이블에 해당 UUID로 레코드 생성
4. `admin_users` 테이블에 연결

```sql
-- 실제 UUID로 교체
INSERT INTO users (id, email, name) VALUES
  ('actual-uuid-from-auth', 'admin@arco.com', 'Admin');

INSERT INTO admin_users (id, role) VALUES
  ('actual-uuid-from-auth', 'super_admin');
```

### 시퀀스 초기화

개발 중 데이터 삭제 후 시퀀스 초기화:

```sql
ALTER SEQUENCE order_number_seq RESTART WITH 1;
ALTER SEQUENCE booking_number_seq RESTART WITH 1;
```

---

## 🔄 스키마 변경 시

새로운 마이그레이션 파일 생성:

```bash
# 파일명 형식: YYYYMMDDHHMMSS_description.sql
supabase/migrations/20260110120000_add_new_feature.sql
```

---

## 📚 참고 자료

- [Supabase 문서](https://supabase.com/docs)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
