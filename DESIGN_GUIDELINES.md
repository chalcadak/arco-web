# 🎨 ARCO 디자인 가이드라인

> **버전**: 1.0  
> **작성일**: 2026-01-13  
> **브랜드**: ARCO - Premium Dog Fashion  
> **디자인 철학**: 밝고, 깔끔한, 프리미엄 패션 브랜드

---

## 📋 목차

1. [디자인 철학](#1-디자인-철학)
2. [컬러 시스템](#2-컬러-시스템)
3. [타이포그래피](#3-타이포그래피)
4. [간격 시스템](#4-간격-시스템)
5. [컴포넌트 스타일](#5-컴포넌트-스타일)
6. [레이아웃](#6-레이아웃)
7. [이미지 가이드라인](#7-이미지-가이드라인)
8. [애니메이션](#8-애니메이션)
9. [반응형 디자인](#9-반응형-디자인)
10. [접근성](#10-접근성)

---

## 1. 디자인 철학

### 1.1 브랜드 정체성

**ARCO는 프리미엄 반려견 패션 브랜드입니다.**

- 🌟 **프리미엄**: 고급스럽고 세련된 느낌
- 🐕 **반려견 중심**: 따뜻하고 친근한 느낌
- 📸 **패션 중심**: 시각적으로 아름다운 디자인

### 1.2 핵심 원칙

1. **심플함 (Simplicity)**
   - 불필요한 요소 제거
   - 깔끔한 레이아웃
   - 명확한 정보 구조

2. **일관성 (Consistency)**
   - 동일한 디자인 패턴 반복
   - 예측 가능한 인터랙션
   - 통일된 스타일

3. **가독성 (Readability)**
   - 충분한 대비
   - 적절한 폰트 크기
   - 명확한 시각적 계층

4. **반응성 (Responsiveness)**
   - 모든 기기에서 동일한 경험
   - 터치 친화적 인터페이스

---

## 2. 컬러 시스템

### 2.1 Primary Colors (주요 색상)

#### **Black (검정)**
```css
/* Primary - Premium Black */
--primary: hsl(0, 0%, 9%)           /* #171717 */
--primary-foreground: hsl(0, 0%, 98%)  /* #FAFAFA */
```

**용도:**
- CTA 버튼 배경
- 주요 텍스트
- 강조할 요소
- 아이콘

**예시:**
- "쇼핑하기" 버튼
- 제목 텍스트
- 활성화된 네비게이션

---

### 2.2 Neutral Colors (중립 색상)

#### **White & Gray (흰색과 회색)**
```css
/* Background */
--background: hsl(0, 0%, 100%)       /* #FFFFFF - 순백색 */
--foreground: hsl(0, 0%, 9%)         /* #171717 - 거의 검정 */

/* Card */
--card: hsl(0, 0%, 98%)              /* #FAFAFA - 약간 오프화이트 */
--card-foreground: hsl(0, 0%, 9%)

/* Muted (보조 텍스트, 배경) */
--muted: hsl(240, 4.8%, 97%)         /* #F5F5F5 */
--muted-foreground: hsl(240, 3.8%, 46.1%)  /* #757575 */

/* Border */
--border: hsl(240, 5.9%, 90%)        /* #E5E5E5 */
--input: hsl(240, 5.9%, 90%)
```

**용도:**
- 페이지 배경: `--background` (순백색)
- 카드/섹션: `--card` (약간 회색빛)
- 보조 텍스트: `--muted-foreground`
- 구분선: `--border`

---

### 2.3 Accent Colors (강조 색상)

#### **Secondary (보조 색상)**
```css
--secondary: hsl(240, 4.8%, 95.9%)   /* 연한 회색 배경 */
--secondary-foreground: hsl(240, 5.9%, 10%)

--accent: hsl(210, 40%, 96.1%)       /* 연한 블루 그레이 */
--accent-foreground: hsl(222.2, 47.4%, 11.2%)
```

**용도:**
- Hover 상태 배경
- 보조 버튼
- 알림 배지

---

### 2.4 Status Colors (상태 색상)

```css
/* Destructive (경고/삭제) */
--destructive: hsl(0, 84.2%, 60.2%)  /* #F56565 - 빨강 */
--destructive-foreground: hsl(0, 0%, 98%)

/* Success (성공) */
--success: hsl(142, 76%, 36%)        /* #22C55E - 초록 */

/* Warning (경고) */
--warning: hsl(45, 93%, 47%)         /* #F59E0B - 노랑 */

/* Info (정보) */
--info: hsl(210, 92%, 45%)           /* #0EA5E9 - 파랑 */
```

**용도:**
- 에러 메시지: `--destructive`
- 성공 알림: `--success`
- 경고: `--warning`
- 정보: `--info`

---

### 2.5 컬러 사용 예시

#### **버튼**
```tsx
// Primary Button (강조)
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  상품 둘러보기
</button>

// Secondary Button (보조)
<button className="border border-input hover:bg-accent">
  촬영 예약하기
</button>

// Destructive Button (삭제)
<button className="bg-destructive text-destructive-foreground">
  삭제하기
</button>
```

#### **텍스트**
```tsx
// 제목
<h1 className="text-foreground">ARCO</h1>

// 보조 텍스트
<p className="text-muted-foreground">프리미엄 반려견 패션 브랜드</p>

// 링크
<a className="text-foreground hover:text-primary underline">자세히 보기</a>
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

#### **현재 사용 중인 폰트**
```css
/* System Font Stack */
--font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
```

#### **권장 폰트 (한글 최적화)**
```css
/* 옵션 1: Pretendard (추천) */
--font-sans: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", sans-serif;

/* 옵션 2: Noto Sans KR */
--font-sans: "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", sans-serif;

/* 옵션 3: SUIT Variable */
--font-sans: "SUIT Variable", SUIT, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", sans-serif;
```

**추천:** **Pretendard Variable** (가변 폰트, 경량, 가독성 우수)

---

### 3.2 폰트 크기

```css
/* Display (대형 제목) */
--text-display: 4rem;      /* 64px */
--text-display-sm: 3rem;   /* 48px */

/* Heading (제목) */
--text-h1: 2.25rem;        /* 36px */
--text-h2: 1.875rem;       /* 30px */
--text-h3: 1.5rem;         /* 24px */
--text-h4: 1.25rem;        /* 20px */
--text-h5: 1.125rem;       /* 18px */

/* Body (본문) */
--text-base: 1rem;         /* 16px - 기본 */
--text-lg: 1.125rem;       /* 18px */
--text-sm: 0.875rem;       /* 14px */
--text-xs: 0.75rem;        /* 12px */
```

**Tailwind CSS 클래스:**
```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl">ARCO</h1>
<h2 className="text-3xl md:text-4xl">상품 목록</h2>
<p className="text-base">본문 텍스트</p>
<small className="text-sm text-muted-foreground">보조 정보</small>
```

---

### 3.3 폰트 굵기 (Font Weight)

```css
/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

**사용 가이드:**
- **Light (300)**: 거의 사용하지 않음
- **Normal (400)**: 일반 본문 텍스트
- **Medium (500)**: 강조 텍스트, 레이블
- **Semibold (600)**: 부제목, 중요 정보
- **Bold (700)**: 제목, 강한 강조
- **Extrabold (800)**: 대형 제목 (ARCO 로고)

```tsx
<h1 className="font-bold">ARCO</h1>
<h2 className="font-semibold">판매상품</h2>
<p className="font-normal">일상에서 입힐 수 있는 반려견 의류</p>
<label className="font-medium">상품명</label>
```

---

### 3.4 행간 (Line Height)

```css
/* Line Heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

**사용 가이드:**
- **Tight (1.25)**: 대형 제목
- **Normal (1.5)**: 본문 텍스트
- **Relaxed (1.625)**: 긴 본문, 설명

```tsx
<h1 className="leading-tight">ARCO</h1>
<p className="leading-normal">본문 텍스트는 충분한 행간이 필요합니다.</p>
<article className="leading-relaxed">긴 설명문...</article>
```

---

### 3.5 자간 (Letter Spacing)

```css
/* Letter Spacing */
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

**사용 가이드:**
- **Tight (-0.025em)**: 제목, 브랜드명 (ARCO)
- **Normal (0)**: 일반 텍스트
- **Wide (0.025em)**: 대문자, 태그

```tsx
<h1 className="tracking-tight">ARCO</h1>
<span className="tracking-wide uppercase">New Arrival</span>
```

---

## 4. 간격 시스템

### 4.1 Spacing Scale (간격 단위)

```css
/* Tailwind Default Spacing Scale */
0   = 0px
1   = 0.25rem  = 4px
2   = 0.5rem   = 8px
3   = 0.75rem  = 12px
4   = 1rem     = 16px
5   = 1.25rem  = 20px
6   = 1.5rem   = 24px
8   = 2rem     = 32px
10  = 2.5rem   = 40px
12  = 3rem     = 48px
16  = 4rem     = 64px
20  = 5rem     = 80px
24  = 6rem     = 96px
32  = 8rem     = 128px
```

### 4.2 Padding (내부 여백)

**작은 요소:**
```tsx
<button className="px-4 py-2">버튼</button>   // 16px 8px
<input className="px-3 py-2">                 // 12px 8px
<span className="px-2 py-1">태그</span>       // 8px 4px
```

**중간 요소:**
```tsx
<div className="p-6">카드</div>              // 24px
<section className="py-12 px-4">섹션</section>  // 48px 16px
```

**큰 요소:**
```tsx
<main className="py-16">메인 콘텐츠</main>    // 64px
<section className="py-20">히어로 섹션</section>  // 80px
```

### 4.3 Margin (외부 여백)

**요소 간 간격:**
```tsx
<h1 className="mb-4">제목</h1>                // 16px
<p className="mb-6">본문</p>                  // 24px
<section className="mb-12">섹션</section>     // 48px
```

**섹션 간 간격:**
```tsx
<section className="mb-16">섹션 1</section>   // 64px
<section className="mt-20">섹션 2</section>   // 80px
```

### 4.4 Gap (Grid/Flex 간격)

```tsx
<div className="grid grid-cols-4 gap-4">     // 16px
<div className="flex gap-6">                 // 24px
<div className="space-y-8">                  // 32px (flex-col)
```

---

## 5. 컴포넌트 스타일

### 5.1 버튼 (Buttons)

#### **Primary Button**
```tsx
<button className="
  inline-flex items-center justify-center
  h-12 px-8
  bg-foreground text-background
  rounded-md
  font-medium
  transition-colors
  hover:bg-foreground/90
  active:bg-foreground/95
">
  상품 둘러보기
</button>
```

#### **Secondary Button**
```tsx
<button className="
  inline-flex items-center justify-center
  h-12 px-8
  border border-input
  rounded-md
  font-medium
  transition-colors
  hover:bg-accent hover:text-accent-foreground
">
  촬영 예약하기
</button>
```

#### **Outline Button**
```tsx
<button className="
  inline-flex items-center justify-center
  h-10 px-6
  border-2 border-foreground
  rounded-md
  font-medium
  transition-colors
  hover:bg-foreground hover:text-background
">
  자세히 보기
</button>
```

---

### 5.2 카드 (Cards)

#### **Product Card**
```tsx
<div className="
  border border-neutral-200
  rounded-lg
  bg-white
  overflow-hidden
  transition-shadow
  hover:shadow-lg
">
  <img src="..." alt="..." className="w-full aspect-square object-cover" />
  <div className="p-4">
    <h3 className="font-semibold mb-2">상품명</h3>
    <p className="text-muted-foreground text-sm mb-3">설명</p>
    <p className="font-bold text-lg">₩50,000</p>
  </div>
</div>
```

#### **Info Card**
```tsx
<div className="
  border border-neutral-200
  rounded-lg
  p-6
  bg-white
  hover:shadow-lg
  transition-shadow
">
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
    {/* Icon */}
  </div>
  <h3 className="text-xl font-semibold mb-2">제목</h3>
  <p className="text-muted-foreground">설명 텍스트...</p>
</div>
```

---

### 5.3 입력 필드 (Input Fields)

```tsx
<input
  type="text"
  className="
    flex h-10 w-full
    rounded-md
    border border-input
    bg-background
    px-3 py-2
    text-sm
    ring-offset-background
    placeholder:text-muted-foreground
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
  placeholder="상품명 입력"
/>
```

---

### 5.4 배지 (Badges)

```tsx
<!-- Primary Badge -->
<span className="
  inline-flex items-center
  px-3 py-1
  bg-primary text-primary-foreground
  text-xs font-medium
  rounded-full
">
  베스트
</span>

<!-- Secondary Badge -->
<span className="
  inline-flex items-center
  px-3 py-1
  bg-neutral-100
  text-sm
  rounded-full
">
  아우터
</span>
```

---

## 6. 레이아웃

### 6.1 Container (컨테이너)

```css
/* Max Width */
.container {
  max-width: 1280px;  /* lg */
  margin: 0 auto;
  padding: 0 1rem;    /* 16px */
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem;  /* 32px */
  }
}
```

**Tailwind CSS:**
```tsx
<div className="container mx-auto px-4 md:px-8">
  내용
</div>
```

---

### 6.2 Grid System

#### **Product Grid**
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  {/* Product Cards */}
</div>
```

#### **Feature Grid**
```tsx
<div className="grid gap-8 md:grid-cols-3">
  {/* Feature Cards */}
</div>
```

---

### 6.3 Sections (섹션)

```tsx
<!-- Hero Section -->
<section className="py-20 md:py-32">
  <div className="container mx-auto px-4 text-center">
    {/* Hero Content */}
  </div>
</section>

<!-- Content Section -->
<section className="py-16">
  <div className="container mx-auto px-4">
    {/* Content */}
  </div>
</section>

<!-- CTA Section -->
<section className="bg-neutral-50 py-20">
  <div className="container mx-auto px-4 text-center">
    {/* CTA Content */}
  </div>
</section>
```

---

## 7. 이미지 가이드라인

### 7.1 이미지 비율

```css
/* Product Images */
aspect-ratio: 1 / 1        /* 정사각형 (500×500) */

/* Photoshoot Images */
aspect-ratio: 4 / 5        /* 세로 (800×1000) */

/* Hero Images */
aspect-ratio: 16 / 9       /* 가로 (1920×1080) */

/* Thumbnails */
aspect-ratio: 1 / 1        /* 정사각형 (400×400) */
```

**Tailwind CSS:**
```tsx
<img src="..." className="aspect-square object-cover" />
<img src="..." className="aspect-[4/5] object-cover" />
<img src="..." className="aspect-video object-cover" />
```

---

### 7.2 이미지 크기

```
원본 이미지:
- Width: 2000px 이하
- Format: JPEG/WebP
- Quality: 90%

썸네일:
- Width: 400px
- Format: JPEG/WebP
- Quality: 80%

갤러리 이미지 (납품):
- Width: 4000px (고해상도)
- Format: JPEG
- Quality: 95%
```

---

### 7.3 이미지 로딩

```tsx
<!-- Lazy Loading -->
<img
  src="..."
  alt="..."
  loading="lazy"
  className="..."
/>

<!-- Next.js Image Component (추천) -->
<Image
  src="..."
  alt="..."
  width={500}
  height={500}
  className="..."
  priority={false}  // Hero 이미지는 true
/>
```

---

## 8. 애니메이션

### 8.1 Transition (전환)

```css
/* 기본 전환 (글로벌) */
* {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Tailwind CSS:**
```tsx
<button className="transition-colors hover:bg-accent">
<div className="transition-shadow hover:shadow-lg">
<a className="transition-transform hover:scale-105">
```

---

### 8.2 Duration (지속 시간)

```css
--duration-fast: 150ms     /* 빠른 전환 */
--duration-normal: 300ms   /* 일반 전환 */
--duration-slow: 500ms     /* 느린 전환 */
```

```tsx
<div className="transition-all duration-150">  // 150ms
<div className="transition-all duration-300">  // 300ms
<div className="transition-all duration-500">  // 500ms
```

---

### 8.3 Easing (이징)

```css
--ease-linear: linear
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

```tsx
<div className="transition ease-in-out">
<div className="transition ease-out">
```

---

### 8.4 Hover Effects (호버 효과)

#### **Card Hover**
```tsx
<div className="
  transition-all
  hover:shadow-lg
  hover:-translate-y-1
">
```

#### **Button Hover**
```tsx
<button className="
  transition-colors
  hover:bg-foreground/90
  active:scale-95
">
```

#### **Image Hover**
```tsx
<div className="overflow-hidden">
  <img
    src="..."
    className="
      transition-transform
      hover:scale-110
    "
  />
</div>
```

---

## 9. 반응형 디자인

### 9.1 Breakpoints (중단점)

```css
/* Tailwind CSS Breakpoints */
sm:  640px   /* 모바일 가로 */
md:  768px   /* 태블릿 */
lg:  1024px  /* 데스크톱 */
xl:  1280px  /* 대형 데스크톱 */
2xl: 1536px  /* 초대형 화면 */
```

---

### 9.2 반응형 레이아웃

```tsx
<!-- 모바일: 1열, 태블릿: 2열, 데스크톱: 4열 -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

<!-- 모바일: 전체, 데스크톱: 절반 -->
<div className="w-full lg:w-1/2">

<!-- 모바일: 숨김, 데스크톱: 표시 -->
<nav className="hidden md:flex">

<!-- 모바일: 표시, 데스크톱: 숨김 -->
<button className="md:hidden">
```

---

### 9.3 반응형 타이포그래피

```tsx
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  제목
</h1>

<p className="text-sm md:text-base lg:text-lg">
  본문
</p>
```

---

### 9.4 반응형 간격

```tsx
<section className="py-12 md:py-16 lg:py-20">
<div className="px-4 md:px-8 lg:px-12">
<div className="gap-4 md:gap-6 lg:gap-8">
```

---

## 10. 접근성

### 10.1 색상 대비

```
WCAG AA 기준:
- 일반 텍스트: 4.5:1 이상
- 큰 텍스트 (18px+): 3:1 이상
- UI 요소: 3:1 이상
```

**현재 사용 중인 색상 대비:**
- 검정 (#171717) on 흰색 (#FFFFFF): **14.05:1** ✅
- 회색 (#757575) on 흰색 (#FFFFFF): **4.54:1** ✅

---

### 10.2 포커스 상태

```tsx
<button className="
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2
">
```

---

### 10.3 시맨틱 HTML

```tsx
<!-- 좋은 예 -->
<header>
  <nav>
    <ul>
      <li><a href="/products">판매상품</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <h1>제목</h1>
    <p>내용</p>
  </section>
</main>

<footer>
  푸터 내용
</footer>
```

---

### 10.4 Alt Text (대체 텍스트)

```tsx
<!-- 좋은 예 -->
<img src="..." alt="블루 튜튜 드레스 - 프리미엄 반려견 의상" />

<!-- 나쁜 예 -->
<img src="..." alt="이미지" />
<img src="..." alt="" />  // 장식용 이미지가 아닌 경우
```

---

## 11. 다크 모드

### ⚠️ **다크 모드는 사용하지 않습니다**

ARCO는 **라이트 테마로 통일**되었습니다.

**이유:**
1. 📸 상품 사진이 더 잘 보임
2. 🐕 반려견 사진의 디테일 강조
3. 🌟 프리미엄 패션 브랜드 대부분이 라이트 테마 사용
4. 🎨 깔끔하고 밝은 느낌

---

## 12. 코드 스타일 규칙

### 12.1 Tailwind CSS 클래스 순서

```tsx
// 추천 순서:
// 1. 레이아웃 (flex, grid, display)
// 2. 위치 (position, top, left)
// 3. 크기 (width, height)
// 4. 간격 (margin, padding)
// 5. 타이포그래피 (font, text)
// 6. 색상 (bg, text, border)
// 7. 시각 효과 (shadow, rounded)
// 8. 전환/애니메이션 (transition, transform)
// 9. 상태 (hover, focus, active)

<button className="
  flex items-center justify-center
  h-12 px-8
  font-medium
  bg-foreground text-background
  rounded-md shadow-sm
  transition-colors
  hover:bg-foreground/90
">
```

---

### 12.2 컴포넌트 네이밍

```tsx
// Pascal Case for Components
<ProductCard />
<PhotoshootLook />
<AdminLayout />

// kebab-case for CSS classes
.product-card { }
.photoshoot-look { }

// camelCase for JavaScript
const handleClick = () => {}
const isLoading = false
```

---

## 13. 참고 자료

### 13.1 외부 리소스

**컬러 도구:**
- [Coolors.co](https://coolors.co/) - 색상 팔레트 생성
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - 색상 대비 확인

**타이포그래피:**
- [Pretendard](https://github.com/orioncactus/pretendard) - 한글 폰트
- [Google Fonts](https://fonts.google.com/) - 무료 폰트

**디자인 시스템:**
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI 컴포넌트

---

## 14. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-01-13 | 초기 디자인 가이드라인 작성 |

---

## 15. 질문 사항

대표님께 확인이 필요한 사항들:

1. **폰트 선택**
   - Pretendard Variable (추천)
   - Noto Sans KR
   - SUIT Variable
   - 기타 원하시는 폰트?

2. **브랜드 컬러 추가**
   - 현재는 Black & White 위주
   - 포인트 컬러 추가 필요? (예: 골드, 네이비)

3. **로고**
   - 텍스트만? "ARCO"
   - 아이콘 + 텍스트?
   - 로고 파일 준비되었나요?

4. **이미지 스타일**
   - 상품 사진 컨셉? (스튜디오, 실사용, 모델 착용)
   - 필터/보정 스타일?

---

**문서 작성**: GenSpark AI Designer  
**최종 수정**: 2026-01-13  
**버전**: 1.0
