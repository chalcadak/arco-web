# 🚀 로컬 실행 가이드 (대표님 컴퓨터)

## 📋 사전 준비

### 1. Node.js 설치 확인
```bash
node -v
# v18.0.0 이상이어야 함
```

설치 안 되어 있으면: https://nodejs.org 에서 LTS 버전 다운로드

### 2. Git 설치 확인
```bash
git --version
```

---

## 🔧 설치 및 실행

### Step 1: 프로젝트 다운로드

**처음 다운로드:**
```bash
git clone https://github.com/chalcadak/arco-web.git
cd arco-web
```

**이미 있으면 업데이트:**
```bash
cd arco-web
git pull origin main
```

---

### Step 2: 환경 변수 설정

**.env.local 파일 생성:**
```bash
# Mac/Linux
cp .env.example .env.local

# Windows (Command Prompt)
copy .env.example .env.local

# Windows (PowerShell)
Copy-Item .env.example .env.local
```

**파일 편집:**

VSCode로 열기:
```bash
code .env.local
```

또는 메모장으로 열기 (Windows):
```bash
notepad .env.local
```

**내용 붙여넣기:**
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

# Cloudflare Stream (동영상 업로드 시 필요)
CLOUDFLARE_STREAM_API_TOKEN=your_stream_token

# Toss Payments (결제 테스트 시 필요)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_SECRET_KEY=test_sk_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com
```

**저장** (Ctrl+S 또는 Cmd+S)

---

### Step 3: 의존성 설치

```bash
npm install
```

**예상 시간**: 1-3분  
**예상 결과**: 
```
added 857 packages in 2m
```

---

### Step 4: 개발 서버 시작

```bash
npm run dev
```

**예상 결과:**
```
▲ Next.js 16.1.1
- Local:   http://localhost:3000
✓ Ready in 5s
```

---

## 🌐 접속 URL

### 브라우저에서 열기:

#### 🧪 **테스트 페이지** (여기부터!)
```
http://localhost:3000/test
```
- 환경 변수 확인
- 파일 업로드 테스트

#### 🏠 **메인 페이지**
```
http://localhost:3000
```

#### 🔐 **관리자 로그인**
```
http://localhost:3000/admin/login

Email: admin@arco.com
Password: Admin123!@#
```

#### 📊 **관리자 대시보드**
```
http://localhost:3000/admin/dashboard
```
- 통계/차트
- AI 추천 섹션 (맨 아래)

#### 🛍️ **상품 목록**
```
http://localhost:3000/products
```

---

## ✅ 테스트 순서

### 1️⃣ 환경 확인 (1분)
```
1. http://localhost:3000/test 접속
2. 환경 변수 모두 ✅ 확인
```

### 2️⃣ 이미지 업로드 (2분)
```
1. /test 페이지에서 "파일 선택"
2. 이미지 선택 (.jpg, .png)
3. 업로드 진행률 확인
4. 성공 메시지 확인
```

### 3️⃣ 관리자 확인 (2분)
```
1. http://localhost:3000/admin/login 접속
2. admin@arco.com / Admin123!@# 로그인
3. 대시보드 이동 확인
4. AI 추천 섹션 확인 (맨 아래)
```

---

## 🐛 문제 해결

### 문제 1: 포트 3000이 이미 사용 중
```
⚠️ Port 3000 is in use
```

**해결:**
```bash
# 다른 프로세스 종료 후 재시작
# 또는 다른 포트 사용
PORT=3001 npm run dev
```

### 문제 2: npm install 실패
```
❌ npm ERR!
```

**해결:**
```bash
# npm 캐시 삭제
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 문제 3: 환경 변수 오류
```
❌ Missing required environment variable
```

**해결:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 파일 내용이 정확한지 확인
3. 서버 재시작 (Ctrl+C 후 `npm run dev`)

### 문제 4: 관리자 로그인 실패
```
❌ Invalid credentials
```

**해결:**
1. Supabase Dashboard 접속
2. Authentication → Users
3. admin@arco.com 사용자 확인
4. SQL Editor에서 권한 부여:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@arco.com';
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@arco.com';
   ```

---

## 📊 개발 서버 명령어

### 서버 시작
```bash
npm run dev
```

### 서버 중지
```
Ctrl + C (또는 Cmd + C)
```

### 빌드 (배포 전 테스트)
```bash
npm run build
npm run start
```

### 타입 체크
```bash
npm run type-check
```

### Lint 실행
```bash
npm run lint
```

---

## 🎯 다음 단계

### 로컬 테스트 완료 후:
1. [ ] 환경 변수 확인 완료
2. [ ] 이미지 업로드 성공
3. [ ] 관리자 로그인 성공
4. [ ] 대시보드 정상 표시
5. [ ] 버그 발견 시 공유

### 추가 작업:
- [ ] 테스트 데이터 추가 (상품 10개)
- [ ] 개인화 피드 통합
- [ ] 퀵 바이 통합
- [ ] Vercel 배포

---

## 💬 도움이 필요하면

문제 발생 시 알려주세요:
1. 에러 메시지 스크린샷
2. 브라우저 콘솔 로그 (F12)
3. 터미널 출력

---

**대표님, 위 순서대로 따라하시면 5분 안에 로컬 테스트 가능합니다!** 🚀

**첫 단계**: 
```bash
git clone https://github.com/chalcadak/arco-web.git
cd arco-web
npm install
```
