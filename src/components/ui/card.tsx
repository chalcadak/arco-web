/**
 * Card Component
 * 
 * design-system.ts를 기반으로 한 재사용 가능한 카드 컴포넌트
 * Framer Motion으로 hover 애니메이션 추가
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/design-system';
import { cardHover } from '@/lib/animations';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}

export function Card({ children, className, hover = true, animate = true }: CardProps) {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      {...(animate && hover ? { whileHover: cardHover } : {})}
      className={cn(
        'bg-white',
        'border border-neutral-200',
        'rounded-lg',
        'p-6',
        hover && 'transition-shadow hover:shadow-lg',
        className
      )}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-col space-y-1.5 mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-center mt-4', className)}>{children}</div>;
}
