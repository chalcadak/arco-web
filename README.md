# 🐕 ARCO - Premium Dog Fashion Platform

**프리미엄 반려견 패션 브랜드 ARCO의 통합 쇼핑몰 & 촬영 예약 서비스**

---

## 📋 프로젝트 개요

ARCO는 반려견을 위한 프리미엄 의류 판매와 전문 촬영 예약 서비스를 제공하는 통합 플랫폼입니다.

### 🎯 핵심 기능

#### 1️⃣ **판매상품** (E-commerce)
- 반려견 의류 온라인 판매
- 상품 리스트 → 상세 페이지 → 장바구니 → 결제
- 카테고리: 아우터, 이너웨어, 액세서리, 신발

#### 2️⃣ **촬영룩** (Photo Booking Service)
- 전문 촬영용 의상 렌탈 및 촬영 예약
- 촬영룩 리스트 → 상세 페이지 → 예약 → 결제
- 카테고리: 에디토리얼, 시즌 스페셜, 특별한 날

#### 3️⃣ **사진 납품** (Token-based Gallery)
- 촬영 완료 후 로그인 없이 토큰으로 접근
- 갤러리 조회 및 고해상도 이미지 다운로드
- 보안성 강화된 일회성 액세스 토큰

#### 4️⃣ **관리자 시스템**
- 상품/촬영룩 관리
- 주문/예약 관리
- 납품 파일 업로드 및 갤러리 관리
- 비즈니스 분석 대시보드

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI + Custom Components
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (임시), Cloudflare R2 (프로덕션)
- **Row Level Security**: 활성화 (RLS 정책 적용)

### File & Media Management
- **Image Storage**: Cloudflare R2
- **Video Streaming**: Cloudflare Stream
- **CDN**: Cloudflare

### Payment
- **Payment Gateway**: 토스페이먼츠 (Toss Payments)

### Deployment
- **Hosting**: Vercel
- **Domain**: TBD

---

## 📁 프로젝트 구조

```
/home/user/webapp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (customer)/         # 고객용 페이지
│   │   ├── (admin)/            # 관리자 페이지
│   │   ├── api/                # API Routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                 # 공통 UI 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── label.tsx
│   │   ├── customer/           # 고객용 컴포넌트
│   │   ├── admin/              # 관리자용 컴포넌트
│   │   └── shared/             # 공통 컴포넌트
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   │
│   ├── lib/
│   │   ├── supabase/           # Supabase 클라이언트
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── cloudflare/         # Cloudflare 연동
│   │   │   ├── r2-client.ts    # R2 Storage
│   │   │   └── stream-client.ts # Video Streaming
│   │   ├── payment/            # 결제 연동
│   │   └── utils.ts            # 유틸리티 함수
│   │
│   ├── hooks/                  # Custom Hooks
│   ├── stores/                 # Zustand Stores
│   └── types/                  # TypeScript 타입 정의
│       ├── product.ts
│       ├── order.ts
│       ├── booking.ts
│       └── gallery.ts
│
├── supabase/
│   ├── migrations/             # 데이터베이스 마이그레이션
│   │   ├── 20260110000001_initial_schema.sql
│   │   └── 20260110000002_rls_policies.sql
│   ├── seed.sql                # 초기 데이터
│   └── README.md               # Supabase 설정 가이드
│
├── public/                     # 정적 파일
├── .env.local                  # 환경 변수 (gitignore)
├── .env.example                # 환경 변수 템플릿
└── package.json
```

---

## 🚀 시작하기

### 1️⃣ 사전 준비

