/**
 * Container Component
 * 
 * 일관된 max-width와 padding을 가진 컨테이너
 * 페이지 전환 애니메이션 지원
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/design-system';
import { fadeInUp } from '@/lib/animations';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function Container({ children, className, animate = false }: ContainerProps) {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      {...(animate ? { 
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
        variants: fadeInUp 
      } : {})}
      className={cn('container mx-auto px-4 md:px-8 max-w-[1280px]', className)}
    >
      {children}
    </Component>
  );
}

export function Section({ children, className, animate = false }: ContainerProps) {
  const Component = animate ? motion.section : 'section';
  
  return (
    <Component
      {...(animate ? { 
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
        variants: fadeInUp 
      } : {})}
      className={cn('py-12 md:py-16 lg:py-20', className)}
    >
      {children}
    </Component>
  );
}
