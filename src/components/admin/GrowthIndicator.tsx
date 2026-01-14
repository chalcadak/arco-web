// src/components/admin/GrowthIndicator.tsx
'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Text } from '@/components/ui/typography';

interface GrowthIndicatorProps {
  value: number; // 증감률 (%)
  format?: 'percentage' | 'number';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function GrowthIndicator({
  value,
  format = 'percentage',
  size = 'md',
  showIcon = true,
  className = '',
}: GrowthIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const absValue = Math.abs(value);
  
  // 색상 결정
  const colorClass = isNeutral
    ? 'text-gray-600'
    : isPositive
    ? 'text-green-600'
    : 'text-red-600';
  
  const bgClass = isNeutral
    ? 'bg-gray-100'
    : isPositive
    ? 'bg-green-50'
    : 'bg-red-50';
  
  // 아이콘 선택
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  
  // 크기별 스타일
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  // 포맷팅
  const formattedValue = format === 'percentage'
    ? `${isPositive ? '+' : ''}${value.toFixed(1)}%`
    : `${isPositive ? '+' : ''}${value.toLocaleString()}`;
  
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${bgClass} ${colorClass} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{formattedValue}</span>
    </span>
  );
}

// 사용 예시:
// <GrowthIndicator value={15.3} />           // +15.3% (녹색)
// <GrowthIndicator value={-5.2} />           // -5.2% (빨강)
// <GrowthIndicator value={0} />              // 0.0% (회색)
// <GrowthIndicator value={1500} format="number" /> // +1,500 (숫자 형식)
