# 🚀 ARCO Vercel 배포 가이드

**프로젝트**: ARCO 웹 애플리케이션  
**배포 플랫폼**: Vercel  
**작성일**: 2026-01-12

---

## 📋 배포 준비사항

### 1. 필요한 계정
- ✅ GitHub 계정 (저장소: https://github.com/chalcadak/arco-web)
- ✅ Vercel 계정 (https://vercel.com)
- ✅ Supabase 프로젝트
- ✅ Toss Payments 계정
- ✅ Cloudflare R2 버킷

### 2. 환경 변수 준비
아래 환경 변수들을 준비해주세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Toss Payments
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_xxxxxxxxxxxx
TOSS_SECRET_KEY=live_sk_xxxxxxxxxxxx

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=arco-storage
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# App URL (배포 후 업데이트)
NEXT_PUBLIC_APP_URL=https://arco-web.vercel.app

# Admin Email
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com

# SMTP (선택사항)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 🚀 Vercel 배포 단계

### Step 1: Vercel 계정 연결

1. **Vercel 접속**: https://vercel.com
2. **GitHub로 로그인**: "Continue with GitHub"
3. **저장소 권한 부여**: chalcadak/arco-web 접근 권한

### Step 2: 새 프로젝트 생성

1. **Dashboard** → **"Add New..."** → **"Project"**
2. **Import Git Repository**
   - 저장소 선택: `chalcadak/arco-web`
   - Branch 선택: `genspark_ai_developer` (또는 `main`)
3. **Configure Project**
   - Project Name: `arco-web` (또는 원하는 이름)
   - Framework Preset: `Next.js` (자동 감지)
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build` (자동 설정)
   - Output Directory: `.next` (자동 설정)

### Step 3: 환경 변수 설정

1. **Environment Variables** 섹션에서 모든 환경 변수 추가
2. **Environment** 선택: `Production`, `Preview`, `Development` 모두 체크
3. **주의사항**:
   - `NEXT_PUBLIC_APP_URL`은 배포 후 실제 URL로 업데이트
   - 테스트 API 키가 아닌 **프로덕션 API 키** 사용
   - `TOSS_CLIENT_KEY`와 `TOSS_SECRET_KEY`는 `live_` 접두사 사용

### Step 4: 배포 시작

1. **"Deploy"** 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 대기 (약 3-5분)

### Step 5: 배포 확인

1. **배포 완료 후 URL 확인**
   - 기본 URL: `https://arco-web.vercel.app`
   - 또는 커스텀 도메인
2. **기능 테스트**
   - 홈페이지 로딩 확인
   - 판매상품 목록/상세 확인
   - 촬영룩 목록/상세 확인
   - 관리자 로그인 확인
   - 이미지 업로드 확인
   - 결제 기능 확인 (테스트 결제)

---

## 🔄 환경 변수 업데이트

### 배포 후 필수 업데이트

배포가 완료되면 다음 환경 변수를 업데이트해주세요:

1. **Vercel Dashboard** → **프로젝트 선택** → **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_APP_URL` 수정
   - 기존: `http://localhost:3000`
   - 변경: `https://arco-web.vercel.app` (실제 배포 URL)
3. **Redeploy** 버튼 클릭 (환경 변수 적용을 위해 재배포)

### Supabase 설정 업데이트

1. **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. **Site URL** 업데이트: `https://arco-web.vercel.app`
3. **Redirect URLs** 추가:
   - `https://arco-web.vercel.app/auth/callback`
   - `https://arco-web.vercel.app/admin`

### Toss Payments 설정 업데이트

1. **Toss Payments 개발자 센터**
2. **결제 승인 URL** 업데이트:
   - `https://arco-web.vercel.app/api/orders`
3. **리디렉션 URL** 업데이트:
   - 성공: `https://arco-web.vercel.app/checkout/success`
   - 실패: `https://arco-web.vercel.app/checkout/fail`

---

## 🌐 커스텀 도메인 연결 (선택사항)

### 도메인 구매
- **추천 서비스**: Namecheap, GoDaddy, Cloudflare
- **도메인 예시**: `arco.shop`, `arco-pet.com`

### Vercel에 도메인 추가

1. **Vercel Dashboard** → **프로젝트** → **Settings** → **Domains**
2. **Add Domain**
3. 도메인 입력 (예: `arco.shop`)
4. **DNS 설정** 안내에 따라 레코드 추가
   - Type: `A` / Name: `@` / Value: `76.76.21.21`
   - Type: `CNAME` / Name: `www` / Value: `cname.vercel-dns.com`
5. DNS 전파 대기 (최대 48시간, 보통 1-2시간)
6. SSL 인증서 자동 발급 (Let's Encrypt)

---

## 🧪 배포 후 테스트 체크리스트

### 고객 페이지 (Public)
- [ ] 홈페이지 (`/`)
- [ ] 판매상품 목록 (`/products`)
- [ ] 판매상품 상세 (`/products/[slug]`)
- [ ] 장바구니 (`/cart`)
- [ ] 촬영룩 목록 (`/photoshoots`)
- [ ] 촬영룩 상세 (`/photoshoots/[slug]`)
- [ ] 예약 폼 (`/photoshoots/[slug]/booking`)
- [ ] 예약 완료 (`/bookings/[id]/success`)
- [ ] 결제 페이지 (`/checkout`)
- [ ] 결제 성공 (`/checkout/success`)
- [ ] 결제 실패 (`/checkout/fail`)

### 관리자 페이지 (Admin)
- [ ] 관리자 로그인 (`/admin/login`)
- [ ] 대시보드 (`/admin/dashboard`)
- [ ] 예약 관리 (`/admin/bookings`)
- [ ] 예약 상세 (`/admin/bookings/[id]`)
- [ ] 상품 관리 (`/admin/products`)
- [ ] 상품 등록 (`/admin/products/new`)
- [ ] 상품 수정 (`/admin/products/[id]/edit`)
- [ ] 촬영룩 관리 (`/admin/photoshoots`)
- [ ] 촬영룩 등록 (`/admin/photoshoots/new`)
- [ ] 촬영룩 수정 (`/admin/photoshoots/[id]/edit`)
- [ ] 주문 관리 (`/admin/orders`)
- [ ] 주문 상세 (`/admin/orders/[id]`)

### 기능 테스트
- [ ] 이미지 업로드 (R2)
- [ ] 이미지 최적화 (WebP)
- [ ] 결제 기능 (Toss Payments 테스트 모드)
- [ ] 주문 생성 및 상태 변경
- [ ] 예약 생성 및 상태 변경
- [ ] 상품/촬영룩 CRUD
- [ ] 반응형 디자인 (모바일, 태블릿, 데스크톱)

### 성능 테스트
- [ ] **Lighthouse 점수**
  - Performance: 90+ 목표
  - Accessibility: 90+ 목표
  - Best Practices: 90+ 목표
  - SEO: 90+ 목표
- [ ] **페이지 로딩 속도**
  - First Contentful Paint (FCP): < 1.8s
  - Largest Contentful Paint (LCP): < 2.5s
- [ ] **이미지 최적화 확인**
  - WebP 포맷 사용
  - Lazy loading 적용

---

## 🐛 일반적인 배포 이슈 및 해결 방법

### 이슈 1: 빌드 실패 (Build Error)

**증상**: Vercel에서 빌드가 실패하고 에러 메시지 표시

**해결 방법**:
1. 로컬에서 `npm run build` 테스트
2. 에러 로그 확인 및 수정
3. 타입 에러 수정 (TypeScript)
4. 환경 변수 누락 확인

### 이슈 2: 환경 변수 오류

**증상**: API 호출 실패, "undefined" 오류

**해결 방법**:
1. Vercel Dashboard → Settings → Environment Variables 확인
2. 모든 필수 환경 변수 입력 확인
3. Production, Preview, Development 모두 체크
4. Redeploy 실행

### 이슈 3: Supabase 연결 실패

**증상**: 데이터 로딩 실패, 인증 오류

**해결 방법**:
1. Supabase URL 및 키 확인
2. Supabase → Authentication → URL Configuration 확인
3. Site URL 및 Redirect URLs 업데이트
4. RLS (Row Level Security) 정책 확인

### 이슈 4: 이미지 업로드 실패

**증상**: R2 업로드 오류

**해결 방법**:
1. Cloudflare R2 환경 변수 확인
2. R2 버킷의 Public Access 설정 확인
3. CORS 설정 확인
4. API 키 권한 확인

### 이슈 5: 결제 기능 오류

**증상**: Toss Payments 위젯 로딩 실패

**해결 방법**:
1. Toss Payments API 키 확인 (`live_` 접두사)
2. Toss 개발자 센터에서 도메인 등록
3. 결제 승인 URL 및 리디렉션 URL 업데이트
4. HTTPS 사용 확인

---

## 🔒 보안 체크리스트

### 환경 변수 보안
- [ ] 프로덕션 API 키 사용 (테스트 키 X)
- [ ] `.env.local` 파일이 `.gitignore`에 포함
- [ ] GitHub에 환경 변수 노출 안 됨
- [ ] Vercel에만 환경 변수 저장

### Supabase 보안
- [ ] RLS (Row Level Security) 정책 활성화
- [ ] Service Role Key는 서버사이드만 사용
- [ ] Public Anon Key만 클라이언트 노출

### API 보안
- [ ] API 엔드포인트 인증 확인
- [ ] Rate limiting 고려 (추후)
- [ ] CORS 설정 확인

---

## 📊 배포 후 모니터링

### Vercel Analytics
- **활성화**: Settings → Analytics → Enable
- **확인 항목**:
  - 페이지 방문 수
  - 로딩 속도
  - 에러 발생률
  - 사용자 위치

### Supabase 모니터링
- **Database**: 쿼리 성능 확인
- **Authentication**: 로그인 시도 모니터링
- **Storage**: R2 사용량 확인

### 로그 확인
- **Vercel Logs**: Functions → Logs
- **브라우저 콘솔**: 클라이언트 에러 확인

---

## 🎯 배포 완료 후 할 일

### 1. 실제 데이터 마이그레이션
- [ ] 실제 상품 데이터 등록
- [ ] 실제 촬영룩 데이터 등록
- [ ] 카테고리 설정

### 2. SEO 최적화
- [ ] 메타 태그 최적화
- [ ] 사이트맵 생성
- [ ] robots.txt 설정
- [ ] Google Search Console 등록

### 3. 성능 최적화
- [ ] 이미지 lazy loading 확인
- [ ] 코드 스플리팅 최적화
- [ ] 캐싱 전략 수립

### 4. 마케팅 준비
- [ ] Google Analytics 연동
- [ ] Facebook Pixel 설치 (선택)
- [ ] 소셜 미디어 공유 이미지 설정

---

## 🚀 빠른 배포 커맨드

```bash
# 로컬 빌드 테스트
npm run build
npm start

# Vercel CLI 사용 (선택사항)
npm install -g vercel
vercel login
vercel --prod
```

---

## 📞 지원 및 문의

### Vercel 지원
- 문서: https://vercel.com/docs
- 커뮤니티: https://github.com/vercel/vercel/discussions

### 추가 도움
- GenSpark AI Developer에게 문의
- GitHub Issues: https://github.com/chalcadak/arco-web/issues

---

## 🎉 축하합니다!

배포가 완료되면 ARCO 웹 애플리케이션이 전 세계에서 접근 가능합니다! 🌍

**배포 URL**: https://arco-web.vercel.app (예시)

---

**작성일**: 2026-01-12  
**작성자**: GenSpark AI Developer  
**프로젝트**: ARCO Web Application  
**Phase**: 6 - Vercel Deployment
