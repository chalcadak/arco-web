# 🎨 ARCO 디자인 시스템 사용 가이드

## 📦 설치 및 Import

### 기본 Import
```typescript
import { colors, typography, spacing, components } from '@/lib/design-system';
```

### 헬퍼 함수 Import
```typescript
import { cn, responsive } from '@/lib/design-system';
```

---

## 🎨 사용 방법

### 1️⃣ **색상 사용하기**

#### Tailwind CSS 클래스로 사용 (추천)
```tsx
<div className="bg-white text-foreground border-neutral-200">
  내용
</div>
```

#### 인라인 스타일로 사용
```tsx
import { colors } from '@/lib/design-system';

<div style={{ 
  backgroundColor: colors.background.DEFAULT,
  color: colors.foreground.DEFAULT 
}}>
  내용
</div>
```

---

### 2️⃣ **타이포그래피 사용하기**

```tsx
// Tailwind 클래스 사용 (추천)
<h1 className="text-4xl font-bold">제목</h1>
<p className="text-base font-normal">본문</p>
<small className="text-sm text-muted-foreground">보조 정보</small>

// 디자인 토큰 사용
import { typography } from '@/lib/design-system';

<h1 style={{ 
  fontSize: typography.fontSize['4xl'],
  fontWeight: typography.fontWeight.bold 
}}>
  제목
</h1>
```

---

### 3️⃣ **간격 사용하기**

```tsx
// Tailwind 클래스 (추천)
<div className="p-6 mb-8 space-y-4">
  내용
</div>

// 디자인 토큰
import { spacing } from '@/lib/design-system';

<div style={{ 
  padding: spacing[6],
  marginBottom: spacing[8]
}}>
  내용
</div>
```

---

### 4️⃣ **컴포넌트 만들기**

#### Button 컴포넌트 예시
```tsx
import { cn } from '@/lib/design-system';

function Button({ variant = 'primary', children, ...props }) {
  return (
    <button
      className={cn(
        // 기본 스타일
        'inline-flex items-center justify-center',
        'h-12 px-8',
        'rounded-md font-medium',
        'transition-colors',
        
        // Variant별 스타일
        variant === 'primary' && 'bg-foreground text-background hover:bg-foreground/90',
        variant === 'secondary' && 'border border-input hover:bg-accent',
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### Card 컴포넌트 예시
```tsx
import { cn } from '@/lib/design-system';

