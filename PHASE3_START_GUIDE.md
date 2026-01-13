# Phase 3 시작 가이드

**ARCO - 관리자 페이지 구현**

---

## 📅 세션 정보

- **Phase**: Phase 3 - 관리자 페이지 구현
- **예상 기간**: Week 6-8 (12-16시간)
- **현재 진행률**: 5% (로그인 페이지 생성 시작)
- **다음 세션 시작일**: 2026-01-12 (예정)

---

## 🎯 Phase 3 전체 목표

### 1단계: 인증 시스템 (2-3시간)
- [x] 로그인 페이지 생성 (완료, 미커밋)
- [x] LoginForm 컴포넌트 (완료, 미커밋)
- [ ] Protected Routes 미들웨어
- [ ] 로그아웃 기능
- [ ] 세션 관리

### 2단계: 관리자 레이아웃 (1-2시간)
- [ ] AdminLayout 컴포넌트 (사이드바, 헤더)
- [ ] 네비게이션 메뉴
- [ ] 반응형 사이드바
- [ ] 로그아웃 버튼

### 3단계: 대시보드 (2-3시간)
- [ ] 주요 지표 카드 (매출, 주문, 예약)
- [ ] 차트 (일별/주별/월별)
- [ ] 최근 활동 피드
- [ ] 빠른 액션 버튼

### 4단계: 예약 관리 (3-4시간)
- [ ] 예약 목록 페이지 (테이블, 필터, 정렬)
- [ ] 예약 상세 페이지
- [ ] 예약 상태 변경 (대기→확정→완료→취소)
- [ ] 일정 캘린더 뷰
- [ ] 예약 통계

### 5단계: 상품 관리 (4-5시간)
- [ ] 상품 목록 페이지
- [ ] 상품 등록 폼
- [ ] 상품 수정 폼
- [ ] 상품 삭제 (soft delete)
- [ ] 이미지 업로드 (Cloudflare R2)
- [ ] 옵션 관리 (사이즈, 색상)
- [ ] 재고 관리

### 6단계: 촬영룩 관리 (2-3시간)
- [ ] 촬영룩 목록 페이지
- [ ] 촬영룩 등록 폼
- [ ] 촬영룩 수정 폼
- [ ] 촬영룩 삭제
- [ ] 이미지 업로드
- [ ] 포함 항목 관리

### 7단계: 주문 관리 (2-3시간)
- [ ] 주문 목록 페이지
- [ ] 주문 상세 페이지
- [ ] 주문 상태 변경
- [ ] 배송 정보 입력
- [ ] 주문 통계

---

## 📂 생성 예정 파일 구조

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx                    # 관리자 전용 레이아웃
│       ├── login/
│       │   └── page.tsx                  # ✅ 로그인 페이지 (생성됨, 미커밋)
│       ├── dashboard/
│       │   └── page.tsx                  # 대시보드
│       ├── bookings/
│       │   ├── page.tsx                  # 예약 목록
│       │   └── [id]/
│       │       └── page.tsx              # 예약 상세
│       ├── products/
│       │   ├── page.tsx                  # 상품 목록
│       │   ├── new/
│       │   │   └── page.tsx              # 상품 등록
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx          # 상품 수정
│       ├── photoshoots/
│       │   ├── page.tsx                  # 촬영룩 목록
│       │   ├── new/
│       │   │   └── page.tsx              # 촬영룩 등록
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx          # 촬영룩 수정
│       └── orders/
│           ├── page.tsx                  # 주문 목록
│           └── [id]/
│               └── page.tsx              # 주문 상세
├── components/
│   └── admin/
│       ├── LoginForm.tsx                 # ✅ 로그인 폼 (생성됨, 미커밋)
│       ├── AdminLayout.tsx               # 관리자 레이아웃
│       ├── Sidebar.tsx                   # 사이드바
│       ├── AdminHeader.tsx               # 관리자 헤더
│       ├── DashboardStats.tsx            # 대시보드 통계
│       ├── BookingTable.tsx              # 예약 테이블
│       ├── ProductForm.tsx               # 상품 폼
│       ├── PhotoshootForm.tsx            # 촬영룩 폼
│       └── OrderTable.tsx                # 주문 테이블
├── lib/
│   └── supabase/
│       └── client.ts                     # ✅ 클라이언트 (수정됨, 미커밋)
└── middleware.ts                         # Protected Routes 미들웨어
```

---

## 🔧 다음 세션 시작 체크리스트

### 1. 환경 확인
- [ ] GitHub 저장소 최신 상태 확인
- [ ] 로컬 환경 또는 새 샌드박스 준비
- [ ] Node.js & npm 버전 확인
- [ ] Supabase 연결 테스트

### 2. 코드 복구
- [ ] Phase 3 시작 시 생성된 파일 복구:
  - `src/app/admin/login/page.tsx`
  - `src/components/admin/LoginForm.tsx`
  - `src/lib/supabase/client.ts`

### 3. 의존성 설치
- [ ] 필요한 패키지 확인:
  - `recharts` (차트 라이브러리)
  - `react-hook-form` (폼 관리)
  - `zod` (폼 검증)

### 4. Supabase 설정
- [ ] RLS 정책 확인 (관리자 전용)
- [ ] users 테이블 role 컬럼 확인
- [ ] 관리자 계정 생성 (admin@arco.com)

---

## 📝 미완성 파일 내용

다음 세션에서 다시 생성해야 할 파일들의 내용:

### 1. `/src/app/admin/login/page.tsx`
```typescript
import { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: '관리자 로그인 - ARCO',
  description: 'ARCO 관리자 페이지 로그인',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">ARCO</h1>
          <p className="text-muted-foreground">관리자 로그인</p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>관리자 계정으로만 접근 가능합니다.</p>
        </div>
      </div>
    </div>
  );
}
```

### 2. `/src/components/admin/LoginForm.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      // 로그인 시도
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.user) {
        throw new Error('로그인에 실패했습니다.');
      }

      // 사용자 역할 확인
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) {
        throw new Error('사용자 정보를 불러올 수 없습니다.');
      }

      // 관리자 권한 체크
      if (userData.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('관리자 권한이 없습니다.');
      }

      // 관리자 대시보드로 이동
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@arco.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 3. `/src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

---

## 🗄️ Supabase 설정 필요 사항

### 1. 관리자 계정 생성
```sql
-- Supabase Auth에서 사용자 생성 후
-- users 테이블에 role 업데이트
UPDATE users
SET role = 'admin'
WHERE email = 'admin@arco.com';
```

### 2. RLS 정책 (관리자 전용)
```sql
-- 관리자만 모든 데이터 접근 가능
CREATE POLICY "Admin full access"
ON products
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

