/**
 * Container Component
 * 
 * 일관된 max-width와 padding을 가진 컨테이너
 */

import { cn } from '@/lib/design-system';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('container mx-auto px-4 md:px-8 max-w-[1280px]', className)}>
      {children}
    </div>
  );
}

export function Section({ children, className }: ContainerProps) {
  return (
    <section className={cn('py-12 md:py-16 lg:py-20', className)}>
      {children}
    </section>
  );
}