function Card({ children, hover = true, className }) {
  return (
    <div
      className={cn(
        'bg-white border border-neutral-200 rounded-lg p-6',
        hover && 'transition-shadow hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}
```

---

### 5️⃣ **반응형 디자인**

```tsx
// Tailwind 반응형 클래스 사용
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-4 
  gap-4 
  md:gap-6
">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 4열 */}
</div>

// Typography 반응형
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  반응형 제목
</h1>

// 간격 반응형
<section className="py-12 md:py-16 lg:py-20">
  반응형 섹션
</section>
```

---

## 📚 디자인 토큰 레퍼런스

### Colors
```typescript
colors.primary.DEFAULT          // #171717 - Premium black
colors.primary.foreground       // #FAFAFA - Almost white
colors.background.DEFAULT       // #FFFFFF - Pure white
colors.background.muted         // #F5F5F5 - Light gray
colors.foreground.DEFAULT       // #171717 - Almost black
colors.foreground.muted         // #757575 - Gray
colors.border.DEFAULT           // #E5E5E5 - Border gray
colors.status.destructive       // #F56565 - Red
colors.status.success           // #22C55E - Green
```

### Typography Sizes
```typescript
typography.fontSize.xs          // 12px
typography.fontSize.sm          // 14px
typography.fontSize.base        // 16px (기본)
typography.fontSize.lg          // 18px
typography.fontSize.xl          // 20px
typography.fontSize['2xl']      // 24px
typography.fontSize['3xl']      // 30px
typography.fontSize['4xl']      // 36px
```

### Font Weights
```typescript
typography.fontWeight.normal    // 400
typography.fontWeight.medium    // 500
typography.fontWeight.semibold  // 600
typography.fontWeight.bold      // 700
```

### Spacing
```typescript
spacing[0]   // 0px
spacing[1]   // 4px
spacing[2]   // 8px
spacing[4]   // 16px
spacing[6]   // 24px
spacing[8]   // 32px
spacing[12]  // 48px
spacing[16]  // 64px
spacing[20]  // 80px
```

---

## 🛠️ 헬퍼 함수

### cn() - 클래스명 조합
```tsx
import { cn } from '@/lib/design-system';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  isDisabled && 'disabled-class',
  customClassName
)}>
  내용
</div>
```

### responsive() - 반응형 값
```tsx
import { responsive } from '@/lib/design-system';

const padding = responsive('1rem', '2rem', '3rem');
// { mobile: '1rem', tablet: '2rem', desktop: '3rem' }
```

---

## 💡 실전 예시

### Product Card
```tsx
import { cn } from '@/lib/design-system';

export function ProductCard({ image, name, price }) {
  return (
    <div className="
      border border-neutral-200 
      rounded-lg 
      bg-white 
      overflow-hidden
      transition-shadow 
      hover:shadow-lg
    ">
      <img 
        src={image} 
        alt={name}
        className="w-full aspect-square object-cover"
      />
      
      <div className="p-4">
        <h3 className="font-semibold mb-2">{name}</h3>
        <p className="font-bold text-lg">₩{price.toLocaleString()}</p>
        
        <button className="
          mt-4 w-full
          h-12 
          bg-foreground text-background 
          rounded-md 
          font-medium
          transition-colors 
          hover:bg-foreground/90
        ">
          장바구니에 담기
        </button>
      </div>
    </div>
  );
}
```

### Hero Section
```tsx
export function HeroSection() {
  return (
    <section className="
      bg-gradient-to-b from-neutral-50 to-white
      py-20 md:py-32
    ">
      <div className="container mx-auto px-4 text-center">
        <h1 className="
          text-4xl md:text-5xl lg:text-6xl 
          font-bold 
          tracking-tight 
          mb-6
        ">
          ARCO
        </h1>
        
        <p className="
          text-xl md:text-2xl 
          text-muted-foreground 
          mb-8
        ">
          프리미엄 반려견 패션 브랜드
        </p>
        
        <div className="flex gap-4 justify-center">
          <button className="
            h-12 px-8 
            bg-foreground text-background 
            rounded-md 
            font-medium
            transition-colors 
            hover:bg-foreground/90
          ">
            상품 둘러보기
          </button>
          
          <button className="
            h-12 px-8 
            border border-input 
            rounded-md 
            font-medium
            transition-colors 
            hover:bg-accent
          ">
            촬영 예약하기
          </button>
        </div>
      </div>
    </section>
  );
}
```

---

## 📖 추가 리소스

- **전체 가이드라인**: `/DESIGN_GUIDELINES.md`
- **예시 컴포넌트**: `/src/lib/design-system-examples.tsx`
- **Tailwind 문서**: https://tailwindcss.com/

---

## ⚠️ 주의사항

1. **다크모드 없음**: ARCO는 라이트 테마로 통일되었습니다.
2. **Tailwind 우선**: 가능하면 Tailwind 클래스를 사용하세요 (성능 최적화).
3. **일관성 유지**: 정의된 디자인 토큰만 사용하세요.
4. **반응형 필수**: 모든 컴포넌트는 반응형으로 만드세요.

---

## 🎯 빠른 참고

### 자주 사용하는 패턴

```tsx
// 섹션
<section className="py-16">
  <div className="container mx-auto px-4">
    내용
  </div>
</section>

// 카드
<div className="border border-neutral-200 rounded-lg p-6 bg-white hover:shadow-lg">

// Primary 버튼
<button className="h-12 px-8 bg-foreground text-background rounded-md hover:bg-foreground/90">

// Secondary 버튼
<button className="h-12 px-8 border border-input rounded-md hover:bg-accent">

// 제목
<h1 className="text-4xl font-bold tracking-tight">

// 본문
<p className="text-base leading-normal">

// 보조 텍스트
<p className="text-sm text-muted-foreground">

// Grid (반응형)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

**Last Updated**: 2026-01-13  
**Version**: 1.0
