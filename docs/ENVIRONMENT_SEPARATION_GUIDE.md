# 🔧 ARCO 환경 분리 가이드

## 📋 개요

ARCO 프로젝트는 **운영(Production)**과 **개발/테스트(Development/Preview)** 환경을 엄격하게 분리합니다.

---

## 🏗️ 리소스 구조

### Production (운영)
```
- Supabase DB: arco-db-prod
- R2 Bucket: arco-store-prod
- Stream: 운영용 API 키
- Domain: https://arco.kr
```

### Development/Preview (개발/테스트)
```
- Supabase DB: arco-db-test
- R2 Bucket: arco-store-test
- Stream: 테스트용 API 키
- Domain: http://localhost:3000 또는 https://preview-xxx.vercel.app
```

---

## 📁 파일 구조

### 새로 추가된 파일
```
src/
├── lib/
│   ├── config/
│   │   └── env.ts                 # 🆕 환경 변수 중앙 관리
│   └── upload/
│       ├── index.ts               # 🆕 통합 업로드 래퍼
│       ├── image.ts               # 🆕 R2 이미지 업로드
│       └── video.ts               # 🆕 Stream 동영상 업로드
│
├── hooks/
│   └── useMediaUpload.ts          # 🆕 프론트엔드 업로드 훅
│
└── app/
    └── api/
        └── upload/
            └── route.ts           # ✏️ 수정: 통합 업로드 API

.env.example                       # ✏️ 수정: 환경 변수 템플릿
```

---

## 🔐 환경 변수 설정

### 1️⃣ Development (.env.local)

```bash
# 환경
NODE_ENV=development

# Supabase (테스트 DB)
NEXT_PUBLIC_SUPABASE_URL=https://arco-db-test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key

# Cloudflare R2 (테스트 버킷)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET_NAME=arco-store-test
CLOUDFLARE_R2_PUBLIC_URL=https://pub-test.r2.dev

# Cloudflare Stream (테스트 키)
CLOUDFLARE_STREAM_API_TOKEN=your-test-stream-token

# Toss Payments (테스트 키)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_SECRET_KEY=test_sk_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com
```

### 2️⃣ Production (Vercel 환경 변수)

Vercel Dashboard → Settings → Environment Variables

**Production 환경만 적용**:
```bash
# Supabase (운영 DB)
NEXT_PUBLIC_SUPABASE_URL=https://arco-db-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key

# Cloudflare R2 (운영 버킷)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET_NAME=arco-store-prod
CLOUDFLARE_R2_PUBLIC_URL=https://pub-prod.r2.dev

# Cloudflare Stream (운영 키)
CLOUDFLARE_STREAM_API_TOKEN=your-prod-stream-token

# Toss Payments (실제 키)
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_xxxxx
TOSS_SECRET_KEY=live_sk_xxxxx

# App
NEXT_PUBLIC_APP_URL=https://arco.kr
NEXT_PUBLIC_ADMIN_EMAIL=admin@arco.com
```

### 3️⃣ Preview (Vercel 환경 변수)

**Preview 환경만 적용** (테스트 리소스 사용):
```bash
# Development와 동일한 설정
NEXT_PUBLIC_SUPABASE_URL=https://arco-db-test.supabase.co
CLOUDFLARE_R2_BUCKET_NAME=arco-store-test
...
```

---

## 💻 코드 사용법

### 1️⃣ 환경 변수 가져오기

```typescript
import { getEnv } from '@/lib/config/env';

const env = getEnv();

console.log(env.env); // 'development' | 'production' | 'preview'
console.log(env.supabase.url); // Supabase URL
console.log(env.r2.bucketName); // R2 버킷 이름
console.log(env.stream.accountId); // Stream 계정 ID
```

### 2️⃣ 이미지 업로드 (R2)

```typescript
import { uploadImageToR2 } from '@/lib/upload/image';

// 서버사이드
const result = await uploadImageToR2({
  file: imageBuffer,
  fileName: 'product.jpg',
  mimeType: 'image/jpeg',
  folder: 'products',
});

console.log(result.url); // https://pub-xxx.r2.dev/products/xxx.jpg
```

