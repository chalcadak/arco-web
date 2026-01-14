# 🎬 ARCO 애니메이션 가이드

## 📦 개요

ARCO는 **Framer Motion**을 사용하여 부드럽고 일관된 애니메이션을 제공합니다.

## 🎨 애니메이션 시스템

### 1. 페이지 전환 애니메이션

#### Container/Section 애니메이션
```tsx
import { Container, Section } from '@/components/ui/container';

// 페이지 전환 시 fade in up
<Container animate>
  내용
</Container>

// 섹션 전환
<Section animate>
  내용
</Section>
```

### 2. 버튼 애니메이션

모든 Button 컴포넌트는 자동으로 hover/tap 애니메이션이 적용됩니다:

```tsx
import { Button } from '@/components/ui/button';

// 자동으로 hover scale 및 tap 효과
<Button variant="primary">클릭</Button>
```

**효과**:
- Hover: 1.02배 확대
- Tap: 0.98배 축소

### 3. 카드 애니메이션

Card 컴포넌트는 hover 시 lift 효과가 적용됩니다:

```tsx
import { Card } from '@/components/ui/card';

// 기본: hover 애니메이션 활성화
<Card>내용</Card>

// hover 비활성화
<Card hover={false}>내용</Card>

// 애니메이션 비활성화
<Card animate={false}>내용</Card>
```

**효과**:
- Hover: 4px 위로 lift
- Shadow 전환

## 🔧 커스텀 애니메이션

### animations.ts 사용하기

```tsx
'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

function MyComponent() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      콘텐츠
    </motion.div>
  );
}
```

### 사용 가능한 Variants

#### 페이지 전환
- `fadeIn` - 페이드 인
- `fadeInUp` - 페이드 인 + 위로 슬라이드
- `fadeInDown` - 페이드 인 + 아래로 슬라이드
- `scaleIn` - 스케일 페이드 인

#### 리스트 애니메이션
- `staggerContainer` - 자식 요소 순차 애니메이션
- `staggerContainerFast` - 빠른 순차 애니메이션
- `staggerItem` - 리스트 아이템 애니메이션

#### 인터랙션
- `buttonHover` - 버튼 hover 스케일
- `buttonTap` - 버튼 tap 스케일
- `cardHover` - 카드 hover lift
- `cardTap` - 카드 tap

### 예제: 상품 그리드 애니메이션

```tsx
'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

function ProductGrid({ products }) {
  return (
    <motion.div
      className="grid grid-cols-3 gap-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={staggerItem}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

## ⚙️ Transition 설정

### 사용 가능한 Transitions

```tsx
import { 
  springTransition,    // 스프링 효과
  smoothTransition,    // 부드러운 easing
  fastTransition       // 빠른 전환
} from '@/lib/animations';

<motion.div
  animate={{ x: 100 }}
  transition={smoothTransition}
/>
```

## 🎯 성능 최적화

### 1. GPU 가속 속성만 사용
- `transform` (x, y, scale, rotate)
- `opacity`

### 2. layout 속성 피하기
```tsx
// ❌ 피하기
<motion.div animate={{ width: 100 }} />

// ✅ 권장
<motion.div animate={{ scaleX: 1 }} />
```

### 3. willChange 사용
```tsx
<motion.div style={{ willChange: 'transform' }}>
  내용
</motion.div>
```

## 📝 Best Practices

1. **일관성**: 같은 유형의 요소는 같은 애니메이션 사용
2. **속도**: 너무 느리거나 빠르지 않게 (0.2s-0.4s 권장)
3. **Easing**: 자연스러운 cubic-bezier 사용
4. **목적**: 애니메이션은 사용자 피드백이나 콘텐츠 흐름 개선을 위해 사용
5. **성능**: 너무 많은 동시 애니메이션 피하기

## 🚀 추가 리소스

- [Framer Motion 공식 문서](https://www.framer.com/motion/)
- [Animation Examples](https://www.framer.com/motion/examples/)
