# OAuth 소셜 로그인 설정 가이드

ARCO 플랫폼에서 Google, Kakao, Naver 소셜 로그인을 설정하는 방법입니다.

## 1. Supabase OAuth 프로바이더 설정

### Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. **API 및 서비스 > 사용자 인증 정보** 이동
4. **사용자 인증 정보 만들기 > OAuth 2.0 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션**
6. 승인된 리디렉션 URI 추가:
   ```
   https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
   ```
7. 클라이언트 ID와 클라이언트 보안 비밀번호 저장

**Supabase 설정:**
- Supabase Dashboard → Authentication → Providers → Google
- **Enable** 토글 ON
- Google 클라이언트 ID 입력
- Google 클라이언트 보안 비밀번호 입력
- **Save** 클릭

### Kakao OAuth 설정

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. **내 애플리케이션** → 애플리케이션 추가
3. **제품 설정 > 카카오 로그인** 활성화
4. **Redirect URI** 등록:
   ```
   https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
   ```
5. **동의 항목** 설정:
   - 닉네임 (필수)
   - 프로필 이미지 (선택)
   - 카카오계정(이메일) (필수)
6. REST API 키 저장

**Supabase 설정:**
- Supabase Dashboard → Authentication → Providers → Kakao
- **Enable** 토글 ON
- Kakao REST API 키를 Client ID에 입력
- **Save** 클릭

### Naver OAuth 설정

1. [네이버 개발자 센터](https://developers.naver.com/apps/#/register) 접속
2. **애플리케이션 등록** 클릭
3. **애플리케이션 이름** 입력 (예: ARCO)
4. **사용 API** 선택: 네이버 로그인
5. **제공 정보** 선택:
   - 회원이름 (필수)
   - 이메일 주소 (필수)
   - 프로필 이미지 (선택)
6. **서비스 환경** 추가:
   - PC 웹: `https://your-domain.com`
7. **Callback URL** 등록:
   ```
   https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
   ```
8. Client ID와 Client Secret 저장

**Supabase 설정:**
- Supabase Dashboard → Authentication → Providers → Custom
- Provider 이름: `naver`
- **Enable** 토글 ON
- Naver Client ID 입력
- Naver Client Secret 입력
- Authorization URL: `https://nid.naver.com/oauth2.0/authorize`
- Token URL: `https://nid.naver.com/oauth2.0/token`
- User Info URL: `https://openapi.naver.com/v1/nid/me`
- **Save** 클릭

## 2. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-SUPABASE-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]

# OAuth Redirect URL (로컬 개발)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OAuth Redirect URL (프로덕션)
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 3. Supabase 프로필 테이블 설정

프로필 테이블이 없다면 다음 SQL을 실행하세요:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, provider)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 4. 코드 구현

### OAuth 로그인 함수

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

// Google 로그인
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    console.error('Google login error:', error);
  }
}

// Kakao 로그인
async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    console.error('Kakao login error:', error);
  }
}

// Naver 로그인
async function signInWithNaver() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'naver',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    console.error('Naver login error:', error);
  }
}
```

## 5. 로컬 테스트

1. Supabase 프로바이더 설정 완료
2. 환경 변수 설정
3. 개발 서버 실행: `npm run dev`
4. 로그인 페이지 접속: `http://localhost:3000/login`
5. 소셜 로그인 버튼 클릭
6. OAuth 인증 후 리디렉션 확인

## 6. 프로덕션 배포

1. Vercel 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (프로덕션 도메인)

2. OAuth 프로바이더 Redirect URI 업데이트:
   - Google: 프로덕션 도메인 추가
   - Kakao: 프로덕션 도메인 추가
   - Naver: 프로덕션 도메인 추가

3. 배포 후 테스트

## 7. 트러블슈팅

### 문제: "redirect_uri_mismatch" 에러

**해결:**
- OAuth 프로바이더 콘솔에서 Redirect URI가 정확한지 확인
- Supabase 콜백 URL 형식: `https://[PROJECT-REF].supabase.co/auth/v1/callback`

### 문제: "invalid_client" 에러

**해결:**
- Client ID와 Client Secret이 정확한지 확인
- Supabase에 올바른 값이 입력되었는지 확인

### 문제: 프로필이 자동 생성되지 않음

**해결:**
- `handle_new_user` 함수와 트리거가 제대로 생성되었는지 확인
- Supabase Database → Functions에서 확인

## 8. 보안 고려사항

1. **Client Secret 보호**: 절대로 프론트엔드 코드에 노출하지 마세요
2. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 사용
3. **리디렉션 검증**: 허용된 도메인만 리디렉션되도록 설정
4. **사용자 정보 최소화**: 필요한 최소한의 정보만 요청

## 참고 자료

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Google OAuth 문서](https://developers.google.com/identity/protocols/oauth2)
- [Kakao 로그인 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [네이버 로그인 문서](https://developers.naver.com/docs/login/overview/)
