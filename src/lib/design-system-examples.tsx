/**
 * Design System Usage Examples
 * 
 * 디자인 시스템을 실제 컴포넌트에서 사용하는 예시
 */

import { colors, typography, spacing, components, cn } from '@/lib/design-system';

// ============================================================================
// Example 1: Custom Button Component
// ============================================================================

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function CustomButton({ 
  variant = 'primary', 
  size = 'md',
  children,
  onClick,
  disabled = false,
  className 
}: ButtonProps) {
  const buttonVariant = components.button.variants[variant];
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'rounded-md font-medium',
        'transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Size
        size === 'sm' && 'h-8 px-6 text-sm',
        size === 'md' && 'h-10 px-8 text-base',
        size === 'lg' && 'h-12 px-10 text-lg',
        
        // Variant
        variant === 'primary' && 'bg-foreground text-background hover:bg-foreground/90',
        variant === 'secondary' && 'border border-input hover:bg-accent',
        variant === 'outline' && 'border-2 border-foreground hover:bg-foreground hover:text-background',
        variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700',
        
        // Custom className
        className
      )}
    >
      {children}
    </button>
  );
}

// ============================================================================
// Example 2: Custom Card Component
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}

export function CustomCard({ children, hover = true, className }: CardProps) {
  return (
    <div
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
    </div>
  );
}

// ============================================================================
// Example 3: Typography Components
// ============================================================================

export function Heading1({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={cn('text-4xl font-bold tracking-tight', className)}>
      {children}
    </h1>
  );
}

export function Heading2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-3xl font-semibold', className)}>
      {children}
    </h2>
  );
}

export function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-base leading-normal', className)}>
      {children}
    </p>
  );
}

export function Muted({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}

// ============================================================================
// Example 4: Badge Component
// ============================================================================

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'px-3 py-1',
        'text-xs font-medium',
        'rounded-full',
        variant === 'default' && 'bg-neutral-100',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'secondary' && 'bg-neutral-200',
        className
      )}
    >
      {children}
    </span>
  );
}

// ============================================================================
// Example 5: Using Design Tokens Directly
// ============================================================================

export function DesignTokenExample() {
  return (
    <div
      style={{
        // Using color tokens
        backgroundColor: colors.background.DEFAULT,
        color: colors.foreground.DEFAULT,
        
        // Using spacing tokens
        padding: spacing[6],
        marginBottom: spacing[8],
        
        // Using typography tokens
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.lineHeight.normal,
      }}
    >
      <p>This component uses design tokens directly!</p>
    </div>
  );
}

// ============================================================================
// Example 6: Responsive Container
// ============================================================================

export function ResponsiveContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-[1280px]">
      {children}
    </div>
  );
}

// ============================================================================
// Example 7: Product Card with Design System
// ============================================================================

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  description?: string;
  tags?: string[];
}

export function ProductCard({ image, name, price, description, tags }: ProductCardProps) {
  return (
    <CustomCard hover>
      <div className="aspect-square overflow-hidden rounded-lg mb-4">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-110"
        />
      </div>
      
      <div className="space-y-2">
        {tags && tags.length > 0 && (
          <div className="flex gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="default">{tag}</Badge>
            ))}
          </div>
        )}
        
        <Heading2 className="text-xl">{name}</Heading2>
        
        {description && (
          <Muted>{description}</Muted>
        )}
        
        <p className="text-2xl font-bold">₩{price.toLocaleString()}</p>
        
        <CustomButton variant="primary" className="w-full mt-4">
          장바구니에 담기
        </CustomButton>
      </div>
    </CustomCard>
  );
}
