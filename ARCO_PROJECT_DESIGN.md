# 🐕 ARCO (아르코) - 프리미엄 반려견 패션 쇼핑몰 설계 문서

> **버전**: 1.0  
> **작성일**: 2026-01-10  
> **프로젝트명**: ARCO - Premium Dog Fashion & Photoshoot Service  
> **목표**: MVP 1차 오픈 (고객용 쇼핑몰 + 관리자 페이지)

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [비즈니스 요구사항](#2-비즈니스-요구사항)
3. [기술 스택](#3-기술-스택)
4. [시스템 아키텍처](#4-시스템-아키텍처)
5. [데이터베이스 설계](#5-데이터베이스-설계)
6. [주요 기능 명세](#6-주요-기능-명세)
7. [화면 설계](#7-화면-설계)
8. [API 설계](#8-api-설계)
9. [파일 관리 전략](#9-파일-관리-전략)
10. [보안 및 인증](#10-보안-및-인증)
11. [결제 시스템](#11-결제-시스템)
12. [프로젝트 구조](#12-프로젝트-구조)
13. [개발 일정](#13-개발-일정)

---

## 1. 프로젝트 개요

### 1.1 브랜드 정체성
- **브랜드명**: ARCO (아르코)
- **컨셉**: "DOGUE" - 반려견을 위한 하이패션
- **포지셔닝**: 프리미엄 반려견 의류 + 전문 촬영 서비스

### 1.2 핵심 가치
- 🎨 **에디토리얼 감성**: Vogue 스타일의 고급스러운 비주얼
- 📸 **통합 서비스**: 의류 판매 + 전문 촬영 예약을 한 곳에서
- 🎯 **타겟 고객**: 반려견 패션에 관심 있는 프리미엄 고객층

### 1.3 비즈니스 모델

#### 판매상품 (Retail Products)
- 일상복, 실용적 패션 아이템
- 온라인 구매 → 배송
- 일반 쇼핑몰 플로우

#### 촬영룩 (Photoshoot Looks)
- 에디토리얼, 특별한 날을 위한 의상
- 예약 시스템 → 촬영 진행 → 사진 납품
- 토큰 기반 갤러리로 사진 다운로드

---

## 2. 비즈니스 요구사항

### 2.1 고객용 쇼핑몰

#### 판매상품 플로우
```
홈 → 판매상품 리스트 → 상세페이지 → 장바구니 → 주문/결제 → 주문완료
```

**필수 기능**
- ✅ 상품 리스트 (필터링, 정렬, 검색)
- ✅ 상품 상세 (이미지 갤러리, 영상, 사이즈/옵션, 상세정보)
- ✅ 장바구니 (수량 조절, 삭제)
- ✅ 주문/결제 (배송지 입력, 결제 수단)
- ✅ 주문 내역 조회

#### 촬영룩 플로우
```
홈 → 촬영룩 리스트 → 상세페이지 → 예약하기 → 예약/결제 → 예약완료
→ 촬영 진행 (오프라인) → 납품 링크 수신 → 사진 다운로드
```

**필수 기능**
- ✅ 촬영룩 리스트 (콘셉트별 분류)
- ✅ 촬영룩 상세 (샘플 이미지/영상, 촬영 안내)
- ✅ 예약 시스템 (날짜/시간 선택, 반려견 정보 입력)
- ✅ 예약 결제
- ✅ **토큰 기반 납품 갤러리** (로그인 없이 링크로 접근)
  - 고유 토큰 링크 생성 (예: `arco.com/gallery/{unique-token}`)
  - 사진 미리보기 + 다운로드 (개별/전체)
  - 유효기간 설정 가능

#### 기타 기능
- ✅ 브랜드 소개 페이지
- ✅ 촬영 프로세스 안내
- ✅ FAQ, 고객센터
- ✅ 회원가입/로그인 (선택적, 비회원 주문 가능)

### 2.2 관리자 페이지

#### 상품 관리
- ✅ 판매상품 CRUD (등록, 수정, 삭제, 품절 관리)
- ✅ 촬영룩 CRUD
- ✅ 이미지/영상 업로드 (Cloudflare R2 + Stream)
- ✅ 재고 관리 (판매상품만)
- ✅ 카테고리/태그 관리

#### 주문 관리
- ✅ 주문 리스트 (상태별 필터링)
- ✅ 주문 상세 정보
- ✅ 배송 처리 (송장번호 입력)
- ✅ 취소/환불 처리

#### 예약 관리
- ✅ 예약 리스트 (날짜별, 상태별)
- ✅ 예약 상세 정보
- ✅ 촬영 완료 처리
- ✅ 납품 갤러리 생성 및 관리
  - 사진 업로드 (다중 선택)
  - 토큰 링크 생성
  - 고객에게 링크 전송 (이메일/SMS)
  - 갤러리 유효기간 설정

#### 분석 대시보드
- ✅ 매출 통계 (일/주/월)
- ✅ 상품별 판매 현황
- ✅ 촬영룩별 예약 현황
- ✅ 고객 분석 (신규/재방문, 지역별)
- ✅ 트래픽 분석
- ✅ 전환율 분석
- ✅ 회의/마케팅용 리포트 생성

#### 고객 관리
- ✅ 회원 리스트
- ✅ 주문/예약 이력
- ✅ 쿠폰/적립금 관리 (향후 확장)

---

## 3. 기술 스택

### 3.1 Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 14.x (App Router) | React 프레임워크, SSR/SSG |
| **TypeScript** | 5.x | 타입 안정성 |
| **Tailwind CSS** | 3.x | 유틸리티 기반 스타일링 |
| **shadcn/ui** | Latest | UI 컴포넌트 라이브러리 |
| **React Hook Form** | 7.x | 폼 관리 |
| **Zod** | 3.x | 스키마 검증 |
| **TanStack Query** | 5.x | 서버 상태 관리 |
| **Zustand** | 4.x | 클라이언트 상태 관리 (장바구니 등) |
| **date-fns** | 3.x | 날짜 처리 |
| **react-image-gallery** | Latest | 이미지 갤러리 |
| **Recharts** | 2.x | 차트/분석 대시보드 |

### 3.2 Backend & Database

| 기술 | 용도 |
|------|------|
| **Supabase** | PostgreSQL 데이터베이스, Auth, Storage |
| **Supabase Auth** | 회원가입/로그인 (이메일, 소셜 로그인) |
| **Supabase Storage** | 임시 파일 저장 (업로드 버퍼) |
| **Supabase Realtime** | 실시간 주문/예약 알림 (관리자용) |
| **PostgreSQL** | 메인 데이터베이스 (Supabase 제공) |
| **Row Level Security** | 데이터베이스 보안 |

### 3.3 파일 저장 & 스트리밍

| 서비스 | 용도 |
|--------|------|
| **Cloudflare R2** | 이미지, 납품 사진 (S3 호환, 무료 egress) |
| **Cloudflare Stream** | 상세페이지 영상 업로드/스트리밍 |
| **Cloudflare Images** | 이미지 리사이징/최적화 (선택적) |

### 3.4 결제

| 서비스 | 용도 |
|--------|------|
| **토스페이먼츠** | 주결제 시스템 (추천) |
| **아임포트** | 대안 (필요시) |

### 3.5 배포 & 인프라

| 서비스 | 용도 |
|--------|------|
| **Vercel** | Next.js 배포, Edge Functions |
| **Cloudflare CDN** | 정적 자산 CDN |
| **Vercel Analytics** | 웹 분석 |
| **Sentry** | 에러 모니터링 (선택적) |

### 3.6 개발 도구

- **pnpm** - 패키지 매니저
- **ESLint** - 코드 린팅
- **Prettier** - 코드 포맷팅
- **Husky** - Git hooks
- **Commitlint** - 커밋 메시지 규칙

---

## 4. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         사용자                                │
│                    (고객 / 관리자)                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│                  (Next.js 14 App Router)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  고객 페이지  │  │  관리자 페이지│  │   API Routes  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────┬───────────────────┬────────────────┬───────────────┘
         │                   │                │
         │                   ▼                │
         │          ┌─────────────────┐       │
         │          │  Supabase Auth  │       │
         │          └─────────────────┘       │
         │                                    │
         ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────┐
│   Supabase (DB)      │          │  Cloudflare R2       │
│  - PostgreSQL        │          │  - 상품 이미지        │
│  - RLS 보안          │          │  - 납품 사진          │
│  - Realtime          │          └──────────────────────┘
└──────────────────────┘                     │
                                             ▼
                                  ┌──────────────────────┐
                                  │ Cloudflare Stream    │
                                  │ - 상세 영상           │
                                  └──────────────────────┘
         │
         ▼
┌──────────────────────┐
│   결제 시스템         │
│  - 토스페이먼츠       │
└──────────────────────┘
```

### 4.1 데이터 플로우

#### 판매상품 구매 플로우
```
1. 고객: 상품 선택 → 장바구니 추가 (Zustand)
2. 고객: 주문하기 → 주문 정보 입력
3. Next.js API: Supabase에 주문 생성 (status: 'pending')
4. 결제 연동: 토스페이먼츠 결제창 호출
5. 결제 성공: Webhook으로 주문 상태 업데이트 (status: 'paid')
6. 관리자: 배송 처리 → 주문 상태 업데이트 (status: 'shipped')
```

#### 촬영룩 예약 플로우
```
1. 고객: 촬영룩 선택 → 날짜/시간 예약
2. 고객: 반려견 정보 입력 → 예약 결제
3. Next.js API: Supabase에 예약 생성 (status: 'confirmed')
4. 촬영 진행: (오프라인)
5. 관리자: 사진 업로드 → 납품 갤러리 생성
6. 관리자: 토큰 링크 생성 → 고객에게 전송
7. 고객: 링크 접속 → 사진 다운로드 (로그인 불필요)
```

---

## 5. 데이터베이스 설계

### 5.1 ERD 개요

```
users (회원)
  ↓ (1:N)
orders (주문)
  ↓ (1:N)
order_items (주문 상품)
  ↓ (N:1)
products (판매상품)

users (회원)
  ↓ (1:N)
bookings (예약)
  ↓ (N:1)
photoshoot_looks (촬영룩)
  ↓ (1:1)
galleries (납품 갤러리)
  ↓ (1:N)
gallery_images (갤러리 이미지)
```

### 5.2 테이블 상세 설계

#### **users** (회원)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supabase Auth와 연동
-- auth.users.id = users.id
```

#### **categories** (카테고리)
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('product', 'photoshoot')) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 예시 데이터
-- 판매상품: 아우터, 이너웨어, 액세서리, 신발
-- 촬영룩: 에디토리얼, 시즌 스페셜, 특별한 날
```

#### **products** (판매상품)
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- 원 단위 (예: 50000 = 5만원)
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- 이미지/미디어
  thumbnail_url TEXT, -- R2 URL
  images JSONB, -- [{url, alt, order}]
  video_url TEXT, -- Cloudflare Stream URL
  
  -- 메타데이터
  sizes JSONB, -- ["S", "M", "L", "XL"]
  colors JSONB, -- ["Black", "Blue"]
  tags JSONB, -- ["베스트셀러", "신상품"]
  
  -- SEO
  slug VARCHAR(200) UNIQUE NOT NULL,
  meta_title VARCHAR(100),
  meta_description TEXT,
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
```

#### **photoshoot_looks** (촬영룩)
```sql
CREATE TABLE photoshoot_looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- 촬영 가격
  duration_minutes INTEGER DEFAULT 60, -- 촬영 소요 시간
  is_active BOOLEAN DEFAULT TRUE,
  
  -- 이미지/미디어
  thumbnail_url TEXT,
  images JSONB, -- 샘플 이미지
  video_url TEXT, -- 샘플 영상
  
  -- 촬영 안내
  included_items JSONB, -- ["의상", "소품", "보정 10장"]
  requirements TEXT, -- 준비사항, 주의사항
  
  -- 메타데이터
  sizes JSONB, -- 가능한 사이즈
  tags JSONB,
  slug VARCHAR(200) UNIQUE NOT NULL,
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_photoshoot_looks_category ON photoshoot_looks(category_id);
CREATE INDEX idx_photoshoot_looks_slug ON photoshoot_looks(slug);
```

#### **orders** (주문)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL, -- 주문번호 (예: ORD-20260110-0001)
  
  -- 주문자 정보
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- 배송 정보
  shipping_name VARCHAR(100) NOT NULL,
  shipping_phone VARCHAR(20) NOT NULL,
  shipping_postcode VARCHAR(10) NOT NULL,
  shipping_address VARCHAR(255) NOT NULL,
  shipping_address_detail VARCHAR(255),
  shipping_memo TEXT,
  
  -- 금액
  total_amount INTEGER NOT NULL, -- 총 상품 금액
  shipping_fee INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  final_amount INTEGER NOT NULL, -- 최종 결제 금액
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  
  -- 결제 정보
  payment_method VARCHAR(50), -- 'card', 'transfer', 'kakao_pay'
  payment_data JSONB, -- 결제 상세 정보
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- 배송 정보
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- 취소/환불
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

#### **order_items** (주문 상품)
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  
  -- 주문 당시 정보 (스냅샷)
  product_name VARCHAR(200) NOT NULL,
  product_thumbnail TEXT,
  
  -- 옵션
  size VARCHAR(20),
  color VARCHAR(50),
  
  -- 금액
  price INTEGER NOT NULL, -- 개당 가격
  quantity INTEGER NOT NULL,
  subtotal INTEGER NOT NULL, -- price * quantity
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

#### **bookings** (촬영 예약)
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  photoshoot_look_id UUID REFERENCES photoshoot_looks(id),
  booking_number VARCHAR(50) UNIQUE NOT NULL, -- 예약번호 (예: BK-20260110-0001)
  
  -- 예약자 정보
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  
  -- 반려견 정보
  pet_name VARCHAR(100) NOT NULL,
  pet_breed VARCHAR(100), -- 견종
  pet_age INTEGER, -- 나이 (개월)
  pet_weight DECIMAL(5,2), -- 몸무게 (kg)
  pet_size VARCHAR(20), -- S, M, L, XL
  pet_notes TEXT, -- 특이사항 (성격, 건강상태 등)
  
  -- 예약 일시
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  
  -- 상태
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'paid', 'completed', 'cancelled')),
  
  -- 결제 정보
  price INTEGER NOT NULL,
  payment_method VARCHAR(50),
  payment_data JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- 촬영 완료
  completed_at TIMESTAMP WITH TIME ZONE,
  photographer_notes TEXT, -- 촬영 메모
  
  -- 취소
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_photoshoot_look_id ON bookings(photoshoot_look_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
```

#### **galleries** (납품 갤러리)
```sql
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- 토큰 기반 접근
  access_token VARCHAR(100) UNIQUE NOT NULL, -- URL에 사용될 고유 토큰
  
  -- 갤러리 정보
  title VARCHAR(200),
  description TEXT,
  
  -- 접근 제어
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE, -- 유효기간 (NULL이면 무제한)
  password VARCHAR(255), -- 비밀번호 (선택적, 해시 저장)
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  
  -- 고객 알림
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_galleries_booking_id ON galleries(booking_id);
CREATE INDEX idx_galleries_access_token ON galleries(access_token);
CREATE INDEX idx_galleries_is_active ON galleries(is_active);
```

#### **gallery_images** (갤러리 이미지)
```sql
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  
  -- 이미지 정보
  original_url TEXT NOT NULL, -- Cloudflare R2 원본 URL
  thumbnail_url TEXT, -- 썸네일 URL
  filename VARCHAR(255) NOT NULL,
  file_size INTEGER, -- 바이트
  width INTEGER,
  height INTEGER,
  format VARCHAR(20), -- jpg, png, webp
  
  -- 메타데이터
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE, -- 대표 이미지
  
  -- 통계
  download_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gallery_images_gallery_id ON gallery_images(gallery_id);
CREATE INDEX idx_gallery_images_display_order ON gallery_images(gallery_id, display_order);
```

#### **admin_users** (관리자)
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES users(id),
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'staff')),
  permissions JSONB, -- 세부 권한 설정
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.3 Row Level Security (RLS) 정책

```sql
-- 고객은 자신의 주문만 조회 가능
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- 고객은 자신의 예약만 조회 가능
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- 갤러리는 토큰으로 접근 (RLS 우회, API에서 검증)
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active galleries with valid token"
  ON galleries FOR SELECT
  USING (is_active = TRUE);

-- 관리자는 모든 데이터 접근 가능
CREATE POLICY "Admin full access"
  ON orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND is_active = TRUE
    )
  );
```

---

## 6. 주요 기능 명세

### 6.1 고객용 - 판매상품

#### 6.1.1 상품 리스트 페이지
**경로**: `/products`

**기능**
- ✅ 상품 그리드/리스트 뷰 전환
- ✅ 카테고리 필터
- ✅ 가격대 필터
- ✅ 사이즈 필터
- ✅ 정렬 (인기순, 최신순, 가격 낮은/높은 순)
- ✅ 검색 (상품명, 설명)
- ✅ 무한 스크롤 or 페이지네이션
- ✅ 품절 상품 표시

**UI 컴포넌트**
- ProductCard (썸네일, 이름, 가격, 품절 태그)
- FilterSidebar
- SortDropdown
- SearchBar

#### 6.1.2 상품 상세 페이지
**경로**: `/products/[slug]`

**기능**
- ✅ 이미지 갤러리 (확대, 슬라이드)
- ✅ 상세 영상 (Cloudflare Stream 재생)
- ✅ 가격, 재고 정보
- ✅ 사이즈/색상 선택
- ✅ 수량 선택
- ✅ 장바구니 담기
- ✅ 바로 구매
- ✅ 상세 설명 (탭: 상품정보, 사이즈가이드, 리뷰, 배송/교환)
- ✅ 관련 상품 추천

**UI 컴포넌트**
- ImageGallery
- VideoPlayer
- OptionSelector (사이즈, 색상)
- QuantitySelector
- AddToCartButton
- BuyNowButton
- ProductTabs

#### 6.1.3 장바구니
**경로**: `/cart`

**기능**
- ✅ 장바구니 상품 리스트
- ✅ 수량 변경
- ✅ 개별 삭제
- ✅ 선택 삭제
- ✅ 품절 상품 자동 제거 or 표시
- ✅ 총 금액 계산 (상품금액 + 배송비)
- ✅ 쿠폰 적용 (향후 확장)
- ✅ 주문하기 버튼

**상태 관리**: Zustand (클라이언트 전역 상태)

#### 6.1.4 주문/결제
**경로**: `/checkout`

**기능**
- ✅ 주문 상품 확인
- ✅ 주문자 정보 입력
- ✅ 배송지 입력 (우편번호 검색 API)
- ✅ 배송 메모
- ✅ 결제 수단 선택 (카드, 계좌이체, 간편결제)
- ✅ 최종 금액 확인
- ✅ 결제하기 (토스페이먼츠 연동)
- ✅ 주문 완료 페이지 (주문번호, 배송 예정일)

**결제 플로우**
```javascript
1. 주문 정보 입력 완료
2. "결제하기" 클릭
3. Supabase에 주문 생성 (status: 'pending')
4. 토스페이먼츠 SDK 호출 (결제창 오픈)
5. 결제 완료 → Webhook으로 주문 상태 업데이트 (status: 'paid')
6. 주문 완료 페이지로 리다이렉트
```

### 6.2 고객용 - 촬영룩

#### 6.2.1 촬영룩 리스트
**경로**: `/photoshoots`

**기능**
- ✅ 촬영룩 그리드 뷰 (비주얼 강조)
- ✅ 콘셉트별 필터
- ✅ 가격대 필터
- ✅ 인기순, 최신순 정렬
- ✅ 촬영 소요 시간 표시

#### 6.2.2 촬영룩 상세
**경로**: `/photoshoots/[slug]`

**기능**
- ✅ 샘플 이미지 갤러리 (실제 촬영 예시)
- ✅ 샘플 영상
- ✅ 촬영 설명 (컨셉, 스타일, 분위기)
- ✅ 포함 항목 (의상, 소품, 보정 매수)
- ✅ 촬영 시간, 가격
- ✅ 준비사항 안내
- ✅ 예약 가능한 날짜/시간 캘린더
- ✅ 예약하기 버튼

#### 6.2.3 예약 페이지
**경로**: `/photoshoots/[slug]/booking`

**기능**
- ✅ 예약자 정보 입력
- ✅ 반려견 정보 입력
  - 이름, 견종, 나이, 몸무게, 사이즈
  - 성격, 건강 상태, 특이사항
- ✅ 날짜/시간 선택 (예약 가능 여부 실시간 확인)
- ✅ 최종 금액 확인
- ✅ 결제하기
- ✅ 예약 완료 페이지 (예약번호, 촬영 안내)

#### 6.2.4 납품 갤러리 (토큰 기반)
**경로**: `/gallery/[token]` (로그인 불필요)

**기능**
- ✅ 토큰 검증 (유효성, 만료 확인)
- ✅ 비밀번호 입력 (설정된 경우)
- ✅ 사진 그리드 뷰 (썸네일)
- ✅ 사진 상세 보기 (Lightbox)
- ✅ 개별 다운로드
- ✅ 전체 다운로드 (ZIP)
- ✅ 워터마크 없는 원본 제공
- ✅ 다운로드 횟수 제한 (선택적)

**보안**
- 토큰 기반 접근 (추측 불가능한 UUID)
- 유효기간 설정 (예: 30일)
- 비밀번호 보호 (선택적)
- 다운로드 로그 기록

### 6.3 관리자 페이지

#### 6.3.1 대시보드
**경로**: `/admin`

**기능**
- ✅ 오늘의 통계 (매출, 주문, 예약, 방문자)
- ✅ 주간/월간 매출 차트
- ✅ 최근 주문 리스트
- ✅ 예약 캘린더 (촬영 일정)
- ✅ 인기 상품 TOP 5
- ✅ 인기 촬영룩 TOP 5
- ✅ 빠른 액션 (주문 처리, 예약 확인)

**차트 라이브러리**: Recharts (Line, Bar, Pie)

#### 6.3.2 상품 관리
**경로**: `/admin/products`

**기능**
- ✅ 상품 리스트 (검색, 필터, 정렬)
- ✅ 상품 등록
  - 기본 정보 (이름, 설명, 가격)
  - 카테고리 선택
  - 재고 관리
  - 이미지 업로드 (다중, 드래그 정렬)
  - 영상 업로드 (Cloudflare Stream)
  - 옵션 설정 (사이즈, 색상)
  - SEO 설정
- ✅ 상품 수정
- ✅ 상품 삭제
- ✅ 품절 관리
- ✅ 일괄 수정 (가격, 재고)

#### 6.3.3 촬영룩 관리
**경로**: `/admin/photoshoot-looks`

**기능**
- 상품 관리와 유사
- 촬영 시간, 포함 항목 설정
- 예약 가능 날짜 설정

#### 6.3.4 주문 관리
**경로**: `/admin/orders`

**기능**
- ✅ 주문 리스트
  - 상태별 필터 (결제대기, 결제완료, 배송준비, 배송중, 배송완료)
  - 날짜 범위 검색
  - 주문번호, 고객명 검색
- ✅ 주문 상세
  - 주문 정보, 배송지, 결제 정보
  - 주문 상품 리스트
- ✅ 배송 처리
  - 송장번호 입력
  - 배송 상태 변경
- ✅ 취소/환불 처리
- ✅ 엑셀 다운로드 (정산용)

#### 6.3.5 예약 관리
**경로**: `/admin/bookings`

**기능**
- ✅ 예약 리스트 (캘린더 뷰, 리스트 뷰)
- ✅ 날짜별 예약 현황
- ✅ 예약 상세 (예약자, 반려견 정보)
- ✅ 예약 확정/취소
- ✅ 촬영 완료 처리
- ✅ 메모 작성 (촬영 내용 기록)

#### 6.3.6 납품 갤러리 관리
**경로**: `/admin/galleries`

**기능**
- ✅ 갤러리 리스트 (예약 연결)
- ✅ 갤러리 생성
  - 예약 선택
  - 사진 업로드 (다중, Cloudflare R2)
  - 썸네일 자동 생성
  - 사진 정렬 (드래그 앤 드롭)
- ✅ 토큰 링크 생성 및 복사
- ✅ 유효기간 설정
- ✅ 비밀번호 설정 (선택적)
- ✅ 고객 알림 발송 (이메일/SMS)
  - 갤러리 링크 포함
  - 유효기간 안내
- ✅ 갤러리 통계 (조회수, 다운로드 수)
- ✅ 갤러리 삭제/비활성화

#### 6.3.7 통계 대시보드 (회의/마케팅용)
**경로**: `/admin/analytics`

**기능**
- ✅ **매출 분석**
  - 일별/주별/월별/연도별 매출 차트
  - 판매상품 vs 촬영룩 매출 비교
  - 목표 대비 달성률
  
- ✅ **상품 분석**
  - 카테고리별 판매 현황
  - 베스트셀러 순위
  - 재고 회전율
  - 품절 상품 알림
  
- ✅ **촬영룩 분석**
  - 콘셉트별 예약 비율
  - 시간대별 예약 분포
  - 평균 촬영 단가
  
- ✅ **고객 분석**
  - 신규 고객 vs 재방문 고객
  - 지역별 분포
  - 고객 생애 가치 (LTV)
  - 반려견 사이즈/견종 통계
  
- ✅ **트래픽 분석**
  - 페이지별 방문자 수
  - 유입 경로 (검색, 소셜, 직접)
  - 전환율 (방문 → 구매/예약)
  - 이탈률
  
- ✅ **리포트 생성**
  - 주간/월간 리포트 PDF 다운로드
  - 차트 이미지 다운로드
  - 데이터 엑셀 내보내기

---

## 7. 화면 설계

### 7.1 고객용 페이지 구조

```
/ (홈)
├── /products (판매상품)
│   ├── /products/[slug] (상품 상세)
│   └── /products/category/[category] (카테고리별)
│
├── /photoshoots (촬영룩)
│   ├── /photoshoots/[slug] (촬영룩 상세)
│   └── /photoshoots/[slug]/booking (예약)
│
├── /cart (장바구니)
├── /checkout (주문/결제)
├── /order/complete (주문 완료)
│
├── /gallery/[token] (납품 갤러리)
│
├── /my (마이페이지)
│   ├── /my/orders (주문 내역)
│   ├── /my/bookings (예약 내역)
│   └── /my/profile (회원 정보)
│
├── /about (브랜드 소개)
├── /process (촬영 프로세스)
├── /faq (자주 묻는 질문)
└── /contact (고객센터)
```

### 7.2 관리자 페이지 구조

```
/admin (대시보드)
├── /admin/products (판매상품 관리)
│   ├── /admin/products/new (상품 등록)
│   └── /admin/products/[id]/edit (상품 수정)
│
├── /admin/photoshoot-looks (촬영룩 관리)
│   ├── /admin/photoshoot-looks/new
│   └── /admin/photoshoot-looks/[id]/edit
│
├── /admin/orders (주문 관리)
│   └── /admin/orders/[id] (주문 상세)
│
├── /admin/bookings (예약 관리)
│   └── /admin/bookings/[id] (예약 상세)
│
├── /admin/galleries (납품 갤러리 관리)
│   ├── /admin/galleries/new (갤러리 생성)
│   └── /admin/galleries/[id] (갤러리 수정)
│
├── /admin/analytics (통계 대시보드)
├── /admin/customers (고객 관리)
├── /admin/categories (카테고리 관리)
└── /admin/settings (설정)
```

### 7.3 와이어프레임 (주요 화면)

#### 홈페이지
```
┌─────────────────────────────────────────────┐
│  ARCO Logo    [판매상품] [촬영룩] [소개]    │
│                                       [로그인]│
├─────────────────────────────────────────────┤
│                                              │
│       🎨 DOGUE - Premium Dog Fashion         │
│         [촬영 예약하기] [상품 보기]          │
│                                              │
├─────────────────────────────────────────────┤
│  신상품                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │상품│ │상품│ │상품│ │상품│              │
│  └────┘ └────┘ └────┘ └────┘              │
├─────────────────────────────────────────────┤
│  인기 촬영룩                                 │
│  ┌────┐ ┌────┐ ┌────┐                      │
│  │룩1 │ │룩2 │ │룩3 │                      │
│  └────┘ └────┘ └────┘                      │
├─────────────────────────────────────────────┤
│  촬영 프로세스 안내 / 고객 후기              │
└─────────────────────────────────────────────┘
```

#### 상품 상세 페이지
```
┌─────────────────────────────────────────────┐
│  Header (로고, 네비게이션)                   │
├──────────────────┬──────────────────────────┤
│                  │  상품명                   │
│  이미지 갤러리    │  ₩50,000                 │
│  ┌────────────┐ │                           │
│  │   메인     │ │  [사이즈 선택: S M L XL]  │
│  └────────────┘ │  [색상: Black Blue]       │
│  [▼][▼][▼][▼] │  [수량: - 1 +]            │
│                  │                           │
│  [영상 재생]     │  [장바구니] [바로구매]    │
│                  │                           │
│                  │  • 배송비 3,000원         │
│                  │  • 2-3일 내 배송          │
├──────────────────┴──────────────────────────┤
│  [상세정보] [사이즈] [리뷰] [배송/교환]      │
│  ───────────────────────────────────────     │
│  상품 상세 설명...                           │
└─────────────────────────────────────────────┘
```

#### 납품 갤러리 (토큰 링크)
```
┌─────────────────────────────────────────────┐
│  ARCO - 촬영 사진 납품                       │
├─────────────────────────────────────────────┤
│  [예약정보]                                  │
│  예약자: 홍길동 | 반려견: 뽀삐               │
│  촬영일: 2026-01-15                          │
├─────────────────────────────────────────────┤
│  [전체 다운로드 (ZIP)]                       │
├─────────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │사진│ │사진│ │사진│ │사진│ [다운로드]   │
│  └────┘ └────┘ └────┘ └────┘              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │사진│ │사진│ │사진│ │사진│              │
│  └────┘ └────┘ └────┘ └────┘              │
│                                              │
│  ※ 유효기간: 2026-02-15까지                 │
└─────────────────────────────────────────────┘
```

#### 관리자 대시보드
```
┌─────────────────────────────────────────────┐
│  ARCO Admin  [상품][예약][주문][통계]  [로그아웃]│
├─────────────────────────────────────────────┤
│  오늘의 통계                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │매출  │ │주문  │ │예약  │ │방문자│      │
│  │350만│ │  12  │ │  3   │ │ 256 │      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
├─────────────────────────────────────────────┤
│  주간 매출 추이                [상세 보기]   │
│  ┌───────────────────────────────────────┐ │
│  │    📊 차트 (Line Chart)               │ │
│  └───────────────────────────────────────┘ │
├──────────────────┬──────────────────────────┤
│  최근 주문 (5건)  │  오늘의 예약              │
│  ORD-001 | 배송중 │  14:00 - 에디토리얼       │
│  ORD-002 | 배송준비│ 16:00 - 시즌 스페셜      │
│  ...              │  ...                     │
└──────────────────┴──────────────────────────┘
```

---

## 8. API 설계

### 8.1 API Route 구조

```
/api
├── /products
│   ├── GET /api/products (리스트)
│   ├── GET /api/products/[slug] (상세)
│   ├── POST /api/products (등록) [Admin]
│   ├── PUT /api/products/[id] (수정) [Admin]
│   └── DELETE /api/products/[id] (삭제) [Admin]
│
├── /photoshoot-looks
│   ├── GET /api/photoshoot-looks (리스트)
│   ├── GET /api/photoshoot-looks/[slug] (상세)
│   ├── POST /api/photoshoot-looks [Admin]
│   ├── PUT /api/photoshoot-looks/[id] [Admin]
│   └── DELETE /api/photoshoot-looks/[id] [Admin]
│
├── /orders
│   ├── POST /api/orders (주문 생성)
│   ├── GET /api/orders/[id] (주문 상세)
│   ├── GET /api/orders (주문 리스트) [Auth/Admin]
│   └── PUT /api/orders/[id] (주문 상태 변경) [Admin]
│
├── /bookings
│   ├── POST /api/bookings (예약 생성)
│   ├── GET /api/bookings/[id] (예약 상세)
│   ├── GET /api/bookings (예약 리스트) [Auth/Admin]
│   ├── GET /api/bookings/availability (예약 가능 시간 조회)
│   └── PUT /api/bookings/[id] (예약 상태 변경) [Admin]
│
├── /galleries
│   ├── GET /api/galleries/[token] (갤러리 조회)
│   ├── POST /api/galleries (갤러리 생성) [Admin]
│   ├── PUT /api/galleries/[id] (갤러리 수정) [Admin]
│   ├── DELETE /api/galleries/[id] (갤러리 삭제) [Admin]
│   └── GET /api/galleries/[token]/download (이미지 다운로드)
│
├── /upload
│   ├── POST /api/upload/image (이미지 업로드 → R2)
│   ├── POST /api/upload/video (영상 업로드 → Stream)
│   └── DELETE /api/upload/[key] (파일 삭제) [Admin]
│
├── /payment
│   ├── POST /api/payment/prepare (결제 준비)
│   ├── POST /api/payment/webhook (결제 완료 Webhook)
│   └── POST /api/payment/cancel (결제 취소) [Admin]
│
├── /analytics
│   ├── GET /api/analytics/dashboard (대시보드 통계) [Admin]
│   ├── GET /api/analytics/sales (매출 분석) [Admin]
│   ├── GET /api/analytics/products (상품 분석) [Admin]
│   └── GET /api/analytics/customers (고객 분석) [Admin]
│
└── /auth
    ├── POST /api/auth/signup (회원가입)
    ├── POST /api/auth/login (로그인)
    └── POST /api/auth/logout (로그아웃)
```

### 8.2 주요 API 응답 예시

#### GET /api/products
```json
{
  "data": [
    {
      "id": "uuid-1234",
      "name": "블루 튜튜 드레스",
      "slug": "blue-tutu-dress",
      "price": 50000,
      "thumbnail_url": "https://r2.arco.com/products/...",
      "stock_quantity": 10,
      "is_active": true,
      "tags": ["베스트", "신상"],
      "category": {
        "id": 1,
        "name": "아우터"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

#### GET /api/galleries/[token]
```json
{
  "gallery": {
    "id": "uuid-5678",
    "title": "뽀삐 에디토리얼 촬영",
    "description": "2026.01.15 촬영",
    "booking": {
      "customer_name": "홍길동",
      "pet_name": "뽀삐"
    },
    "expires_at": "2026-02-15T00:00:00Z",
    "is_active": true
  },
  "images": [
    {
      "id": "uuid-img-1",
      "original_url": "https://r2.arco.com/galleries/...",
      "thumbnail_url": "https://r2.arco.com/galleries/.../thumb",
      "width": 4000,
      "height": 3000,
      "file_size": 2500000,
      "display_order": 1
    }
  ]
}
```

---

## 9. 파일 관리 전략

### 9.1 Cloudflare R2 버킷 구조

```
arco-storage/ (버킷명)
├── products/
│   ├── {product-id}/
│   │   ├── main.jpg (메인 이미지)
│   │   ├── detail-1.jpg
│   │   ├── detail-2.jpg
│   │   └── thumbnails/
│   │       ├── main-thumb.jpg
│   │       └── detail-1-thumb.jpg
│
├── photoshoots/
│   └── {look-id}/
│       ├── sample-1.jpg
│       └── sample-2.jpg
│
├── galleries/
│   └── {gallery-id}/
│       ├── {image-id}.jpg (원본)
│       └── thumbnails/
│           └── {image-id}-thumb.jpg
│
└── temp/ (임시 업로드)
    └── {session-id}/
        └── temp-file.jpg
```

### 9.2 Cloudflare Stream (영상)

- 관리자가 상품/촬영룩 등록 시 영상 업로드
- Stream API로 업로드 → Video UID 반환
- DB에 Stream URL 저장 (`https://customer-{id}.cloudflarestream.com/{video-uid}/manifest/video.m3u8`)
- 고객 페이지에서 HLS 플레이어로 재생

### 9.3 이미지 최적화 전략

**업로드 플로우**
```javascript
1. 관리자가 이미지 선택
2. 클라이언트에서 이미지 압축 (browser-image-compression)
3. Next.js API Route로 업로드
4. S3 클라이언트로 R2에 저장
5. 썸네일 생성 (Sharp 라이브러리)
6. 썸네일도 R2에 저장
7. URL 반환 → DB에 저장
```

**최적화 옵션**
- 원본: JPEG (품질 90), 최대 2000px
- 썸네일: JPEG (품질 80), 400px × 400px
- WebP 변환 (선택적)

---

## 10. 보안 및 인증

### 10.1 인증 시스템

**Supabase Auth 사용**
- 이메일/비밀번호 로그인
- 소셜 로그인 (Google, Kakao) - 선택적
- JWT 토큰 기반
- Refresh Token 자동 갱신

**역할 구분**
- `customer`: 일반 고객
- `admin`: 관리자
- `super_admin`: 최고 관리자 (설정 변경 권한)

### 10.2 API 보안

**인증 미들웨어**
```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const token = req.cookies.get('supabase-auth-token');
  
  // 관리자 페이지 접근 제한
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!token) return NextResponse.redirect('/login');
    
    // admin 권한 확인
    const user = verifyToken(token);
    if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  return NextResponse.next();
}
```

**Row Level Security (RLS)**
- Supabase에서 테이블별 접근 제어
- 고객은 자신의 주문/예약만 조회
- 관리자는 모든 데이터 접근

### 10.3 갤러리 토큰 보안

- 토큰 길이: 32자 이상 (UUID v4)
- 추측 불가능한 랜덤 생성
- 유효기간 설정 (기본 30일)
- 비밀번호 보호 (선택적, bcrypt 해싱)
- IP/User-Agent 로깅 (악용 방지)

---

## 11. 결제 시스템

### 11.1 토스페이먼츠 연동

**결제 플로우**
```javascript
// 1. 결제 준비
POST /api/payment/prepare
{
  "amount": 50000,
  "orderName": "블루 튜튜 드레스",
  "customerEmail": "customer@example.com"
}

// 2. 결제 승인 요청 (토스페이먼츠 SDK)
const tossPayments = TossPayments(clientKey);
await tossPayments.requestPayment('카드', {
  amount: 50000,
  orderId: 'ORDER-001',
  orderName: '블루 튜튜 드레스',
  successUrl: 'https://arco.com/payment/success',
  failUrl: 'https://arco.com/payment/fail'
});

// 3. 결제 완료 후 리다이렉트
GET /payment/success?paymentKey={key}&orderId={orderId}&amount={amount}

// 4. 결제 승인 확인
POST /api/payment/confirm
{
  "paymentKey": "...",
  "orderId": "ORDER-001",
  "amount": 50000
}

// 5. 주문 상태 업데이트 (status: 'paid')
```

**Webhook 처리**
```javascript
POST /api/payment/webhook (토스페이먼츠에서 호출)
{
  "eventType": "PAYMENT_STATUS_CHANGED",
  "data": {
    "paymentKey": "...",
    "orderId": "ORDER-001",
    "status": "DONE"
  }
}

// → 주문 상태 업데이트
// → 재고 차감
// → 이메일 발송
```

### 11.2 결제 취소/환불

```javascript
POST /api/payment/cancel
{
  "paymentKey": "...",
  "cancelReason": "고객 변심"
}

// → 토스페이먼츠 API 호출
// → 주문 상태 'refunded'로 변경
// → 재고 복구
```

---

## 12. 프로젝트 구조

```
/home/user/webapp/
├── .env.local                    # 환경 변수
├── .env.example                  # 환경 변수 예시
├── next.config.js                # Next.js 설정
├── tailwind.config.ts            # Tailwind CSS 설정
├── tsconfig.json                 # TypeScript 설정
├── package.json
├── pnpm-lock.yaml
│
├── public/                       # 정적 파일
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 홈페이지
│   │   ├── globals.css           # 전역 스타일
│   │   │
│   │   ├── (customer)/           # 고객용 페이지 그룹
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── photoshoots/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── booking/
│   │   │   │           └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   └── my/
│   │   │       ├── orders/
│   │   │       └── bookings/
│   │   │
│   │   ├── gallery/              # 토큰 기반 갤러리
│   │   │   └── [token]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/              # 관리자 페이지 그룹
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx      # 대시보드
│   │   │       ├── products/
│   │   │       ├── photoshoot-looks/
│   │   │       ├── orders/
│   │   │       ├── bookings/
│   │   │       ├── galleries/
│   │   │       └── analytics/
│   │   │
│   │   └── api/                  # API Routes
│   │       ├── products/
│   │       ├── photoshoot-looks/
│   │       ├── orders/
│   │       ├── bookings/
│   │       ├── galleries/
│   │       ├── upload/
│   │       ├── payment/
│   │       └── analytics/
│   │
│   ├── components/               # UI 컴포넌트
│   │   ├── ui/                   # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── customer/             # 고객용 컴포넌트
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── ...
│   │   │
│   │   ├── admin/                # 관리자용 컴포넌트
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── OrderList.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── ...
│   │   │
│   │   └── shared/               # 공통 컴포넌트
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Loading.tsx
│   │       └── ...
│   │
│   ├── lib/                      # 유틸리티
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase 클라이언트
│   │   │   ├── server.ts         # Supabase 서버 클라이언트
│   │   │   └── admin.ts          # Supabase Admin
│   │   ├── cloudflare/
│   │   │   ├── r2.ts             # R2 클라이언트
│   │   │   └── stream.ts         # Stream 클라이언트
│   │   ├── payment/
│   │   │   └── toss.ts           # 토스페이먼츠 API
│   │   ├── utils.ts              # 공통 유틸
│   │   └── constants.ts          # 상수
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── useCart.ts            # 장바구니 훅
│   │   ├── useAuth.ts            # 인증 훅
│   │   └── useProducts.ts        # 상품 데이터 훅
│   │
│   ├── stores/                   # 상태 관리 (Zustand)
│   │   ├── cartStore.ts
│   │   └── authStore.ts
│   │
│   ├── types/                    # TypeScript 타입
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── booking.ts
│   │   └── gallery.ts
│   │
│   └── styles/                   # 추가 스타일
│       └── admin.css
│
├── supabase/                     # Supabase 설정
│   ├── migrations/               # DB 마이그레이션
│   │   ├── 001_initial_schema.sql
│   │   └── 002_add_galleries.sql
│   └── seed.sql                  # 초기 데이터
│
├── scripts/                      # 유틸리티 스크립트
│   ├── generate-migration.js
│   └── seed-data.js
│
└── docs/                         # 문서
    ├── ARCO_PROJECT_DESIGN.md    # 이 문서
    ├── API.md                    # API 문서
    └── DEPLOYMENT.md             # 배포 가이드
```

---

## 13. 개발 일정

### Phase 1: 기반 구축 (Week 1-2)

**Week 1**
- ✅ Next.js 프로젝트 초기화
- ✅ Tailwind CSS, shadcn/ui 설정
- ✅ Supabase 프로젝트 생성 및 연동
- ✅ 데이터베이스 스키마 생성 (마이그레이션)
- ✅ Cloudflare R2, Stream 설정
- ✅ 기본 레이아웃 (Header, Footer)
- ✅ 디자인 시스템 구축 (컬러, 타이포그래피)

**Week 2**
- ✅ 인증 시스템 구현 (Supabase Auth)
- ✅ API Routes 기본 구조
- ✅ 파일 업로드 시스템 (R2, Stream)
- ✅ 공통 컴포넌트 개발
- ✅ 상태 관리 (Zustand) 설정

### Phase 2: 고객용 쇼핑몰 (Week 3-5)

**Week 3: 판매상품**
- ✅ 홈페이지
- ✅ 상품 리스트 페이지
- ✅ 상품 상세 페이지
- ✅ 장바구니 기능

**Week 4: 주문/결제**
- ✅ 주문 페이지
- ✅ 토스페이먼츠 연동
- ✅ 결제 완료 페이지
- ✅ 마이페이지 (주문 내역)

**Week 5: 촬영룩**
- ✅ 촬영룩 리스트/상세 페이지
- ✅ 예약 시스템 (날짜/시간 선택)
- ✅ 예약 결제
- ✅ 마이페이지 (예약 내역)

### Phase 3: 납품 갤러리 (Week 6)

- ✅ 토큰 기반 갤러리 페이지
- ✅ 이미지 그리드 뷰
- ✅ Lightbox
- ✅ 다운로드 기능 (개별/전체)
- ✅ 유효기간 확인
- ✅ 비밀번호 보호

### Phase 4: 관리자 페이지 (Week 7-9)

**Week 7: 상품/주문 관리**
- ✅ 대시보드
- ✅ 판매상품 CRUD
- ✅ 촬영룩 CRUD
- ✅ 주문 관리

**Week 8: 예약/갤러리 관리**
- ✅ 예약 관리
- ✅ 예약 캘린더
- ✅ 갤러리 생성/관리
- ✅ 이미지 업로드
- ✅ 토큰 링크 생성

**Week 9: 통계 대시보드**
- ✅ 매출 분석
- ✅ 상품/촬영룩 분석
- ✅ 고객 분석
- ✅ 트래픽 분석
- ✅ 리포트 생성

### Phase 5: 배포 및 최적화 (Week 10)

- ✅ Vercel 배포
- ✅ 도메인 연결
- ✅ SSL 인증서
- ✅ SEO 최적화
- ✅ 성능 튜닝
- ✅ 에러 모니터링 (Sentry)
- ✅ 최종 테스트
- ✅ 버그 수정
- ✅ 운영 문서 작성

---

## 14. 환경 변수

### .env.example
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=arco-storage
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# Cloudflare Stream
CLOUDFLARE_STREAM_API_TOKEN=your_stream_token

# 토스페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_SECRET_KEY=test_sk_xxxxx

# App
NEXT_PUBLIC_APP_URL=https://arco.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com

# Email (선택적)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

---

## 15. 다음 단계

### 승인 후 작업
1. ✅ 프로젝트 초기화
2. ✅ 패키지 설치
3. ✅ Supabase 프로젝트 생성
4. ✅ 데이터베이스 마이그레이션 실행
5. ✅ 기본 레이아웃 구현
6. 🚀 Phase 1 개발 시작

### 필요한 계정/서비스
- ✅ Supabase 계정 (무료 플랜 가능)
- ✅ Cloudflare 계정 (R2, Stream)
- ✅ Vercel 계정 (배포)
- ✅ 토스페이먼츠 계정 (테스트 계정)

---

## 16. 질문 사항

대표님께 확인이 필요한 사항들:

1. **디자인**
   - 브랜드 컬러는 정해져 있나요?
   - 로고는 준비되어 있나요?
   - 참고할 디자인 레퍼런스가 있나요?

2. **비즈니스**
   - 초기 상품/촬영룩 수는 얼마나 되나요?
   - 촬영 가능 시간대는? (평일/주말, 시간대)
   - 배송비 정책은? (무료 배송 기준 등)

3. **기술**
   - 도메인은 준비되어 있나요? (예: arco.com)
   - 이메일 발송 서비스는? (Gmail, SendGrid 등)
   - SMS 발송 서비스는? (알리고, 카카오톡 등)

4. **우선순위**
   - Phase 1-5 중 특히 빨리 필요한 기능이 있나요?
   - MVP에서 제외해도 되는 기능이 있나요?

---

## 📝 참고 사항

- 이 문서는 개발 진행 중 업데이트될 수 있습니다.
- 각 Phase 완료 후 대표님 검토 및 피드백을 받을 예정입니다.
- 개발 중 기술적 이슈나 일정 변경 사항은 즉시 공유하겠습니다.

---

**문서 작성**: GenSpark AI PM  
**최종 수정**: 2026-01-10  
**버전**: 1.0
