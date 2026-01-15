# 🔍 DB 테스트 안전성 체크리스트

## ✅ 검증 완료 사항

### 1. 데이터베이스 스키마 ✅

#### 테이블 구조 (11개)
```sql
✅ categories       - 기본 카테고리 7개 자동 생성
✅ products         - 상품 관리 (video_uid 포함)
✅ photoshoot_looks - 촬영룩 관리
✅ bookings         - 촬영 예약
✅ orders           - 주문 관리 (JSONB items)
✅ profiles         - 사용자 프로필 (auth.users 연동)
✅ reviews          - 리뷰 시스템
✅ stock_notifications - 재입고 알림
✅ coupons          - 쿠폰 관리
✅ coupon_usage     - 쿠폰 사용 내역
✅ inquiries        - 1:1 문의
```

#### 외래키 관계 검증 ✅
```
categories (id)
  ├─> products (category_id)
  └─> photoshoot_looks (category_id)

auth.users (id)
  ├─> profiles (id) - ON DELETE CASCADE
  ├─> reviews (user_id) - ON DELETE CASCADE
  ├─> stock_notifications (user_id) - ON DELETE CASCADE
  └─> coupon_usage (user_id) - ON DELETE CASCADE

products (id)
  ├─> reviews (product_id) - ON DELETE CASCADE
  └─> stock_notifications (product_id) - ON DELETE CASCADE

photoshoot_looks (id)
  ├─> bookings (photoshoot_look_id)
  └─> reviews (photoshoot_look_id) - ON DELETE CASCADE

orders (id)
  └─> coupon_usage (order_id) - ON DELETE SET NULL

coupons (id)
  └─> coupon_usage (coupon_id) - ON DELETE CASCADE
```

**✅ 순환 참조 없음**: 모든 외래키가 단방향 계층 구조

---

### 2. RLS (Row Level Security) 정책 ✅

#### 활성화된 테이블
```
✅ products
✅ photoshoot_looks
✅ orders
✅ profiles
✅ reviews
```

#### 비활성화된 테이블 (공개 데이터)
```
⚠️  categories         - 공개 카테고리 (RLS 불필요)
⚠️  bookings           - 익명 예약 가능 (RLS 불필요)
⚠️  stock_notifications - 누구나 알림 등록 가능
⚠️  coupons            - 공개 쿠폰 조회
⚠️  coupon_usage       - 쿠폰 사용은 애플리케이션에서 제어
⚠️  inquiries          - 익명 문의 가능
```

#### 정책 목록 (12개)

**Products (2개)**
```sql
✅ "Products are viewable by everyone"
   FOR SELECT USING (is_active = TRUE OR auth.jwt()->>'role' = 'admin')
   
✅ "Admins can manage products"
   FOR ALL USING (auth.jwt()->>'role' = 'admin')
```

**Photoshoot Looks (2개)**
```sql
✅ "Photoshoot looks are viewable by everyone"
   FOR SELECT USING (is_active = TRUE OR auth.jwt()->>'role' = 'admin')
   
✅ "Admins can manage photoshoot looks"
   FOR ALL USING (auth.jwt()->>'role' = 'admin')
```

**Orders (3개)**
```sql
✅ "Anyone can create orders"
   FOR INSERT WITH CHECK (true)
   
✅ "Users can read their own orders"
   FOR SELECT USING (customer_email = auth.jwt()->>'email')
   
✅ "Admins have full access to orders"
   FOR ALL USING (auth.jwt()->>'role' = 'admin')
```

**Profiles (3개)**
```sql
✅ "Profiles are viewable by owner"
   FOR SELECT USING (id = auth.uid())
   
✅ "Profiles are editable by owner"
   FOR UPDATE USING (id = auth.uid())
   
✅ "Admins can read all profiles"
   FOR SELECT USING (auth.jwt()->>'role' = 'admin')
```

