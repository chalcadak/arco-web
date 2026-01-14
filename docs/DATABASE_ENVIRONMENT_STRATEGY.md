# 🏗️ ARCO 데이터베이스 환경 분리 전략

## 현재 상황 분석

### ❌ 현재 구조 (위험)
```
단일 Supabase 프로젝트
└── Production DB (https://uuiresymwsjpamntmkyb.supabase.co)
    ├── 개발 데이터
    ├── 테스트 데이터
    └── 실제 고객 데이터 (혼재 위험!)
```

**문제점**:
- 🚨 개발 중 실수로 프로덕션 데이터 삭제 가능
- 🚨 테스트 데이터와 실제 고객 데이터 혼재
- 🚨 마이그레이션 테스트 시 위험
- 🚨 복구 불가능한 사고 위험

---

## ✅ 표준 3-Tier 구조

### 올바른 구조
```
1. Development (개발 서버)
   └── 개발자가 자유롭게 테스트
   └── 마이그레이션 먼저 적용
   └── 데이터 삭제/수정 자유
   
2. Staging (테스트 서버)
   └── 프로덕션과 동일한 환경
   └── 실제 배포 전 최종 검증
   └── QA 테스트
   
3. Production (실운영 서버)
   └── 실제 고객 데이터
   └── 절대 직접 수정 금지
   └── 백업 필수
   
4. Backup (백업 서버) - 선택
   └── 프로덕션 자동 백업
   └── 재해 복구용
```

---

## 🎯 ARCO 권장 구조

### Phase 1: 최소 구성 (지금 바로 적용 가능)

```
┌─────────────────────────────────────────────┐
│ 1. Development (개발용)                      │
│    - URL: uuiresymwsjpamntmkyb.supabase.co  │
│    - 용도: 개발, 마이그레이션 테스트         │
│    - Vercel: arco-dev.vercel.app             │
│    - 데이터: 테스트 데이터만                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 2. Production (실운영)                       │
│    - URL: (새로 생성)                        │
│    - 용도: 실제 고객 서비스                  │
│    - Vercel: arco.vercel.app 또는 arco.kr    │
│    - 데이터: 실제 고객 데이터                │
│    - 백업: Supabase 자동 백업 활성화         │
└─────────────────────────────────────────────┘
```

**비용**: Supabase Free Tier 2개 (무료)

---

### Phase 2: 완전 구성 (규모 확대 후)

```
┌─────────────────────────────────────────────┐
│ 1. Development                               │
│    - 개발자용                                │
│    - 마이그레이션 테스트                     │
└─────────────────────────────────────────────┘
          ↓ 테스트 완료 후 승격
┌─────────────────────────────────────────────┐
│ 2. Staging                                   │
│    - QA 테스트                               │
│    - 프로덕션과 동일한 환경                  │
└─────────────────────────────────────────────┘
          ↓ 최종 승인 후 배포
┌─────────────────────────────────────────────┐
│ 3. Production                                │
│    - 실제 고객 서비스                        │
│    - 24시간 모니터링                         │
└─────────────────────────────────────────────┘
          ↓ 매시간 자동 백업
┌─────────────────────────────────────────────┐
│ 4. Backup (선택)                             │
│    - 재해 복구용                             │
│    - Point-in-Time Recovery                  │
└─────────────────────────────────────────────┘
```

---

## 🚀 즉시 적용 가이드

### Step 1: Production용 Supabase 새로 생성

1. **Supabase 대시보드** 접속
   - https://supabase.com/dashboard

2. **New Project** 클릭
   - Name: `arco-production`
   - Database Password: 강력한 비밀번호 (저장 필수!)
   - Region: `Northeast Asia (Seoul)` (가장 가까운 지역)
   - Pricing Plan: `Free` (시작은 무료)

3. **프로젝트 정보 저장**
   ```
   URL: https://[새로생성된ID].supabase.co
   ANON_KEY: eyJhbG...
   SERVICE_ROLE_KEY: eyJhbG...
   ```

---

### Step 2: 환경별 .env 파일 관리

#### 📁 `.env.development` (로컬 개발용)
```bash
# Development Supabase (기존)
NEXT_PUBLIC_SUPABASE_URL=https://uuiresymwsjpamntmkyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Development용 설정
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

#### 📁 `.env.production` (실운영용)
```bash
# Production Supabase (새로 생성)
NEXT_PUBLIC_SUPABASE_URL=https://[새프로젝트ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (새 키)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (새 키)

# Production용 설정
NEXT_PUBLIC_APP_URL=https://arco.kr
NEXT_PUBLIC_ENVIRONMENT=production

