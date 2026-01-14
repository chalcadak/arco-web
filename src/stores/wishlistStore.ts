import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  type: 'product' | 'photoshoot';
  name: string;
  slug: string;
  price: number;
  images: string[];
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        
        // 이미 위시리스트에 있는지 확인
        if (items.some((i) => i.id === item.id)) {
          return;
        }

        set({
          items: [
            ...items,
            {
              ...item,
              addedAt: new Date().toISOString(),
            },
          ],
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      isInWishlist: (id) => {
        const { items } = get();
        return items.some((item) => item.id === id);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        const { items } = get();
        return items.length;
      },
    }),
    {
      name: 'arco-wishlist-storage',
    }
  )
);
