/**
 * Typography Components
 * 
 * design-system.ts를 기반으로 한 일관된 타이포그래피
 */

import { cn } from '@/lib/design-system';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function H1({ children, className, as }: HeadingProps) {
  const Component = as || 'h1';
  return (
    <Component className={cn('text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight', className)}>
      {children}
    </Component>
  );
}

export function H2({ children, className, as }: HeadingProps) {
  const Component = as || 'h2';
  return (
    <Component className={cn('text-3xl md:text-4xl font-bold tracking-tight', className)}>
      {children}
    </Component>
  );
}

export function H3({ children, className, as }: HeadingProps) {
  const Component = as || 'h3';
  return (
    <Component className={cn('text-2xl md:text-3xl font-semibold', className)}>
      {children}
    </Component>
  );
}

export function H4({ children, className, as }: HeadingProps) {
  const Component = as || 'h4';
  return (
    <Component className={cn('text-xl md:text-2xl font-semibold', className)}>
      {children}
    </Component>
  );
}

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export function Text({ children, className }: TextProps) {
  return <p className={cn('text-base leading-normal', className)}>{children}</p>;
}

export function TextLarge({ children, className }: TextProps) {
  return <p className={cn('text-lg md:text-xl leading-relaxed', className)}>{children}</p>;
}

export function TextMuted({ children, className }: TextProps) {
  return <p className={cn('text-sm md:text-base text-muted-foreground', className)}>{children}</p>;
}

export function TextSmall({ children, className }: TextProps) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>;
}
