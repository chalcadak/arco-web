# 🧪 ARCO 로컬 테스트 가이드

**작성일**: 2026-01-15  
**개발 서버**: https://3001-irrdinlx0rso602ibp2mj-dfc00ec5.sandbox.novita.ai

---

## ✅ 준비 완료

- [x] 환경 변수 설정 (.env.local)
- [x] 의존성 설치 (npm install)
- [x] 개발 서버 시작 (npm run dev)
- [x] 테스트 페이지 생성 (/test)

---

## 🌐 테스트 URL

### 🧪 **메인 테스트 페이지**
```
https://3001-irrdinlx0rso602ibp2mj-dfc00ec5.sandbox.novita.ai/test
```

**기능:**
- ✅ 환경 변수 확인
- ✅ 파일 업로드 테스트 (이미지/동영상 자동 감지)
- ✅ 빠른 링크 (관리자, 상품, 메인)

---

## 📋 테스트 체크리스트

### 1️⃣ **환경 변수 확인** (/test)

**확인 항목:**
- [ ] 환경: development
- [ ] Supabase URL 표시
- [ ] R2 Bucket Name 표시 (arco-r2)
- [ ] Stream Account ID 표시
- [ ] 모든 키 ✅ 표시

**예상 결과:**
```json
{
  "success": true,
  "environment": "development",
  "config": {
    "supabase": { "url": "https://...", "hasAnonKey": true },
    "r2": { "bucketName": "arco-r2", "hasAccessKey": true },
    "stream": { "accountId": "...", "hasApiToken": true }
  }
}
```

---

### 2️⃣ **파일 업로드 테스트** (/test)

#### 이미지 업로드 (R2)
```
1. /test 페이지 접속
2. "파일 선택" 클릭
3. 이미지 파일 선택 (.jpg, .png, .gif, .webp)
4. 업로드 진행률 확인 (0% → 100%)
5. 성공 메시지 확인
```

**예상 결과:**
```json
{
  "success": true,
  "type": "image",
  "data": {
    "url": "https://pub-xxx.r2.dev/test/xxx.jpg",
    "key": "test/xxx.jpg",
    "bucket": "arco-r2"
  }
}
```

#### 동영상 업로드 (Stream)
```
1. /test 페이지 접속
2. "파일 선택" 클릭
3. 동영상 파일 선택 (.mp4, .mov, .webm)
4. 업로드 진행률 확인 (0% → 100%)
5. 성공 메시지 확인
```

**예상 결과:**
```json
{
  "success": true,
  "type": "video",
  "data": {
    "uid": "abc123...",
    "playbackUrl": "https://customer-xxx.cloudflarestream.com/.../manifest/video.m3u8",
    "thumbnailUrl": "https://customer-xxx.cloudflarestream.com/.../thumbnails/thumbnail.jpg"
  }
}
```

**⚠️ 주의:**
- Stream API 토큰이 유효해야 동영상 업로드 가능
- `.env.local`의 `CLOUDFLARE_STREAM_API_TOKEN`을 실제 값으로 변경 필요

---

### 3️⃣ **관리자 로그인** (/admin/login)

**URL:**
```
https://3001-irrdinlx0rso602ibp2mj-dfc00ec5.sandbox.novita.ai/admin/login
```

**로그인 정보:**
```
Email: admin@arco.com
Password: Admin123!@#
```

**확인 항목:**
- [ ] 로그인 페이지 표시
- [ ] 이메일/비밀번호 입력
- [ ] 로그인 버튼 클릭
- [ ] /admin/dashboard로 리다이렉트

**예상 결과:**
- ✅ 로그인 성공
- ✅ 관리자 대시보드 이동

---

### 4️⃣ **관리자 대시보드** (/admin/dashboard)

**URL:**
```
https://3001-irrdinlx0rso602ibp2mj-dfc00ec5.sandbox.novita.ai/admin/dashboard
```

**확인 항목:**
- [ ] 통계 카드 표시 (오늘 주문, 매출, 활성 고객, 재구매율)
- [ ] 증감률 표시 (전일/전주/전월 대비)
- [ ] 차트 표시 (매출, 요일별, 시간대별)
- [ ] 베스트셀러 테이블
- [ ] **🆕 AI 추천 액션 섹션**

