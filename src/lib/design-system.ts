/**
 * ARCO Design System
 * 
 * 프리미엄 반려견 패션 브랜드 디자인 시스템
 * 실제 컴포넌트에서 import하여 사용
 * 
 * @example
 * import { colors, spacing, typography } from '@/lib/design-system'
 */

// ============================================================================
// Colors
// ============================================================================

export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: 'hsl(0, 0%, 9%)',      // #171717 - Premium black
    foreground: 'hsl(0, 0%, 98%)',  // #FAFAFA - Almost white
  },
  
  // Background Colors
  background: {
    DEFAULT: 'hsl(0, 0%, 100%)',    // #FFFFFF - Pure white
    muted: 'hsl(240, 4.8%, 97%)',   // #F5F5F5 - Light gray
    card: 'hsl(0, 0%, 98%)',        // #FAFAFA - Off-white
  },
  
  // Text Colors
  foreground: {
    DEFAULT: 'hsl(0, 0%, 9%)',           // #171717 - Almost black
    muted: 'hsl(240, 3.8%, 46.1%)',      // #757575 - Gray
  },
  
  // Border Colors
  border: {
    DEFAULT: 'hsl(240, 5.9%, 90%)',  // #E5E5E5 - Light gray
    input: 'hsl(240, 5.9%, 90%)',
  },
  
  // Status Colors
  status: {
    destructive: 'hsl(0, 84.2%, 60.2%)',  // #F56565 - Red
    success: 'hsl(142, 76%, 36%)',        // #22C55E - Green
    warning: 'hsl(45, 93%, 47%)',         // #F59E0B - Yellow
    info: 'hsl(210, 92%, 45%)',           // #0EA5E9 - Blue
  },
  
  // Accent Colors
  accent: {
    DEFAULT: 'hsl(210, 40%, 96.1%)',
    foreground: 'hsl(222.2, 47.4%, 11.2%)',
  },
} as const;

// ============================================================================
// Typography
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px - Default
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '4rem',      // 64px
  },
  
  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// Spacing
// ============================================================================

export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

// ============================================================================
// Border Radius
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

// ============================================================================
// Shadows
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  none: 'none',
} as const;

// ============================================================================
// Transitions
// ============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  timing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ============================================================================
// Breakpoints
// ============================================================================

export const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large
} as const;

// ============================================================================
// Container
// ============================================================================

export const container = {
  maxWidth: '1280px',
  padding: {
    mobile: '1rem',    // 16px
    desktop: '2rem',   // 32px
  },
} as const;

// ============================================================================
// Component Variants
// ============================================================================

export const components = {
  button: {
    // Height
    height: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
    },
    
    // Padding
    padding: {
      sm: '0.75rem 1.5rem',  // 12px 24px
      md: '0.5rem 2rem',     // 8px 32px
      lg: '0.5rem 2rem',     // 8px 32px
    },
    
    // Variants
    variants: {
      primary: {
        bg: colors.primary.DEFAULT,
        text: colors.primary.foreground,
        hover: 'hsl(0, 0%, 20%)',
      },
      secondary: {
        bg: 'transparent',
        text: colors.foreground.DEFAULT,
        border: colors.border.DEFAULT,
        hover: colors.background.muted,
      },
      outline: {
        bg: 'transparent',
        text: colors.foreground.DEFAULT,
        border: colors.foreground.DEFAULT,
        hover: colors.foreground.DEFAULT,
        hoverText: colors.primary.foreground,
      },
      destructive: {
        bg: colors.status.destructive,
        text: colors.primary.foreground,
        hover: 'hsl(0, 84.2%, 50%)',
      },
    },
  },
  
  card: {
    bg: colors.background.card,
    border: colors.border.DEFAULT,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    shadow: shadows.DEFAULT,
    hoverShadow: shadows.lg,
  },
  
  input: {
    height: '2.5rem',  // 40px
    padding: '0.5rem 0.75rem',  // 8px 12px
    border: colors.border.DEFAULT,
    borderRadius: borderRadius.DEFAULT,
    focusRing: colors.primary.DEFAULT,
  },
  
  badge: {
    padding: '0.25rem 0.75rem',  // 4px 12px
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * CN (Class Names) helper
 * Tailwind 클래스명을 조건부로 결합
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get responsive value
 * 반응형 값을 쉽게 가져오기
 */
export function responsive<T>(mobile: T, tablet?: T, desktop?: T) {
  return {
    mobile,
    tablet: tablet ?? mobile,
    desktop: desktop ?? tablet ?? mobile,
  };
}

// ============================================================================
// Type Exports
// ============================================================================

export type Color = keyof typeof colors;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
export type Breakpoint = keyof typeof breakpoints;
