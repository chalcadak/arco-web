# 🧪 ARCO 로컬 테스트 가이드 (대표님용)

**작성일:** 2026-01-12  
**목적:** 대표님이 직접 로컬 환경에서 ARCO 프로젝트를 테스트하는 방법

---

## 📋 목차

1. [시작하기 전에](#시작하기-전에)
2. [프로젝트 설정](#프로젝트-설정)
3. [테스트 순서](#테스트-순서)
4. [자주 발생하는 문제](#자주-발생하는-문제)
5. [테스트 체크리스트](#테스트-체크리스트)

---

## 🚀 시작하기 전에

### 필요한 것들
- ✅ Node.js 20+ 설치
- ✅ Git 설치
- ✅ 코드 에디터 (VSCode 추천)
- ✅ 브라우저 (Chrome 추천)

### 예상 소요 시간
- **프로젝트 설정:** 10분
- **전체 테스트:** 1시간

---

## 📦 프로젝트 설정

### 1단계: 저장소 클론

```bash
# 터미널 열기
cd ~/Desktop  # 또는 원하는 폴더

# 저장소 클론
git clone https://github.com/chalcadak/arco-web.git

# 프로젝트 폴더로 이동
cd arco-web

# genspark_ai_developer 브랜치로 전환
git checkout genspark_ai_developer

# 최신 코드 받기
git pull origin genspark_ai_developer
```

### 2단계: 의존성 설치

```bash
# npm 패키지 설치 (2-3분 소요)
npm install
```

### 3단계: 환경 변수 확인

`.env.local` 파일이 프로젝트 루트에 있는지 확인하세요.

```bash
# 환경 변수 확인
cat .env.local | grep -E "(SUPABASE|CLOUDFLARE|TOSS)"
```

**필수 환경 변수:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudflare R2 (이미지 업로드)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=arco-storage
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev

# Cloudflare Stream (영상 업로드, 선택사항)
# CLOUDFLARE_STREAM_API_TOKEN=your-stream-token

# Toss Payments
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxxxxxxxxx
TOSS_SECRET_KEY=test_sk_xxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com
```

### 4단계: Supabase 연동 확인

```bash
# 빠른 연동 테스트 (3초)
npm run test:supabase
```

**성공 예시:**
```
✅ 모든 테스트 완료!

📊 요약:
   - Categories: ✅ 5 개
   - Products: ✅ 4 개
   - Photoshoot Looks: ✅ 3 개
   - Bookings: ✅ 0 개
   - Orders: ✅ 0 개

🎉 Supabase 연동이 정상적으로 작동합니다!
```

**실패 시:**
- [SUPABASE_CONNECTION_TEST_GUIDE.md](./SUPABASE_CONNECTION_TEST_GUIDE.md) 참고
- 환경 변수 재확인
- Supabase 대시보드에서 API 키 확인

### 5단계: 개발 서버 시작

```bash
# 개발 서버 시작
npm run dev
```

**성공 메시지:**
```
▲ Next.js 16.1.1 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000
- Environments: .env.local

✓ Starting...
✓ Ready in 2.5s
```

브라우저에서 http://localhost:3000 을 열면 홈페이지가 보입니다!

---

## 🧪 테스트 순서

### Phase 1: 기본 페이지 확인 (10분)

#### 1-1. 홈페이지
- **URL:** http://localhost:3000
- **확인 사항:**
  - [ ] 페이지가 정상적으로 로딩됨
  - [ ] 헤더 메뉴가 보임 (홈, 상품, 촬영룩, 갤러리)
  - [ ] Hero 섹션이 보임
  - [ ] 푸터가 보임

#### 1-2. 상품 목록 페이지
- **URL:** http://localhost:3000/products
- **확인 사항:**
  - [ ] 상품 목록이 보임 (4개)
  - [ ] 상품 이미지가 로딩됨
  - [ ] 상품 이름, 가격이 표시됨
  - [ ] 카테고리 필터가 작동함

#### 1-3. 상품 상세 페이지
- **URL:** http://localhost:3000/products/classic-cotton-tshirt (예시)
- **확인 사항:**
  - [ ] 상품 이미지가 보임
  - [ ] 상품 설명이 표시됨
  - [ ] 사이즈 선택 가능
  - [ ] 색상 선택 가능
  - [ ] 수량 선택 가능
  - [ ] "장바구니에 추가" 버튼이 작동함

#### 1-4. 촬영룩 목록 페이지
- **URL:** http://localhost:3000/photoshoots
- **확인 사항:**
  - [ ] 촬영룩 목록이 보임 (3개)
  - [ ] 촬영룩 이미지가 로딩됨
  - [ ] 촬영룩 이름, 가격, 소요시간이 표시됨
  - [ ] 카테고리 필터가 작동함

#### 1-5. 촬영룩 상세 페이지
- **URL:** http://localhost:3000/photoshoots/vintage-editorial (예시)
- **확인 사항:**
  - [ ] 촬영룩 이미지가 보임
  - [ ] 촬영룩 설명이 표시됨
  - [ ] 포함 항목이 표시됨
  - [ ] 준비물이 표시됨
  - [ ] "예약하기" 버튼이 보임

---

### Phase 2: Supabase 연동 (10분)

#### 2-1. 예약 시스템
- **시작:** http://localhost:3000/photoshoots/vintage-editorial
- **순서:**
  1. "예약하기" 버튼 클릭
  2. http://localhost:3000/photoshoots/vintage-editorial/booking 으로 이동
  3. 예약 폼 작성:
     - 고객명: 테스트
     - 이메일: test@example.com
     - 전화번호: 010-1234-5678
     - 반려견 이름: 초코
     - 반려견 품종: 포메라니안
     - 예약 날짜: 내일 날짜
     - 예약 시간: 14:00
     - 특이사항: 테스트 예약입니다
  4. "예약하기" 버튼 클릭
  5. 예약 완료 페이지로 이동

**확인 사항:**
- [ ] 예약 폼이 정상 작동
- [ ] 날짜 선택기가 작동
- [ ] 시간 선택이 가능
- [ ] 예약 완료 메시지 표시
- [ ] Supabase 대시보드에서 bookings 테이블에 데이터 추가 확인

**Supabase 확인 방법:**
1. https://supabase.com/dashboard 접속
2. ARCO 프로젝트 선택
3. Table Editor > bookings 테이블
4. 방금 생성한 예약 데이터 확인

---

### Phase 3: 관리자 인증 (10분)

#### 3-1. 관리자 로그인
- **URL:** http://localhost:3000/admin/login
- **계정:**
  - 이메일: admin@arco.com
  - 비밀번호: (Supabase에서 설정한 비밀번호)

**확인 사항:**
- [ ] 로그인 페이지가 보임
- [ ] 이메일, 비밀번호 입력 가능
- [ ] 로그인 버튼 클릭 시 대시보드로 이동
- [ ] 로그인 실패 시 에러 메시지 표시

**로그인이 안 되는 경우:**
1. Supabase 대시보드 > Authentication > Users
2. admin@arco.com 계정 확인
3. 비밀번호 재설정 (Reset Password)
4. 새 비밀번호로 다시 로그인

#### 3-2. 관리자 대시보드
- **URL:** http://localhost:3000/admin/dashboard
- **확인 사항:**
  - [ ] 대시보드가 보임
  - [ ] 통계 카드가 표시됨 (상품, 촬영룩, 예약, 주문)
  - [ ] 최근 예약 목록이 보임
  - [ ] 최근 주문 목록이 보임

#### 3-3. 예약 관리
- **URL:** http://localhost:3000/admin/bookings
- **확인 사항:**
  - [ ] 예약 목록이 보임
  - [ ] 방금 생성한 예약이 표시됨
  - [ ] 예약 상태가 "대기중"으로 표시됨
  - [ ] 예약 클릭 시 상세 페이지로 이동
  - [ ] 예약 상태 변경 가능 (대기중 → 확정 → 완료)

---

### Phase 4: 결제 시스템 (15분)

#### 4-1. 장바구니
- **시작:** http://localhost:3000/products
- **순서:**
  1. 상품 클릭 → 상세 페이지
  2. 사이즈, 색상 선택
  3. "장바구니에 추가" 클릭
  4. 우측 상단 장바구니 아이콘 클릭
  5. http://localhost:3000/cart 페이지로 이동

**확인 사항:**
- [ ] 장바구니에 상품이 추가됨
- [ ] 수량 변경 가능 (+/- 버튼)
- [ ] 상품 삭제 가능
- [ ] 총 금액 계산 정확
- [ ] 배송비 계산 (5만원 이상 무료)

#### 4-2. 주문/결제
- **시작:** http://localhost:3000/cart
- **순서:**
  1. "주문하기" 버튼 클릭
  2. http://localhost:3000/checkout 으로 이동
  3. 배송지 정보 입력:
     - 받는분: 테스트
     - 전화번호: 010-1234-5678
     - 주소: 서울시 강남구 테헤란로 123
     - 상세주소: 4층
     - 요청사항: 문 앞에 놔주세요
  4. Toss Payments 위젯 확인
  5. **테스트 결제 진행:**
     - 카드번호: 아무 카드 (테스트 모드)
     - 유효기간: 아무거나
     - CVC: 123
  6. "결제하기" 버튼 클릭

**⚠️ 주의:**
- Toss Payments는 **테스트 모드**로 설정되어 있어야 합니다
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`가 `test_ck_`로 시작하는지 확인
- 실제 결제는 되지 않습니다

**확인 사항:**
- [ ] 결제 페이지가 정상 로딩
- [ ] 배송지 폼이 작동
- [ ] Toss Payments 위젯이 표시됨
- [ ] 주문 금액이 정확
- [ ] 결제 버튼 클릭 시 처리됨

#### 4-3. 결제 성공/실패
- **성공 URL:** http://localhost:3000/checkout/success?orderId=xxx&paymentKey=xxx&amount=xxx
- **실패 URL:** http://localhost:3000/checkout/fail?code=xxx&message=xxx

**확인 사항:**
- [ ] 성공 페이지에 주문 정보 표시
- [ ] 주문 번호, 결제 금액, 배송지 표시
- [ ] 실패 페이지에 에러 메시지 표시
- [ ] "다시 시도" 버튼 작동

#### 4-4. 주문 관리 (관리자)
- **URL:** http://localhost:3000/admin/orders
- **확인 사항:**
  - [ ] 주문 목록이 보임
  - [ ] 방금 생성한 주문이 표시됨
  - [ ] 주문 상태가 "결제완료"로 표시됨
  - [ ] 주문 클릭 시 상세 페이지로 이동
  - [ ] 주문 상태 변경 가능 (결제완료 → 배송준비 → 배송중 → 배송완료)

---

### Phase 5: 이미지 업로드 (10분)

#### 5-1. 상품 이미지 업로드
- **URL:** http://localhost:3000/admin/products/new
- **순서:**
  1. 관리자 로그인
  2. 상품 등록 페이지로 이동
  3. 기본 정보 입력:
     - 상품명: 테스트 상품
     - 가격: 50000
     - 재고: 100
     - 카테고리 선택
  4. **이미지 업로드 섹션:**
     - "이미지 선택" 또는 드래그 앤 드롭
     - 이미지 파일 선택 (JPG, PNG, WebP)
     - 업로드 진행률 확인
     - 미리보기 확인
     - 여러 이미지 추가 (최대 10개)
     - 이미지 순서 변경 (드래그)
     - 이미지 삭제
  5. "등록하기" 버튼 클릭

**확인 사항:**
- [ ] 이미지 파일 선택 가능
- [ ] 드래그 앤 드롭 작동
- [ ] 업로드 진행률 표시
- [ ] 미리보기 이미지 표시
- [ ] 여러 이미지 업로드 가능
- [ ] 이미지 순서 변경 가능 (드래그)
- [ ] 이미지 삭제 가능
- [ ] 대표 이미지 표시 (첫 번째 이미지)
- [ ] 업로드된 이미지가 Cloudflare R2에 저장됨
- [ ] 저장 후 상품 상세 페이지에 이미지 표시

**Cloudflare R2 확인:**
1. https://dash.cloudflare.com 접속
2. R2 > arco-storage 버킷
3. 업로드된 이미지 파일 확인
4. Public URL로 이미지 접근 가능

#### 5-2. 촬영룩 이미지 업로드
- **URL:** http://localhost:3000/admin/photoshoots/new
- **과정:** 상품 이미지 업로드와 동일

---

### Phase 6: 영상 업로드 (5분, 선택사항)

**⚠️ 주의:** Cloudflare Stream은 유료 서비스입니다. 테스트를 원하시면 진행하고, 그렇지 않으면 건너뛰세요.

#### 6-1. 영상 업로드 (선택사항)
- **URL:** http://localhost:3000/admin/products/new 또는 /admin/photoshoots/new
- **순서:**
  1. **영상 업로드 섹션:**
     - "영상 선택" 버튼 클릭
     - 영상 파일 선택 (MP4, MOV, AVI, MKV, WebM)
     - 최대 200MB
     - 업로드 진행률 확인
     - 썸네일 미리보기 확인
     - 영상 상태 확인 (queued → inprogress → ready)
  2. "등록하기" 버튼 클릭

**확인 사항:**
- [ ] 영상 파일 선택 가능
- [ ] 업로드 진행률 표시
- [ ] 썸네일 자동 생성
- [ ] 영상 상태 표시 (처리 중, 준비 완료)
- [ ] 저장 후 상품/촬영룩 페이지에 영상 플레이어 표시
- [ ] 영상 재생 가능 (HLS 스트리밍)

**Cloudflare Stream 확인:**
1. https://dash.cloudflare.com 접속
2. Stream > Videos
3. 업로드된 영상 확인
4. Playback URL로 영상 재생 가능

---

## 🚨 자주 발생하는 문제

### 문제 1: 페이지가 로딩되지 않음

**증상:**
- 브라우저에서 "연결할 수 없음" 메시지
- 또는 무한 로딩

**해결 방법:**
1. 개발 서버가 실행 중인지 확인:
   ```bash
   # 터미널에서 "Ready in 2.5s" 메시지 확인
   ```
2. 포트 3000이 사용 중인지 확인:
   ```bash
   lsof -i :3000
   # 또는
   netstat -an | grep 3000
   ```
3. 서버 재시작:
   ```bash
   # Ctrl+C로 서버 종료
   npm run dev
   ```

### 문제 2: Supabase 연결 오류

**증상:**
- 상품/촬영룩 목록이 비어있음
- "데이터를 불러올 수 없습니다" 메시지

**해결 방법:**
1. 환경 변수 확인:
   ```bash
   cat .env.local | grep SUPABASE
   ```
2. Supabase 연동 테스트:
   ```bash
   npm run test:supabase
   ```
3. 실패 시 [SUPABASE_CONNECTION_TEST_GUIDE.md](./SUPABASE_CONNECTION_TEST_GUIDE.md) 참고

### 문제 3: 이미지가 표시되지 않음

**증상:**
- 상품/촬영룩 이미지가 깨진 이미지 아이콘으로 표시
- 또는 빈 공간

**해결 방법:**
1. `next.config.ts` 파일 확인 (이미지 도메인 설정)
2. Cloudflare R2 Public URL 확인:
   ```bash
   cat .env.local | grep CLOUDFLARE_R2_PUBLIC_URL
   ```
3. 브라우저 개발자 도구(F12) > Console 탭에서 에러 메시지 확인

### 문제 4: 관리자 로그인 실패

**증상:**
- "이메일 또는 비밀번호가 잘못되었습니다" 메시지
- 또는 로그인 버튼이 반응 없음

**해결 방법:**
1. Supabase 대시보드에서 관리자 계정 확인:
   - https://supabase.com/dashboard
   - Authentication > Users
   - admin@arco.com 계정 확인
2. 비밀번호 재설정:
   - "Reset Password" 클릭
   - 새 비밀번호 설정
3. 계정이 없으면 생성:
   - "Add user" 클릭
   - 이메일: admin@arco.com
   - Auto Confirm User 체크
   - 비밀번호 설정

### 문제 5: 결제 위젯이 표시되지 않음

**증상:**
- 결제 페이지에 Toss Payments 위젯이 안 보임
- 빈 공간만 표시

**해결 방법:**
1. Toss Payments 환경 변수 확인:
   ```bash
   cat .env.local | grep TOSS
   ```
2. 테스트 키 확인:
   - `NEXT_PUBLIC_TOSS_CLIENT_KEY`가 `test_ck_`로 시작하는지 확인
3. 브라우저 개발자 도구(F12) > Console 탭에서 에러 확인

### 문제 6: 이미지/영상 업로드 실패

**증상:**
- 업로드 진행률이 멈춤
- "업로드 실패" 에러 메시지

**해결 방법:**
1. Cloudflare 환경 변수 확인:
   ```bash
   cat .env.local | grep CLOUDFLARE
   ```
2. Cloudflare 대시보드에서 API 토큰 확인:
   - R2: https://dash.cloudflare.com/r2
   - Stream: https://dash.cloudflare.com/stream
3. 파일 크기 확인:
   - 이미지: 최대 10MB
   - 영상: 최대 200MB
4. 파일 형식 확인:
   - 이미지: JPG, PNG, WebP
   - 영상: MP4, MOV, AVI, MKV, WebM

---

## ✅ 테스트 체크리스트

전체 테스트를 완료하셨다면 아래 체크리스트를 확인하세요!

### Phase 1: 기본 페이지
- [ ] 홈페이지 정상 로딩
- [ ] 상품 목록 페이지 정상 로딩
- [ ] 상품 상세 페이지 정상 로딩
- [ ] 촬영룩 목록 페이지 정상 로딩
- [ ] 촬영룩 상세 페이지 정상 로딩

### Phase 2: Supabase 연동
- [ ] 상품 데이터 조회 성공
- [ ] 촬영룩 데이터 조회 성공
- [ ] 예약 생성 성공
- [ ] Supabase 대시보드에서 예약 데이터 확인

### Phase 3: 관리자 인증
- [ ] 관리자 로그인 성공
- [ ] 대시보드 접근 가능
- [ ] 예약 목록 조회 가능
- [ ] 예약 상태 변경 가능

### Phase 4: 결제 시스템
- [ ] 장바구니 추가 성공
- [ ] 장바구니 수량 변경 가능
- [ ] 주문 페이지 정상 로딩
- [ ] Toss Payments 위젯 표시
- [ ] 테스트 결제 성공
- [ ] 결제 성공 페이지 표시
- [ ] 주문 데이터 Supabase에 저장
- [ ] 관리자 주문 관리 페이지에서 주문 확인

### Phase 5: 이미지 업로드
- [ ] 이미지 파일 선택 가능
- [ ] 드래그 앤 드롭 작동
- [ ] 이미지 미리보기 표시
- [ ] 여러 이미지 업로드 가능
- [ ] 이미지 순서 변경 가능
- [ ] 이미지 삭제 가능
- [ ] 업로드된 이미지 Cloudflare R2에 저장
- [ ] 상품/촬영룩 페이지에 이미지 표시

### Phase 6: 영상 업로드 (선택사항)
- [ ] 영상 파일 선택 가능
- [ ] 영상 업로드 진행률 표시
- [ ] 썸네일 자동 생성
- [ ] 영상 상태 표시 (처리 중, 준비 완료)
- [ ] 업로드된 영상 Cloudflare Stream에 저장
- [ ] 상품/촬영룩 페이지에 영상 플레이어 표시
- [ ] 영상 재생 가능

---

## 📊 테스트 결과 보고

테스트가 완료되면 아래 정보를 공유해주세요:

### 성공한 Phase
- [ ] Phase 1: 기본 페이지
- [ ] Phase 2: Supabase 연동
- [ ] Phase 3: 관리자 인증
- [ ] Phase 4: 결제 시스템
- [ ] Phase 5: 이미지 업로드
- [ ] Phase 6: 영상 업로드 (선택사항)

### 발견된 이슈
1. **이슈 제목:**
   - 발생 페이지:
   - 재현 방법:
   - 스크린샷:
   - 에러 메시지:

2. **이슈 제목:**
   - 발생 페이지:
   - 재현 방법:
   - 스크린샷:
   - 에러 메시지:

### 전체 소요 시간
- 프로젝트 설정: ___ 분
- 테스트 실행: ___ 분
- 총 소요 시간: ___ 분

---

## 🎯 다음 단계

테스트가 성공적으로 완료되었다면:

1. **Vercel 배포 진행**
   - [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) 참고
   - 프로덕션 환경에서 실제 테스트

2. **Phase 7: 갤러리 납품 시스템 구현**
   - 갤러리 이미지 업로드
   - 고객 전용 갤러리 페이지
   - 이미지 다운로드 기능

3. **최적화 및 개선**
   - 성능 최적화
   - SEO 개선
   - 모바일 반응형 개선

---

## 📞 문의 및 지원

**문제가 발생하면:**
1. 위 "자주 발생하는 문제" 섹션 확인
2. 브라우저 개발자 도구(F12) > Console 탭에서 에러 확인
3. 터미널에서 서버 로그 확인
4. GitHub Issues에 이슈 등록
5. 스크린샷, 에러 메시지 함께 공유

**프로젝트 정보:**
- **저장소:** https://github.com/chalcadak/arco-web
- **브랜치:** genspark_ai_developer
- **문서:** [README.md](./README.md), [SUPABASE_CONNECTION_TEST_GUIDE.md](./SUPABASE_CONNECTION_TEST_GUIDE.md)

---

## 🎉 마무리

축하합니다! 🎊

모든 테스트를 완료하셨다면, ARCO 프로젝트의 **Phase 1-6**가 정상적으로 작동하는 것입니다!

**구현 완료된 기능:**
- ✅ 기본 페이지 (홈, 상품, 촬영룩)
- ✅ Supabase 연동 (데이터베이스, 예약 시스템)
- ✅ 관리자 인증 (로그인, 대시보드, 관리 페이지)
- ✅ 결제 시스템 (Toss Payments 연동)
- ✅ 이미지 업로드 (Cloudflare R2)
- ✅ 영상 업로드 (Cloudflare Stream, 선택사항)

**다음 목표:**
- 🚀 Vercel 배포
- 🎨 갤러리 납품 시스템
- ⚡ 성능 최적화

대표님, 테스트 결과를 공유해주시면 다음 단계를 진행하겠습니다! 😊
