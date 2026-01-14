# 🚀 ARCO Vercel 배포 가이드

## ✅ 사전 준비 완료 체크

- [x] Supabase 마이그레이션 완료 (한 번만!)
- [x] Admin 계정 생성 완료 (admin@arco.com)
- [x] GitHub에 코드 푸시 완료
- [ ] Vercel 배포 (이제 할 차례!)

---

## 🎯 중요: 마이그레이션은 한 번만!

**Q: Vercel 배포 후 다시 마이그레이션 해야 하나요?**  
**A: 아니요! ❌**

Supabase는 클라우드 데이터베이스이므로:
- ✅ 로컬과 Vercel이 **같은 DB 사용**
- ✅ 마이그레이션 **한 번만** 하면 끝
- ✅ Admin 계정도 **공유**됨

```
로컬 (localhost:3000) ──┐
                        ├──> 같은 Supabase DB
Vercel (arco.vercel.app)─┘
```

---

## 🚀 Vercel 배포 방법

### **방법 1: Vercel Dashboard (추천 ⭐)**

#### Step 1: Vercel 프로젝트 생성

1. https://vercel.com/dashboard 접속
2. **Add New... → Project** 클릭
3. **Import Git Repository** 선택
4. `chalcadak/arco-web` 선택
5. **Import** 클릭

#### Step 2: 환경 변수 설정

**Environment Variables** 섹션에서 아래 변수들을 추가:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://uuiresymwsjpamntmkyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjYwMzgsImV4cCI6MjA4MzY0MjAzOH0.VrxrjbBvMg8PvpvswvWxlAQj75YVBlvFdkd1ULz19TU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA2NjAzOCwiZXhwIjoyMDgzNjQyMDM4fQ.VDprvHpAkjAyjZk8uWcD6ofdp0e8-_edYdSec4b_zK0

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=5d66250baed987ff272e39a8b4625f72
CLOUDFLARE_R2_ACCESS_KEY_ID=59f3917ba84365517fb9bd9030ecacec
CLOUDFLARE_R2_SECRET_ACCESS_KEY=45d8a894a2c09a15fae85df71b3c5513887423850153aa86f10028b991590894
CLOUDFLARE_R2_BUCKET_NAME=arco-r2
CLOUDFLARE_R2_PUBLIC_URL=https://pub-d210caadc2fa4e3b8b491ce992e06759.r2.dev

# Cloudflare Stream
CLOUDFLARE_STREAM_API_TOKEN=your_stream_token

# 토스페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_SECRET_KEY=test_sk_xxxxx

# App (나중에 도메인으로 변경)
NEXT_PUBLIC_APP_URL=https://arco-web.vercel.app
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com
```

**⚠️ 중요:**
- `NEXT_PUBLIC_APP_URL`: 배포 후 Vercel이 제공하는 URL로 업데이트
- `test_ck_xxxxx`, `test_sk_xxxxx`: 실제 토스페이먼츠 키로 교체
- `your_stream_token`: 실제 Cloudflare Stream 토큰으로 교체

#### Step 3: 배포

1. **Deploy** 버튼 클릭
2. 빌드 완료 대기 (약 2-3분)
3. 배포 완료! 🎉

#### Step 4: 도메인 확인

배포 후 Vercel이 제공하는 URL:
```
https://arco-web.vercel.app
또는
https://arco-web-chalcadak.vercel.app
```

#### Step 5: 환경 변수 업데이트

배포 완료 후:

1. Vercel Dashboard → 프로젝트 → **Settings** → **Environment Variables**
2. `NEXT_PUBLIC_APP_URL` 수정:
   ```
   https://arco-web.vercel.app (실제 배포된 URL로)
   ```
3. **Redeploy** (설정 변경 후 재배포 필요)

---

### **방법 2: Vercel CLI**

```bash
# Vercel 로그인
npx vercel login

# 배포 (처음)
npx vercel

# 프로덕션 배포
npx vercel --prod
```

---

## ✅ 배포 후 확인

### 1) 웹사이트 접속
```
https://your-domain.vercel.app
```

### 2) Admin 로그인 테스트
```
https://your-domain.vercel.app/admin/login