# 실제 결제 키 (프로덕션)
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_...
TOSS_SECRET_KEY=live_sk_...
```

---

### Step 3: Vercel 환경 분리

#### 개발 환경 (Preview)
```bash
Project: arco-web (Preview Deployments)
Environment Variables: Development용 .env
Branch: develop 또는 feature/* 브랜치
URL: arco-web-git-develop.vercel.app
```

#### 프로덕션 환경
```bash
Project: arco-web (Production)
Environment Variables: Production용 .env
Branch: main
URL: arco.vercel.app → arco.kr
```

**Vercel 설정 방법**:
1. Vercel Dashboard → arco-web → Settings → Environment Variables
2. Environment별로 다른 값 설정
   - `Production` 탭: 프로덕션 Supabase 정보
   - `Preview` 탭: 개발 Supabase 정보
   - `Development` 탭: 로컬 개발 Supabase 정보

---

### Step 4: 마이그레이션 워크플로우

#### 개발 → 프로덕션 배포 절차

```bash
# 1. Development에서 마이그레이션 개발
cd /home/user/webapp
npm run migration:new add_new_feature

# 2. Development DB에 적용 (테스트)
npx supabase db push --linked

# 3. 로컬 테스트
npm run dev
# → http://localhost:3000 에서 테스트

# 4. 테스트 통과 후 Git 커밋
git add .
git commit -m "feat: Add new feature with migration"
git push origin develop

# 5. Vercel Preview 배포 자동 실행
# → https://arco-web-git-develop.vercel.app 에서 확인

# 6. 최종 확인 후 main에 병합
git checkout main
git merge develop
git push origin main

# 7. Production 배포 (수동 또는 자동)
# Vercel이 자동으로 배포
# → https://arco.vercel.app

# 8. Production DB에 마이그레이션 적용
# Supabase Dashboard → SQL Editor에서 수동 실행
# 또는 CI/CD로 자동화
```

---

## 📊 환경별 비교

| 항목 | Development | Staging | Production |
|------|-------------|---------|------------|
| **용도** | 개발, 실험 | QA 테스트 | 실제 서비스 |
| **데이터** | 테스트 데이터 | 프로덕션 복제 | 실제 고객 데이터 |
| **마이그레이션** | 자유롭게 테스트 | 프로덕션 전 검증 | 신중하게 적용 |
| **백업** | 불필요 | 선택 | **필수** |
| **모니터링** | 불필요 | 권장 | **필수** |
| **비용** | Free | Free/Pro | Pro (규모 따라) |
| **URL** | localhost:3000 | staging.arco.kr | arco.kr |

---

## 💰 비용 분석

### Supabase 무료 플랜
- ✅ 프로젝트 2개까지 무료
- ✅ 500MB Database
- ✅ 1GB File Storage
- ✅ 2GB Bandwidth

### 현실적인 구성

#### 초기 (지금)
```
Development: Free Plan ($0/월)
Production: Free Plan ($0/월)
─────────────────────────────
총 비용: $0/월
```

#### 성장 후 (월 매출 1,000만원+)
```
Development: Free Plan ($0/월)
Production: Pro Plan ($25/월)
  - 8GB Database
  - 100GB Storage
  - 250GB Bandwidth
─────────────────────────────
총 비용: $25/월 (약 33,000원)
```

#### 대규모 (월 매출 1억원+)
```
Development: Free Plan ($0/월)
Staging: Pro Plan ($25/월)
Production: Pro Plan + Add-ons ($100/월)
  - 무제한 Database
  - 500GB Storage
  - 자동 백업
─────────────────────────────
총 비용: $125/월 (약 165,000원)
```

---

## 🎯 즉시 행동 계획

### 지금 바로 (10분)
1. ✅ Supabase 새 프로젝트 생성 (arco-production)
2. ✅ 환경 변수 정리 (.env.development, .env.production)
3. ✅ Vercel 환경 변수 분리 설정

### 이번 주 (1시간)
4. ✅ Production DB 마이그레이션 적용
5. ✅ Admin 계정 생성
6. ✅ Production 배포 테스트

### 다음 주 (선택)
7. 🔲 Staging 환경 추가 (필요 시)
8. 🔲 자동 백업 설정
9. 🔲 모니터링 도구 설정

---

## 📋 체크리스트

### 현재 상태
- [x] Development DB 있음 (uuiresymwsjpamntmkyb)
- [ ] Production DB 별도 분리
- [ ] Staging DB
- [ ] 자동 백업 설정
- [ ] 환경별 .env 분리
- [ ] Vercel 환경 변수 분리

### 권장 우선순위

#### 🚨 긴급 (지금 바로)
- [ ] **Production DB 새로 생성**
- [ ] **환경 변수 분리**
- [ ] **Vercel 환경 설정**

#### ⚠️ 중요 (이번 주)
- [ ] Production 마이그레이션
- [ ] 백업 활성화
- [ ] 배포 프로세스 문서화

#### 💡 추천 (다음 주)
- [ ] Staging 환경 추가
- [ ] CI/CD 자동화
- [ ] 모니터링 설정

---

## 🎓 참고: 산업 표준

### 스타트업 (시드 ~ 시리즈 A)
```
Development + Production (2개)
비용: $0 ~ $50/월
```

### 중소기업 (시리즈 B ~ C)
```
Development + Staging + Production (3개)
비용: $50 ~ $200/월
```

### 대기업 / 유니콘
```
Development + QA + Staging + Production + DR (5개+)
비용: $500 ~ $5,000+/월
```

---

## 💬 대표님께 추천

### 현재 ARCO 규모 고려 시

**추천**: **2-Tier (Development + Production)**

**이유**:
1. ✅ 초기 비용 $0 (Supabase Free x 2)
2. ✅ 실수로 프로덕션 데이터 손실 방지
3. ✅ 마이그레이션 안전하게 테스트
4. ✅ 설정 10분이면 완료
5. ✅ 확장 시 Staging 쉽게 추가 가능

**Staging은 나중에 추가**:
- 팀이 3명 이상으로 늘어나면
- 월 매출이 1,000만원 넘어가면
- QA 프로세스가 필요해지면

---

## 🚀 지금 바로 시작하시겠어요?

제가 도와드릴 수 있습니다:

1. **Supabase Production 프로젝트 생성 가이드**
2. **환경 변수 파일 자동 생성**
3. **Vercel 설정 스크립트**
4. **마이그레이션 자동 배포 스크립트**

어떤 것부터 시작하시겠어요? 🎯