### 3️⃣ 동영상 업로드 (Stream)

```typescript
import { uploadVideoToStream } from '@/lib/upload/video';

// 서버사이드
const result = await uploadVideoToStream({
  file: videoBuffer,
  fileName: 'demo.mp4',
  mimeType: 'video/mp4',
});

console.log(result.playbackUrl); // HLS 스트리밍 URL
console.log(result.thumbnailUrl); // 썸네일 URL
```

### 4️⃣ 통합 업로드 (자동 감지)

```typescript
import { uploadMedia } from '@/lib/upload';

// 자동으로 이미지/동영상 구분
const result = await uploadMedia({
  file: fileBuffer,
  fileName: file.name,
  mimeType: file.type,
  folder: 'products',
});

if (result.type === 'image') {
  console.log('Image URL:', result.image?.url);
} else if (result.type === 'video') {
  console.log('Video URL:', result.video?.playbackUrl);
}
```

### 5️⃣ 프론트엔드 업로드

```typescript
'use client';

import { useMediaUpload } from '@/hooks/useMediaUpload';

function UploadForm() {
  const { upload, isUploading, progress, error } = useMediaUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await upload(file, 'products');

    if (result.success) {
      console.log('Uploaded:', result.data);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileChange} 
        disabled={isUploading} 
      />
      {isUploading && <p>Uploading... {progress}%</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

---

## 🔍 환경 확인 방법

### 서버사이드
```typescript
import { getEnv } from '@/lib/config/env';

const env = getEnv();

if (env.isProduction) {
  console.log('운영 환경입니다');
} else if (env.isDevelopment) {
  console.log('개발 환경입니다');
} else if (env.isPreview) {
  console.log('프리뷰 환경입니다');
}
```

### 클라이언트사이드
```typescript
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
```

---

## ✅ 체크리스트

### Supabase 설정
- [ ] arco-db-test 프로젝트 생성
- [ ] arco-db-prod 프로젝트 생성
- [ ] 각각의 URL과 키 발급
- [ ] .env.local에 test 설정
- [ ] Vercel에 prod 환경 변수 설정

### Cloudflare R2 설정
- [ ] arco-store-test 버킷 생성
- [ ] arco-store-prod 버킷 생성
- [ ] 각각의 Public URL 설정
- [ ] Access Key 발급
- [ ] .env.local에 test 설정
- [ ] Vercel에 prod 환경 변수 설정

### Cloudflare Stream 설정
- [ ] API 토큰 발급 (권한: Stream Read, Stream Edit)
- [ ] 테스트용/운영용 토큰 분리 (선택)
- [ ] .env.local에 설정
- [ ] Vercel에 환경 변수 설정

---

## 🚀 배포 플로우

```
1. 개발
   └─ localhost:3000
   └─ arco-db-test
   └─ arco-store-test

2. PR 생성
   └─ Vercel Preview 배포
   └─ arco-db-test (Preview 환경 변수)
   └─ arco-store-test

3. main 브랜치 머지
   └─ Vercel Production 배포
   └─ arco-db-prod (Production 환경 변수)
   └─ arco-store-prod
```

---

## 📚 관련 문서

- `.env.example`: 환경 변수 템플릿
- `src/lib/config/env.ts`: 환경 설정 관리
- `src/lib/upload/`: 업로드 로직
- `src/hooks/useMediaUpload.ts`: 프론트엔드 훅

---

## 💡 주의사항

1. **환경 변수 검증**: `getEnv()` 함수가 자동으로 필수 변수를 검증합니다
2. **타입 안전성**: TypeScript로 환경 변수 타입이 보장됩니다
3. **캐싱**: 환경 설정은 싱글톤 패턴으로 캐시됩니다
4. **로깅**: 개발 환경에서만 환경 설정이 콘솔에 출력됩니다

---

**대표님, 환경 분리 완료되었습니다!** 🎉