Email: admin@arco.com
Password: Admin123!@#
```

**✅ 성공 조건:**
- 로그인 성공
- /admin/dashboard로 리다이렉트
- 관리자 페이지 정상 표시

### 3) 데이터베이스 연결 확인
- 상품 목록 조회
- 카테고리 목록 조회
- 주문 생성 테스트

---

## 🔧 배포 후 추가 설정

### 1) 커스텀 도메인 설정 (선택)

Vercel Dashboard → 프로젝트 → **Settings** → **Domains**
1. 원하는 도메인 입력 (예: arco.kr)
2. DNS 설정 안내에 따라 도메인 연결
3. `NEXT_PUBLIC_APP_URL` 환경 변수 업데이트

### 2) 토스페이먼츠 실제 키로 교체

테스트 모드에서 프로덕션 모드로:

```bash
# 기존 (테스트)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_SECRET_KEY=test_sk_xxxxx

# 프로덕션
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_xxxxx
TOSS_SECRET_KEY=live_sk_xxxxx
```

### 3) Supabase 설정 확인

Supabase Dashboard → **Authentication** → **URL Configuration**

**Site URL** 추가:
```
https://your-domain.vercel.app
```

**Redirect URLs** 추가:
```
https://your-domain.vercel.app/auth/callback
https://your-domain.vercel.app/admin/login
```

---

## 🚨 자주 묻는 질문 (FAQ)

### Q1: 배포 후 마이그레이션 다시 해야 하나요?
**A: 아니요! ❌** 이미 한 번 했으면 끝입니다.

### Q2: 로컬과 Vercel의 데이터베이스가 다른가요?
**A: 아니요!** 같은 Supabase 데이터베이스를 사용합니다.

### Q3: Admin 계정도 다시 만들어야 하나요?
**A: 아니요!** 같은 계정(`admin@arco.com`)을 사용합니다.

### Q4: 로컬에서 추가한 상품이 Vercel에도 보이나요?
**A: 네! ✅** 같은 데이터베이스이므로 모든 데이터가 공유됩니다.

### Q5: 빌드 에러가 발생하면?
**A:** 
1. 로그 확인 (Vercel Dashboard → Deployments → 최신 배포 → View Build Logs)
2. 환경 변수 확인
3. 로컬에서 `npm run build` 테스트

### Q6: 배포 후 페이지가 안 열리면?
**A:**
1. Vercel 배포 상태 확인 (Ready 상태인지)
2. 브라우저 캐시 삭제 후 재시도
3. Vercel 로그 확인

---

## 📊 배포 프로세스 요약

```
1. GitHub Push (완료 ✅)
   ↓
2. Vercel 프로젝트 생성
   ↓
3. 환경 변수 설정
   ↓
4. Deploy 버튼 클릭
   ↓
5. 빌드 & 배포 (2-3분)
   ↓
6. 배포 완료! 🎉
   ↓
7. Admin 로그인 테스트
   ↓
8. 완료! 🚀
```

**소요 시간:** 약 10분

---

## 🎯 체크리스트

배포 전:
- [x] Supabase 마이그레이션 완료
- [x] Admin 계정 생성 완료
- [x] GitHub에 코드 푸시 완료
- [ ] 환경 변수 준비 완료

배포:
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 배포 실행
- [ ] 배포 성공 확인

배포 후:
- [ ] 웹사이트 접속 테스트
- [ ] Admin 로그인 테스트
- [ ] 데이터베이스 연결 확인
- [ ] 상품/주문 기능 테스트

---

## 📞 도움이 필요하시면

- Vercel 빌드 로그 스크린샷
- 에러 메시지
- 어느 단계에서 막혔는지

알려주세요! 🙏

---

**🎉 대표님, 이제 Vercel에 배포만 하시면 됩니다!**

마이그레이션은 이미 완료되었으므로, 환경 변수만 설정하고 Deploy 버튼만 누르면 끝입니다! 🚀