- Node.js 20+ 설치
- npm 또는 yarn 패키지 매니저
- Supabase 계정 ([https://supabase.com](https://supabase.com))
- Cloudflare 계정 (선택적, 프로덕션 배포 시)

### 2️⃣ 설치

```bash
# 저장소 클론
git clone https://github.com/chalcadak/arco-web.git
cd arco-web

# 의존성 설치
npm install
```

### 3️⃣ 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 실제 값으로 수정:

```bash
cp .env.example .env.local
```

필수 환경 변수:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudflare R2 (선택적)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=arco-storage

# Cloudflare Stream (선택적)
CLOUDFLARE_STREAM_API_TOKEN=your_stream_token

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4️⃣ 데이터베이스 설정

**Supabase 대시보드에서 SQL 실행:**

1. [Supabase Dashboard](https://supabase.com/dashboard) 로그인
2. `arco-web` 프로젝트 선택
3. 왼쪽 메뉴 **SQL Editor** 클릭
4. 다음 순서로 SQL 파일 실행:
   - `supabase/migrations/20260110000001_initial_schema.sql`
   - `supabase/migrations/20260110000002_rls_policies.sql`
   - `supabase/seed.sql` (샘플 데이터, 선택적)

자세한 내용: [`supabase/README.md`](./supabase/README.md)

### 5️⃣ 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

**테스트 엔드포인트:**
- Database 연결: [http://localhost:3000/api/test-db](http://localhost:3000/api/test-db)
- 샘플 데이터: [http://localhost:3000/api/test-data](http://localhost:3000/api/test-data)

---

## 📊 데이터베이스 스키마

### 주요 테이블

| 테이블 | 설명 | 주요 컬럼 |
|--------|------|-----------|
| `users` | 회원 정보 | id, email, name, phone |
| `categories` | 카테고리 | id, name, slug, type (product/photoshoot) |
| `products` | 판매 상품 | id, name, price, stock, images |
| `photoshoot_looks` | 촬영룩 | id, name, price, duration_minutes |
| `orders` | 주문 정보 | id, order_number, user_id, status |
| `bookings` | 촬영 예약 | id, booking_number, user_id, status |
| `galleries` | 납품 갤러리 | id, booking_id, access_token |
| `gallery_images` | 갤러리 이미지 | id, gallery_id, file_url |
| `admin_users` | 관리자 | user_id, role, permissions |

**ERD 및 상세 정보:** [`ARCO_PROJECT_DESIGN.md`](./ARCO_PROJECT_DESIGN.md)

---

## 🎨 디자인 시스템

### 컬러 팔레트

```css
/* 프리미엄 뉴트럴 톤 */
--background: #ffffff;
--foreground: #171717;
--primary: #1a1a1a;
--secondary: #f5f5f5;
--accent: #e5e5e5;
```

### Typography

- **본문**: system-ui, sans-serif
- **제목**: font-weight: 600-700

### UI 컴포넌트

- `Button`: 7가지 variant (default, outline, ghost, link, destructive, secondary)
- `Card`: 프리미엄 느낌의 카드 레이아웃
- `Badge`: 상태 표시용 (default, success, warning, destructive)
- `Input`, `Textarea`, `Label`: Form 요소

---

## 📦 주요 패키지

```json
{
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@supabase/supabase-js": "^2.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^5.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@aws-sdk/client-s3": "^3.x",
    "@radix-ui/react-slot": "^1.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "date-fns": "^4.x"
  }
}
```

---

## 🗓️ 개발 로드맵

### ✅ Phase 1: 기반 구축 - **완료** (2026-01-10)
- [x] Next.js 프로젝트 초기화
- [x] Supabase 설정 및 데이터베이스 스키마
- [x] Cloudflare R2/Stream 클라이언트 준비
- [x] 디자인 시스템 및 공통 UI 컴포넌트
- [x] 기본 레이아웃 (Header, Footer)
- [x] 홈페이지 구현

### ✅ Phase 2: 고객용 쇼핑몰 - **완료** (2026-01-11)
- [x] 판매상품 리스트/상세 페이지
- [x] 장바구니 기능
- [x] 촬영룩 리스트/상세 페이지
- [x] 예약 시스템 (날짜/시간 선택, 반려견 정보)
- [x] 예약 완료 페이지

### ✅ Phase 3: 관리자 페이지 - **완료** (2026-01-12)
- [x] 관리자 인증 시스템 (로그인, Protected Routes)
- [x] 관리자 레이아웃 (사이드바, 헤더)
- [x] 대시보드 (통계 카드, 최근 예약)
- [x] 예약 관리 (목록/상세/상태 변경)
- [x] 상품 관리 (CRUD)
- [x] 촬영룩 관리 (CRUD)

### ✅ Phase 4: 결제 시스템 - **완료** (2026-01-12)
- [x] Toss Payments 연동
- [x] 결제 페이지 (배송지 정보 + Toss 위젯)
- [x] 결제 성공/실패 페이지
- [x] 주문 생성 API
- [x] 주문 관리 (목록/상세/상태 변경)

### ✅ Phase 5: 이미지 업로드 - **완료** (2026-01-12)
- [x] Cloudflare R2 연동
- [x] 이미지 업로드 API
- [x] 이미지 최적화 (Sharp, WebP, 리사이즈)
- [x] 드래그 앤 드롭 UI
- [x] 이미지 미리보기 및 관리 (삭제, 순서변경)

### ✅ Phase 6: Vercel 배포 - **진행 중** (2026-01-12)
- [x] 배포 가이드 문서 작성
- [ ] Vercel 프로젝트 설정
- [ ] 환경 변수 설정
- [ ] 첫 배포 및 테스트
- [ ] 도메인 연결 (선택사항)

### ⏳ Phase 7: 갤러리 납품 시스템 (예정)
- [ ] 촬영 완료 후 사진 업로드
- [ ] 고객 전용 토큰 생성
- [ ] 토큰 기반 갤러리 조회
- [ ] 사진 다운로드 기능

---

## 🤝 기여 가이드

### Git Workflow

1. `genspark_ai_developer` 브랜치에서 작업
2. 기능 개발 후 커밋
3. Pull Request 생성
4. 코드 리뷰 후 `main` 브랜치로 병합

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 설정 등
```

---

## 📞 문의

- **프로젝트 관리자**: ARCO Team
- **GitHub Repository**: [https://github.com/chalcadak/arco-web](https://github.com/chalcadak/arco-web)
- **이메일**: admin@arco.com (예시)

---

## 📄 라이선스

Private Project - All Rights Reserved

---

## 📚 추가 문서

- [📋 프로젝트 설계 문서](./ARCO_PROJECT_DESIGN.md)
- [✅ Phase 1 완료 보고서](./PHASE1_COMPLETE.md)
- [✅ Phase 2 완료 보고서](./PHASE2_COMPLETE.md)
- [✅ Phase 3 완료 보고서](./PHASE3_COMPLETE.md)
- [✅ Phase 4 완료 보고서](./PHASE4_COMPLETE.md)
- [✅ Phase 5 완료 보고서](./PHASE5_COMPLETE.md)
- [🚀 Vercel 배포 가이드](./VERCEL_DEPLOYMENT_GUIDE.md)
- [🗄️ Supabase 설정 가이드](./supabase/README.md)

---

**Built with ❤️ by ARCO Team**