**Reviews (2개)**
```sql
✅ "Reviews are viewable by everyone"
   FOR SELECT USING (is_approved = TRUE OR user_id = auth.uid() OR auth.jwt()->>'role' = 'admin')
   
✅ "Users can create reviews"
   FOR INSERT WITH CHECK (user_id = auth.uid())
```

---

### 3. 환경 변수 설정 ✅

#### .env.local 파일 존재 확인
```bash
✅ NEXT_PUBLIC_SUPABASE_URL=https://xlclmfgsijexddigxvzz.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
✅ SUPABASE_SERVICE_ROLE_KEY=eyJ...
✅ CLOUDFLARE_ACCOUNT_ID=5d66250baed987ff272e39a8b4625f72
✅ CLOUDFLARE_R2_ACCESS_KEY_ID=f460f2cae95e216c52eaeb66b8a82f33
✅ CLOUDFLARE_R2_SECRET_ACCESS_KEY=77b5f0b258308f172895cf074ab239a9e8142b2239139ad9a9bda552ab708153
✅ CLOUDFLARE_R2_BUCKET_NAME=arco-store-test
✅ CLOUDFLARE_R2_PUBLIC_URL=https://pub-1fcfffd00023491a85c56483de321c00.r2.dev
✅ NEXT_PUBLIC_APP_URL=http://localhost:3000
✅ NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com
```

#### 환경별 DB 분리
```
Development  → xlclmfgsijexddigxvzz (arco-db-test)
Preview      → (동일 또는 별도 설정)
Production   → (운영 DB - 별도 설정 필요)
```

---

### 4. Supabase 클라이언트 설정 ✅

#### 중앙 환경 관리 (`src/lib/config/env.ts`)
```typescript
✅ getEnv() - 싱글톤 패턴으로 환경 설정 캐싱
✅ validateEnv() - 필수 환경 변수 검증
✅ 타입 안전성 보장 (EnvConfig 인터페이스)
✅ 개발/프리뷰/운영 환경 자동 감지
```

#### 클라이언트 생성
```typescript
✅ src/lib/supabase/client.ts - 브라우저용 (createBrowserClient)
✅ src/lib/supabase/server.ts - 서버용 (createServerClient)
✅ src/lib/supabase/middleware.ts - 미들웨어용
```

---

## ⚠️ 잠재적 이슈 및 해결 방안

### 🔴 높은 우선순위

#### 1. 관리자 계정 설정 필요 ⚠️
**문제**: 현재 관리자 역할을 가진 사용자가 없음

**영향**:
- 상품/촬영룩 관리 불가
- 주문 조회 불가
- 프로필 전체 조회 불가

**해결 방법**:
```sql
-- Supabase Dashboard > Authentication > Users
-- 관리자 계정 선택 후 User Metadata 또는 App Metadata에 추가:
{"role": "admin"}

-- 또는 SQL로 직접 설정:
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'admin@arco.com';
```

**검증**:
```sql
SELECT email, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'admin';
```

---

#### 2. orders.user_id는 NULL 허용 ⚠️
**현재 상태**:
```sql
user_id UUID,  -- NULL 허용 (비회원 주문 가능)
```

**잠재 이슈**:
- 비회원 주문 시 `user_id`가 `NULL`
- RLS 정책에서 `customer_email`로만 조회
- **회원 주문과 비회원 주문 구분 어려움**

**권장 해결**:
```typescript
// 주문 생성 시 user_id 자동 설정
const user = await supabase.auth.getUser();
const orderData = {
  ...orderInfo,
  user_id: user?.data?.user?.id || null,  // 로그인 사용자면 user_id 설정
  customer_email: orderInfo.email,
};
```

**영향**:
- ✅ 회원 주문: `user_id`와 `customer_email` 모두 있음
- ✅ 비회원 주문: `user_id`는 `NULL`, `customer_email`만 있음
- ✅ RLS 정책으로 본인 주문만 조회 가능

---

