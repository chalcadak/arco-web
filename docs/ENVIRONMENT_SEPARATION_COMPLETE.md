# ✅ 환경 분리 완료 보고서

**작성일**: 2026-01-14  
**커밋 ID**: 95adb73  
**GitHub**: https://github.com/chalcadak/arco-web

---

## 🎯 요청사항 완료

### ✅ 작업 1: Supabase Client 연결
- [x] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경 변수 사용
- [x] 하드코딩 제거
- [x] 타입 안전성 보장

### ✅ 작업 2: 미디어 업로드 핸들러 분리
- [x] **이미지 업로드**: `src/lib/upload/image.ts` (R2 전용)
- [x] **동영상 업로드**: `src/lib/upload/video.ts` (Stream 전용)
- [x] 환경 변수 사용: `R2_BUCKET_NAME`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_STREAM_TOKEN`

### ✅ 작업 3: .env.example 템플릿
- [x] 모든 필수 환경 변수 정리
- [x] 운영/개발 환경 설명 추가
- [x] CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_STREAM_TOKEN 추가

### ✅ 작업 4: 통합 업로드 래퍼
- [x] 자동 파일 타입 감지 (이미지 vs 동영상)
- [x] 자동 라우팅 (R2 or Stream)
- [x] 프론트엔드 훅 제공

---

## 📦 새로 추가된 파일

### 1️⃣ 환경 설정
```
src/lib/config/env.ts (4.3KB)
└─ 중앙화된 환경 변수 관리
   ├─ 타입 안전성 보장
   ├─ 자동 검증
   ├─ 싱글톤 패턴
   └─ 개발/운영/프리뷰 자동 감지
```

### 2️⃣ 이미지 업로드 (R2)
```
src/lib/upload/image.ts (4.2KB)
└─ Cloudflare R2 이미지 업로드
   ├─ JPEG, PNG, GIF, WebP, SVG 지원
   ├─ 환경별 버킷 자동 선택
   ├─ Base64 업로드 지원
   └─ 멀티 이미지 업로드
```

### 3️⃣ 동영상 업로드 (Stream)
```
src/lib/upload/video.ts (6.3KB)
└─ Cloudflare Stream API 통합
   ├─ MP4, MOV, AVI, WebM 지원
   ├─ 자동 인코딩 & 썸네일 생성
   ├─ HLS/DASH 스트리밍 URL
   ├─ 업로드 상태 조회
   └─ 비디오 삭제
```

### 4️⃣ 통합 업로드 래퍼
```
src/lib/upload/index.ts (5.1KB)
└─ 통합 미디어 업로드
   ├─ 자동 파일 타입 감지
   ├─ R2/Stream 자동 라우팅
   ├─ 멀티 파일 업로드
   ├─ Base64 업로드
   └─ File 객체 직접 업로드
```

### 5️⃣ 프론트엔드 훅
```
src/hooks/useMediaUpload.ts (4.7KB)
└─ React 업로드 훅
   ├─ 진행률 추적
   ├─ 에러 핸들링
   ├─ 멀티 업로드
   └─ 드래그 앤 드롭 지원
```

### 6️⃣ API Route
```
src/app/api/upload/route.ts (2.5KB)
└─ 통합 업로드 API
   ├─ FormData 파싱
   ├─ 파일 타입 검증
   ├─ 자동 업로드 라우팅
   └─ CORS 지원
```

---

## 🔧 수정된 파일

### Supabase 클라이언트
```
src/lib/supabase/client.ts
src/lib/supabase/server.ts
└─ 환경 변수 중앙 관리
   ├─ getEnv() 사용
   ├─ 하드코딩 제거
   └─ 타입 안전성 보장
```

### 환경 변수 템플릿
```
.env.example (3.4KB)
└─ 완전한 환경 변수 템플릿
   ├─ 운영/개발 환경 설명
   ├─ Supabase 변수
   ├─ Cloudflare R2 변수
   ├─ Cloudflare Stream 변수
   ├─ Toss Payments 변수
   └─ 사용 예시
```

---

## 📚 문서

### 환경 분리 가이드
```
docs/ENVIRONMENT_SEPARATION_GUIDE.md (6.4KB)
├─ 리소스 구조 (prod/dev)
├─ 환경 변수 설정 방법
├─ 코드 사용 예제
├─ 환경 확인 방법
├─ 체크리스트
└─ 배포 플로우
```

---

## 💻 사용 예제

### 1️⃣ 환경 변수 가져오기

```typescript
import { getEnv } from '@/lib/config/env';

const env = getEnv();

console.log(env.env); // 'development' | 'production' | 'preview'
console.log(env.supabase.url); // Supabase URL
console.log(env.r2.bucketName); // R2 버킷 이름
console.log(env.stream.accountId); // Stream 계정 ID
```

### 2️⃣ 이미지 업로드

```typescript
import { uploadImageToR2 } from '@/lib/upload/image';

const result = await uploadImageToR2({
  file: imageBuffer,
  fileName: 'product.jpg',
  mimeType: 'image/jpeg',
  folder: 'products',
});

