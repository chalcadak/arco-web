# 🔧 로컬 환경 변수 설정 가이드

## 1. .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 만드세요:

```bash
# Mac/Linux
cp .env.example .env.local

# Windows
copy .env.example .env.local
```

## 2. 환경 변수 입력

`.env.local` 파일을 열고 아래 내용을 **실제 값**으로 채우세요:

```bash
# =============================================================================
# 환경
# =============================================================================
NODE_ENV=development

# =============================================================================
# Supabase (현재 사용 중인 DB)
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://uuiresymwsjpamntmkyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjYwMzgsImV4cCI6MjA4MzY0MjAzOH0.VrxrjbBvMg8PvpvswvWxlAQj75YVBlvFdkd1ULz19TU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA2NjAzOCwiZXhwIjoyMDgzNjQyMDM4fQ.VDprvHpAkjAyjZk8uWcD6ofdp0e8-_edYdSec4b_zK0

# =============================================================================
# Cloudflare R2 (현재 사용 중인 버킷)
# =============================================================================
CLOUDFLARE_ACCOUNT_ID=5d66250baed987ff272e39a8b4625f72
CLOUDFLARE_R2_ACCESS_KEY_ID=59f3917ba84365517fb9bd9030ecacec
CLOUDFLARE_R2_SECRET_ACCESS_KEY=45d8a894a2c09a15fae85df71b3c5513887423850153aa86f10028b991590894
CLOUDFLARE_R2_BUCKET_NAME=arco-r2
CLOUDFLARE_R2_PUBLIC_URL=https://pub-d210caadc2fa4e3b8b491ce992e06759.r2.dev

# =============================================================================
# Cloudflare Stream (동영상)
# =============================================================================
# ⚠️ 실제 토큰으로 변경 필요!
# Cloudflare Dashboard → Stream → API Tokens에서 발급
CLOUDFLARE_STREAM_API_TOKEN=your_stream_token_here

# =============================================================================
# Toss Payments (테스트 키)
# =============================================================================
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_SECRET_KEY=test_sk_xxxxx

# =============================================================================
# App
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com

# =============================================================================
# Email (선택사항 - 나중에 설정 가능)
# =============================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## 3. 중요 변수 확인

### 필수 (지금 바로 필요)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - 이미 설정됨
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 이미 설정됨
- ✅ `CLOUDFLARE_R2_BUCKET_NAME` - 이미 설정됨 (arco-r2)
- ✅ `CLOUDFLARE_R2_ACCESS_KEY_ID` - 이미 설정됨
- ✅ `CLOUDFLARE_R2_SECRET_ACCESS_KEY` - 이미 설정됨

### 선택 (나중에 테스트)
- ⚠️ `CLOUDFLARE_STREAM_API_TOKEN` - 동영상 업로드 시 필요
- ⚠️ `NEXT_PUBLIC_TOSS_CLIENT_KEY` - 결제 테스트 시 필요
- ⚠️ `TOSS_SECRET_KEY` - 결제 테스트 시 필요

## 4. Stream API 토큰 발급 (선택)

동영상 업로드를 테스트하려면:

1. https://dash.cloudflare.com 접속
2. 계정 선택
3. **Stream** 메뉴 클릭
4. **API Tokens** 탭
5. **Create Token** 클릭
6. 권한 선택:
   - Stream: Read
   - Stream: Edit
7. **Continue** → **Create Token**
8. 토큰 복사 → `.env.local`의 `CLOUDFLARE_STREAM_API_TOKEN`에 붙여넣기

## 5. 파일 저장

`.env.local` 파일을 저장하세요!

---

## ✅ 완료!

이제 `npm run dev` 명령으로 개발 서버를 시작할 수 있습니다.