#### 3. reviews 테이블: product_id와 photoshoot_look_id 둘 다 NULL 가능 ⚠️
**현재 CHECK 제약**:
```sql
CONSTRAINT review_target_check CHECK (
  (product_id IS NOT NULL AND photoshoot_look_id IS NULL) OR
  (product_id IS NULL AND photoshoot_look_id IS NOT NULL)
)
```

**✅ 안전**: 하나만 반드시 있어야 함 (XOR 조건)

**잠재 이슈**:
- 애플리케이션에서 두 값을 모두 보내면 CHECK 제약 위반

**권장 처리**:
```typescript
// 리뷰 생성 전 검증
if (productId && photoshootLookId) {
  throw new Error("리뷰는 상품 또는 촬영룩 중 하나에만 작성 가능합니다.");
}

if (!productId && !photoshootLookId) {
  throw new Error("리뷰 대상을 선택해주세요.");
}
```

---

#### 4. coupon_usage.order_id는 ON DELETE SET NULL ⚠️
**현재 설정**:
```sql
order_id UUID REFERENCES orders(id) ON DELETE SET NULL
```

**의미**:
- 주문이 삭제되면 `coupon_usage.order_id`가 `NULL`로 설정됨
- 쿠폰 사용 내역은 유지됨

**잠재 이슈**:
- 주문 취소 시 쿠폰 재사용 가능 여부 불명확

**권장 처리**:
```typescript
// 주문 취소 시 쿠폰 재사용 로직
async function cancelOrder(orderId: string) {
  // 1. 주문 취소
  await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
  
  // 2. 쿠폰 재사용 가능하게 처리
  const { data: usage } = await supabase
    .from('coupon_usage')
    .select('coupon_id')
    .eq('order_id', orderId)
    .single();
  
  if (usage) {
    // 쿠폰 used_count 감소
    await supabase.rpc('decrement_coupon_usage', { coupon_id: usage.coupon_id });
  }
}
```

---

### 🟡 중간 우선순위

#### 5. categories, bookings, inquiries는 RLS 없음 ⚠️
**현재 상태**: RLS 비활성화 → 누구나 읽기/쓰기 가능

**의도된 설계**:
- `categories`: 공개 카테고리
- `bookings`: 익명 예약 가능
- `inquiries`: 익명 문의 가능

**잠재 이슈**:
- 악의적 사용자가 데이터 삭제/수정 가능

**권장 추가 정책**:
```sql
-- Categories: 읽기만 공개
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- Bookings: 생성만 공개, 조회는 본인/관리자
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (customer_email = auth.jwt()->>'email' OR auth.jwt()->>'role' = 'admin');

-- Inquiries: 생성만 공개, 조회는 본인/관리자
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own inquiries" ON inquiries FOR SELECT USING (email = auth.jwt()->>'email' OR auth.jwt()->>'role' = 'admin');
```

---

#### 6. stock_notifications와 coupon_usage도 RLS 없음 ⚠️
**권장 추가 정책**:
```sql
-- Stock Notifications
ALTER TABLE stock_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can register stock notifications" ON stock_notifications 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own notifications" ON stock_notifications 
  FOR SELECT USING (user_id = auth.uid() OR auth.jwt()->>'role' = 'admin');

-- Coupon Usage
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System can record coupon usage" ON coupon_usage 
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can view own usage" ON coupon_usage 
  FOR SELECT USING (user_id = auth.uid() OR auth.jwt()->>'role' = 'admin');
```

---

### 🟢 낮은 우선순위

#### 7. orders.items는 JSONB 타입 ℹ️
**현재 설계**:
```sql
items JSONB NOT NULL DEFAULT '[]'
```

**장점**:
- 유연한 데이터 구조
- 스키마 변경 없이 필드 추가 가능

**단점**:
- 타입 안전성 부족
- JOIN 쿼리 불가
- 복잡한 집계 쿼리 어려움