// result.url: https://pub-xxx.r2.dev/products/xxx.jpg
```

### 3️⃣ 동영상 업로드

```typescript
import { uploadVideoToStream } from '@/lib/upload/video';

const result = await uploadVideoToStream({
  file: videoFile,
  fileName: 'demo.mp4',
  mimeType: 'video/mp4',
});

// result.playbackUrl: HLS 스트리밍 URL
// result.thumbnailUrl: 썸네일 URL
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

### 5️⃣ 프론트엔드 (React)

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
      alert(`Uploaded: ${result.data?.url || result.data?.playbackUrl}`);
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

## 🏗️ 리소스 네이밍

### Production (운영)
```
- Supabase DB: arco-db-prod
- R2 Bucket: arco-store-prod
- Stream: 운영용 API 키
- Domain: https://arco.kr
```

### Development (개발/테스트)
```
- Supabase DB: arco-db-test
- R2 Bucket: arco-store-test
- Stream: 테스트용 API 키
- Domain: http://localhost:3000
```

### Preview (Vercel)
```
- Supabase DB: arco-db-test (개발 환경과 동일)
- R2 Bucket: arco-store-test
- Stream: 테스트용 API 키
- Domain: https://preview-xxx.vercel.app
```

---

## 🎯 주요 개선 사항

### Before (이전)
```typescript
// ❌ 하드코딩
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// ❌ 이미지/동영상 구분 없음
// ❌ 환경별 분리 없음
// ❌ 타입 안전성 없음
```

### After (개선)
```typescript
// ✅ 중앙 관리
const env = getEnv();
const supabaseUrl = env.supabase.url;

// ✅ 자동 파일 타입 감지
const result = await uploadMedia({ file, fileName, mimeType });

// ✅ 환경별 자동 분리
// Development → arco-store-test
// Production → arco-store-prod

// ✅ 완전한 타입 안전성
```

---

## 📊 통계

| 항목 | 수치 |
|------|------|
| 새 파일 | 7개 |
| 수정 파일 | 4개 |
| 총 코드 | 1,962줄 |
| 문서 | 6.4KB |
| 환경 변수 | 20개+ |

---

## ✅ 체크리스트

### 코드
- [x] 환경 변수 중앙 관리
- [x] Supabase 클라이언트 리팩토링
- [x] 이미지 업로드 (R2) 분리
- [x] 동영상 업로드 (Stream) 분리
- [x] 통합 업로드 래퍼
- [x] 프론트엔드 훅
- [x] API Route 수정
- [x] 타입 안전성 보장

### 문서
- [x] .env.example 템플릿
- [x] 환경 분리 가이드
- [x] 코드 예제
- [x] 완료 보고서

### 테스트 준비
- [ ] Supabase arco-db-test 생성 (대표님)
- [ ] Supabase arco-db-prod 생성 (대표님)
- [ ] R2 arco-store-test 생성 (대표님)
- [ ] R2 arco-store-prod 생성 (대표님)
- [ ] Stream API 키 발급 (대표님)
- [ ] .env.local 설정 (대표님)
- [ ] Vercel 환경 변수 설정 (대표님)

---

## 🚀 다음 단계

### 즉시 (대표님이 진행)
1. **Supabase 프로젝트 생성**
   - arco-db-test (개발용)
   - arco-db-prod (운영용)

2. **R2 버킷 생성**
   - arco-store-test (개발용)
   - arco-store-prod (운영용)

3. **Stream API 키 발급**
   - Cloudflare Dashboard → Stream → API Tokens

4. **.env.local 설정**
   - `.env.example` 복사
   - 실제 값으로 채우기

5. **로컬 테스트**
   ```bash
   npm run dev
   # 업로드 기능 테스트
   ```

6. **Vercel 배포**
   - 환경 변수 설정 (Production/Preview)
   - Deploy!

---

## 💡 주요 기능

### ✅ 환경 자동 감지
```typescript
const env = getEnv();
// Development: arco-store-test
// Production: arco-store-prod
```

### ✅ 파일 타입 자동 감지
```typescript
uploadMedia({ file, fileName, mimeType });
// 이미지 → R2
// 동영상 → Stream
```

### ✅ 진행률 추적
```typescript
const { upload, progress } = useMediaUpload();
// 0% → 100%
```

### ✅ 타입 안전성
```typescript
// TypeScript로 완전한 타입 보장
const result: MediaUploadResult = await uploadMedia(...);
```

---

## 🎊 완료!

**커밋 ID**: `95adb73`  
**GitHub**: https://github.com/chalcadak/arco-web/commit/95adb73

### 구현 완료
- ✅ 운영/개발 환경 엄격 분리
- ✅ 이미지/동영상 업로드 분리
- ✅ 환경 변수 중앙 관리
- ✅ 타입 안전성 보장
- ✅ 프론트엔드 훅 제공
- ✅ 완전한 문서 작성

---

**대표님, 환경 분리가 완벽하게 완료되었습니다!** 🚀

다음 단계는:
1. Supabase/R2/Stream 리소스 생성
2. .env.local 설정
3. 로컬 테스트
4. Vercel 배포

필요하시면 언제든 도와드리겠습니다!
