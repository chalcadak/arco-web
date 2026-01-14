'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '@/stores/wishlistStore';
import { cn } from '@/lib/design-system';

interface WishlistButtonProps {
  item: Omit<WishlistItem, 'addedAt'>;
  className?: string;
  showLabel?: boolean;
}

export function WishlistButton({ item, className, showLabel = false }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(item.id));
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={cn(
        'flex items-center gap-2 p-2 rounded-full transition-colors',
        isInWishlist
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-gray-600',
        className
      )}
      aria-label={isInWishlist ? '찜 취소' : '찜하기'}
    >
      <motion.div
        animate={isInWishlist ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn('h-5 w-5', isInWishlist && 'fill-current')}
        />
      </motion.div>
      {showLabel && (
        <span className="text-sm font-medium">
          {isInWishlist ? '찜 취소' : '찜하기'}
        </span>
      )}
    </motion.button>
  );
}