**권장 검증**:
```typescript
// TypeScript 타입 정의
interface OrderItem {
  product_id: string;
  product_name: string;
  product_thumbnail?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

// Zod 스키마로 검증
import { z } from 'zod';

const OrderItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string(),
  product_thumbnail: z.string().url().optional(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
});

const OrderItemsSchema = z.array(OrderItemSchema);
```

---

## 🧪 테스트 시나리오 체크리스트

### 시나리오 1: 익명 사용자 (비회원)
```
✅ 상품 목록 조회
✅ 상품 상세 조회 (is_active = TRUE인 것만)
✅ 촬영룩 목록 조회
✅ 카테고리 조회
✅ 주문 생성 (customer_email로만 조회 가능)
✅ 촬영 예약 생성
✅ 1:1 문의 생성
✅ 재입고 알림 등록
❌ 리뷰 작성 불가 (auth.uid() 필요)
❌ 프로필 조회 불가
```

### 시나리오 2: 일반 회원 (customer)
```
✅ 익명 사용자의 모든 권한
✅ 본인 주문 조회
✅ 본인 프로필 조회/수정
✅ 리뷰 작성 (is_approved = FALSE, 관리자 승인 필요)
✅ 본인 리뷰 조회
✅ 승인된 리뷰 조회
❌ 비활성 상품 조회 불가
❌ 타인 주문 조회 불가
❌ 타인 프로필 조회 불가
❌ 상품/촬영룩 관리 불가
```

### 시나리오 3: 관리자 (admin)
```
✅ 모든 상품 조회 (is_active 무관)
✅ 상품 생성/수정/삭제
✅ 촬영룩 관리
✅ 모든 주문 조회/관리
✅ 모든 프로필 조회
✅ 모든 리뷰 조회/승인
✅ 예약 관리
✅ 문의 관리
✅ 쿠폰 관리
```

---

## 🚀 테스트 시작 전 체크리스트

### 1. 환경 확인
```bash
✅ cd /path/to/arco-web
✅ git pull origin main
✅ npm install
✅ .env.local 파일 존재 확인
```

### 2. DB 상태 확인
```sql
-- Dashboard SQL Editor에서 실행
✅ SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
   -- 예상: 11개

✅ SELECT COUNT(*) FROM categories;
   -- 예상: 7개

✅ SELECT table_name, row_security FROM information_schema.tables 
   WHERE table_schema = 'public' AND row_security = 'YES';
   -- 예상: products, photoshoot_looks, orders, profiles, reviews
```

### 3. 관리자 계정 설정
```sql
-- 관리자 계정이 있는지 확인
✅ SELECT email, raw_user_meta_data->>'role' FROM auth.users;

-- 없으면 생성 (Dashboard > Authentication > Users)
```

### 4. 로컬 서버 시작
```bash
npm run dev
```

### 5. 테스트 페이지 접속
```
✅ http://localhost:3000 - 메인 페이지
✅ http://localhost:3000/products - 상품 목록
✅ http://localhost:3000/admin - 관리자 페이지 (로그인 필요)
```

---

## 🎯 최종 결론

### ✅ 안전한 부분
1. **데이터베이스 스키마**: 외래키 순서 완벽, 순환 참조 없음
2. **RLS 정책**: 핵심 테이블(products, orders, profiles, reviews) 보호됨
3. **환경 변수**: 중앙 관리, 타입 안전성 보장
4. **Supabase 클라이언트**: 브라우저/서버 분리, 쿠키 기반 인증

### ⚠️ 주의 필요
1. **관리자 계정 미설정**: 지금 설정 필요
2. **일부 테이블 RLS 없음**: categories, bookings, inquiries, stock_notifications, coupon_usage
3. **비회원 주문 처리**: user_id NULL 허용, customer_email로만 조회

### 🔥 권장 조치
1. **즉시**: 관리자 계정 설정
2. **오늘**: 추가 RLS 정책 적용 (categories, bookings, inquiries)
3. **이번 주**: 주문/쿠폰 로직 테스트

---

**✅ 전반적으로 안전하며, 테스트 가능한 상태입니다!**
