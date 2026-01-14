/**
 * Button Component
 * 
 * design-system.ts를 기반으로 한 재사용 가능한 버튼 컴포넌트
 * Framer Motion으로 hover/tap 애니메이션 추가
 * 
 * @example
 * <Button variant="primary" size="lg">클릭</Button>
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/design-system';
import { buttonHover, buttonTap } from '@/lib/animations';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children,
  className,
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? buttonHover : undefined}
      whileTap={!disabled ? buttonTap : undefined}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'rounded-md font-medium',
        'transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        
        // Sizes
        size === 'sm' && 'h-8 px-6 text-sm',
        size === 'md' && 'h-10 px-8 text-base',
        size === 'lg' && 'h-12 px-10 text-base',
        
        // Variants
        variant === 'primary' && 'bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/95',
        variant === 'secondary' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        variant === 'outline' && 'border-2 border-foreground bg-background hover:bg-foreground hover:text-background',
        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
        
        // Custom className
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