-- 다른 테이블에도 동일하게 적용
```

---

## 📊 Phase 3 상세 계획

### Week 6: 인증 & 레이아웃 (Day 1-2)
- **Day 1**: 인증 시스템 완성
  - 로그인/로그아웃
  - Protected Routes
  - 세션 관리
- **Day 2**: 관리자 레이아웃
  - 사이드바 네비게이션
  - 헤더
  - 반응형 디자인

### Week 6-7: 핵심 관리 기능 (Day 3-5)
- **Day 3**: 대시보드
  - 주요 지표
  - 차트
  - 최근 활동
- **Day 4**: 예약 관리
  - 목록
  - 상세
  - 상태 변경
- **Day 5**: 예약 관리 완성
  - 캘린더 뷰
  - 통계

### Week 7-8: CRUD 기능 (Day 6-10)
- **Day 6-7**: 상품 관리
  - 목록
  - 등록
  - 수정
  - 삭제
  - 이미지 업로드
- **Day 8**: 촬영룩 관리
  - 목록
  - 등록
  - 수정
- **Day 9**: 주문 관리
  - 목록
  - 상세
  - 상태 변경
- **Day 10**: 테스트 & 최적화

---

## 🎯 성공 기준

### Phase 3 완료 조건
- [ ] 관리자 로그인/로그아웃 정상 작동
- [ ] 대시보드에서 주요 지표 표시
- [ ] 예약 목록 조회 및 상태 변경 가능
- [ ] 상품 CRUD 모두 작동
- [ ] 촬영룩 CRUD 모두 작동
- [ ] 주문 목록 조회 및 관리 가능
- [ ] 이미지 업로드 (Cloudflare R2) 작동
- [ ] 반응형 디자인 적용
- [ ] 모든 기능 테스트 완료

---

## 📦 필요한 패키지

다음 세션에서 설치할 패키지:

```bash
# 차트 라이브러리
npm install recharts

# 폼 관리 & 검증
npm install react-hook-form zod @hookform/resolvers

# 날짜/시간 (이미 설치됨)
# date-fns, react-day-picker

# 테이블 (선택)
npm install @tanstack/react-table
```

---

## 💬 다음 세션 시작 멘트

```
"Phase 3 관리자 페이지 구현을 시작하겠습니다.

이전 세션에서 로그인 페이지를 생성했지만 샌드박스 타임아웃으로 
커밋하지 못했습니다. 다시 생성하여 진행하겠습니다.

먼저 환경을 확인하고 필요한 파일들을 생성하겠습니다."
```

---

## 📂 중요 파일 및 링크

- **저장소**: https://github.com/chalcadak/arco-web
- **브랜치**: `genspark_ai_developer`
- **최신 커밋**: `1a77960` (Phase 2 완료)
- **Phase 2 상태**: 100% 완료
- **Phase 3 상태**: 5% (시작 단계)

---

## 🎉 Phase 2 완료 요약 (참고)

- **판매상품**: 리스트, 상세, 장바구니 ✅
- **촬영룩**: 리스트, 상세 ✅
- **예약 시스템**: 폼, API, 완료 페이지 ✅
- **페이지 수**: 9개
- **컴포넌트**: 11개
- **API 엔드포인트**: 4개
- **문서**: 완료 보고서, 테스트 가이드

---

## ✅ 준비 완료!

다음 세션에서 이 문서를 참고하여 Phase 3를 원활하게 시작할 수 있습니다.

**파일 위치**: `PHASE3_START_GUIDE.md`

대표님, Phase 2 테스트 완료 후 다음 세션에서 뵙겠습니다! 😊
