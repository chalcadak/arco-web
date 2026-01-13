'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // 클라이언트에서만 렌더링되도록 설정
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tight">ARCO</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/products" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            판매상품
          </Link>
          <Link 
            href="/photoshoots" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            촬영룩
          </Link>
          <Link 
            href="/gallery" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            갤러리
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            소개
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            고객센터
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/cart" 
            className="text-sm font-medium transition-colors hover:text-primary relative"
          >
            장바구니
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link 
            href="/login" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  )
}