**AI 추천 확인:**
- [ ] "💡 AI 추천: 즉시 실행 가능한 액션" 제목 표시
- [ ] 추천 카드 표시 (재고 부족, 프로모션, 고객 리텐션 등)
- [ ] 또는 "현재 추천할 액션이 없습니다" 표시 (데이터 부족 시)

**예상 결과:**
- 데이터 있음: AI 추천 카드 표시
- 데이터 없음: "추천이 없습니다" 표시 (정상)

---

### 5️⃣ **메인 페이지** (/)

**URL:**
```
https://3001-irrdinlx0rso602ibp2mj-dfc00ec5.sandbox.novita.ai
```

**확인 항목:**
- [ ] 메인 페이지 로드
- [ ] 개인화 피드 통합 여부 확인
- [ ] 상품 목록 표시

**예상 결과:**
- 메인 페이지 정상 표시
- (개인화 피드는 아직 통합 전일 수 있음)

---

### 6️⃣ **상품 목록** (/products)

**URL:**
```
https://3001-irrdinlx0rso602ibp2mj-dfc00ec5.sandbox.novita.ai/products
```

**확인 항목:**
- [ ] 상품 목록 표시
- [ ] 상품 카드 표시
- [ ] 퀵 바이 버튼 통합 여부 확인

**예상 결과:**
- 상품 목록 정상 표시
- (퀵 바이는 아직 통합 전일 수 있음)

---

## 🐛 문제 해결

### 문제 1: 환경 변수 오류
```
❌ Missing required environment variable: XXX
```

**해결:**
1. `.env.local` 파일 확인
2. 누락된 변수 추가
3. 개발 서버 재시작

### 문제 2: Stream 업로드 실패
```
❌ Stream API error: 401
```

**해결:**
1. `.env.local`에서 `CLOUDFLARE_STREAM_API_TOKEN` 확인
2. Cloudflare Dashboard → Stream → API Tokens
3. 새 토큰 발급 (권한: Stream Read, Stream Edit)
4. `.env.local` 업데이트
5. 개발 서버 재시작

### 문제 3: R2 업로드 실패
```
❌ R2 upload failed
```

**해결:**
1. `.env.local`에서 R2 설정 확인
2. Cloudflare Dashboard → R2 → Buckets
3. `arco-r2` 버킷 존재 확인
4. Access Key 재발급 (필요 시)
5. `.env.local` 업데이트
6. 개발 서버 재시작

### 문제 4: 관리자 로그인 실패
```
❌ Invalid credentials
```

**해결:**
1. Supabase Dashboard → Authentication → Users
2. `admin@arco.com` 사용자 확인
3. 없으면 생성 (Password: Admin123!@#)
4. SQL Editor에서 권한 부여:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@arco.com';
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@arco.com';
   ```

---

## 📊 테스트 시나리오

### 시나리오 1: 완전한 흐름 테스트 (20분)
```
1. /test 접속 → 환경 변수 확인 ✅
2. 이미지 업로드 테스트 ✅
3. 동영상 업로드 테스트 ✅
4. /admin/login 로그인 ✅
5. /admin/dashboard AI 추천 확인 ✅
6. /products 상품 목록 확인 ✅
7. / 메인 페이지 확인 ✅
```

### 시나리오 2: 빠른 확인 (5분)
```
1. /test 접속 → 환경 확인 ✅
2. /admin/dashboard AI 추천 확인 ✅
```

### 시나리오 3: 업로드 집중 테스트 (10분)
```
1. /test 접속
2. 이미지 3개 업로드 (JPG, PNG, WebP)
3. 동영상 1개 업로드 (MP4)
4. 결과 URL 확인
5. R2/Stream 대시보드에서 확인
```

---

## 🎯 다음 단계

### 로컬 테스트 완료 후:
- [ ] 버그 수정 (발견 시)
- [ ] 개인화 피드 통합 (메인 페이지)
- [ ] 퀵 바이 통합 (상품 목록)
- [ ] 테스트 데이터 추가 (상품 10개)
- [ ] Vercel 배포

---

## 💬 질문/피드백

테스트 중 문제가 발생하면:
1. 에러 메시지 스크린샷
2. 브라우저 콘솔 로그
3. /test 페이지 환경 확인 결과

위 정보를 공유해주시면 즉시 도와드리겠습니다! 🚀

---

**대표님, 지금 바로 테스트 시작하세요!**

**메인 테스트 페이지**: https://3001-irrdinlx0rso602ibp2mj-dfc00ec5.sandbox.novita.ai/test
