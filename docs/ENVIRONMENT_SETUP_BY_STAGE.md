# 🔧 환경별 설정 가이드

## 📋 환경 구분

ARCO 프로젝트는 3가지 환경을 지원합니다:

| 환경 | 용도 | Supabase | R2 Bucket | 도메인 |
|------|------|----------|-----------|--------|
| **Development** | 로컬 개발 | arco-db-test | arco-store-test | localhost:3000 |
| **Preview** | PR 테스트 | arco-db-test | arco-store-test | preview-xxx.vercel.app |
| **Production** | 운영 서비스 | arco-db-prod | arco-store-prod | arco.kr |

---

## 🔵 Development (로컬 개발)

### 1. .env.local 파일 생성

```bash
cp .env.example .env.local
```

### 2. 현재 개발 환경 설정 (기존 리소스 사용)

`.env.local` 파일에 아래 내용 **그대로** 복사:

```bash
# Supabase (기존 테스트 DB)
NEXT_PUBLIC_SUPABASE_URL=https://uuiresymwsjpamntmkyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNjYwMzgsImV4cCI6MjA4MzY0MjAzOH0.VrxrjbBvMg8PvpvswvWxlAQj75YVBlvFdkd1ULz19TU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1aXJlc3ltd3NqcGFtbnRta3liIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA2NjAzOCwiZXhwIjoyMDgzNjQyMDM4fQ.VDprvHpAkjAyjZk8uWcD6ofdp0e8-_edYdSec4b_zK0

# Cloudflare R2 (기존 버킷 - 테스트용으로 사용)
CLOUDFLARE_ACCOUNT_ID=5d66250baed987ff272e39a8b4625f72
CLOUDFLARE_R2_ACCESS_KEY_ID=59f3917ba84365517fb9bd9030ecacec
CLOUDFLARE_R2_SECRET_ACCESS_KEY=45d8a894a2c09a15fae85df71b3c5513887423850153aa86f10028b991590894
CLOUDFLARE_R2_BUCKET_NAME=arco-r2
CLOUDFLARE_R2_PUBLIC_URL=https://pub-d210caadc2fa4e3b8b491ce992e06759.r2.dev

# Cloudflare Stream (선택 - 동영상 업로드 시 필요)
CLOUDFLARE_STREAM_API_TOKEN=your_stream_token

# Toss Payments (테스트 키)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_SECRET_KEY=test_sk_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com
```

### 3. 나중에 분리할 개발 환경 (선택)

나중에 진짜 테스트 전용 리소스를 만들 때:

```bash
# 새 Supabase 프로젝트 생성: arco-db-test
NEXT_PUBLIC_SUPABASE_URL=https://arco-db-test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=new-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=new-test-service-role-key

# 새 R2 버킷 생성: arco-store-test
CLOUDFLARE_R2_BUCKET_NAME=arco-store-test
CLOUDFLARE_R2_PUBLIC_URL=https://pub-test-xxxxx.r2.dev
```

---

## 🟢 Production (운영 환경)

### Vercel 환경 변수 설정

1. **Vercel Dashboard** 접속: https://vercel.com/dashboard
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. 아래 변수들을 **Production만 선택**해서 추가:

```bash
# Supabase (운영 DB - 나중에 생성)
NEXT_PUBLIC_SUPABASE_URL=https://arco-db-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=prod-service-role-key

# Cloudflare R2 (운영 버킷 - 나중에 생성)
CLOUDFLARE_ACCOUNT_ID=5d66250baed987ff272e39a8b4625f72
CLOUDFLARE_R2_ACCESS_KEY_ID=prod-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=prod-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=arco-store-prod
CLOUDFLARE_R2_PUBLIC_URL=https://pub-prod-xxxxx.r2.dev

# Cloudflare Stream (운영 토큰)
CLOUDFLARE_STREAM_API_TOKEN=prod-stream-token

# Toss Payments (실제 운영 키)
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_xxxxx
TOSS_SECRET_KEY=live_sk_xxxxx

# App
NEXT_PUBLIC_APP_URL=https://arco.kr
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com
```

### 주의사항

⚠️ **지금 당장 Production 설정 필요 없음!**
- 서비스 오픈 전까지는 기존 리소스 사용
- 오픈 준비 완료 후 운영 리소스 생성

---

## 🟡 Preview (Vercel 프리뷰)

### Vercel 환경 변수 설정

1. Vercel Dashboard → **Environment Variables**
2. 아래 변수들을 **Preview만 선택**해서 추가:

```bash
# Development와 동일한 테스트 리소스 사용
NEXT_PUBLIC_SUPABASE_URL=https://uuiresymwsjpamntmkyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=(개발 환경과 동일)
SUPABASE_SERVICE_ROLE_KEY=(개발 환경과 동일)

CLOUDFLARE_R2_BUCKET_NAME=arco-r2
CLOUDFLARE_R2_PUBLIC_URL=https://pub-d210caadc2fa4e3b8b491ce992e06759.r2.dev

# 나머지도 개발 환경과 동일
```

---

## 🎯 현재 권장 설정 (단계별)

### 📍 현재 단계 (개발 중)

```
Development (로컬)  → 기존 DB + 기존 R2
Preview (Vercel)    → 기존 DB + 기존 R2  
Production (Vercel) → 설정 안 함 (아직 배포 안 함)
```

**이유:**
- 모든 환경에서 같은 데이터 사용 → 테스트 편함
- 리소스 관리 간단
- 비용 절감

### 📍 서비스 오픈 준비 시

```
Development (로컬)  → 테스트 DB + 테스트 R2
Preview (Vercel)    → 테스트 DB + 테스트 R2
Production (Vercel) → 운영 DB + 운영 R2 (새로 생성)
```

**이유:**
- 운영 데이터 보호
- 테스트 안전성
- 명확한 환경 분리

---

## 📋 체크리스트

### 지금 바로 (로컬 개발)

- [x] `.env.local` 생성
- [x] 기존 Supabase URL 입력
- [x] 기존 R2 설정 입력
- [ ] `npm run dev` 실행
- [ ] http://localhost:3000/test 접속
- [ ] 환경 변수 확인 ✅

### 나중에 (서비스 오픈 전)

- [ ] Supabase **arco-db-prod** 생성
- [ ] R2 **arco-store-prod** 버킷 생성
- [ ] Vercel Production 환경 변수 설정
- [ ] 운영 데이터 마이그레이션
- [ ] 최종 테스트

---

## 💡 추천 플로우

```
1주차 (지금):
  로컬 개발 → 기존 리소스
  
2주차:
  기능 완성 → Vercel Preview 배포 → 기존 리소스
  
3주차:
  최종 테스트 → 운영 리소스 생성 → Production 배포
  
4주차:
  서비스 오픈! 🎉
```

---

## 🐛 문제 해결

### Q: 개발 환경에서 운영 데이터 건드리면?
A: 지금은 운영 환경이 없으므로 걱정 없음. 나중에 분리.

### Q: Preview와 Development가 같은 DB 써도 돼?
A: 네! 테스트 단계에서는 문제없음. 오픈 전에 분리.

### Q: 언제 운영 리소스 만들어?
A: 서비스 오픈 1-2주 전. 충분한 테스트 후.

---

**대표님, 지금은 `.env.local`만 설정하면 됩니다!** 🚀

나머지는 나중에 천천히!
