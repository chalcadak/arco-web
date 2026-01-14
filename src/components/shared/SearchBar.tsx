'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = '상품을 검색하세요...',
  className = '',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative flex items-center gap-3
          px-4 py-3 rounded-lg
          bg-white border-2 transition-all duration-200
          ${isFocused ? 'border-gray-900 shadow-md' : 'border-gray-200'}
        `}
      >
        <Search
          className={`
            w-5 h-5 transition-colors duration-200
            ${isFocused ? 'text-gray-900' : 'text-gray-400'}
          `}
        />

        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            flex-1 outline-none text-base
            placeholder:text-gray-400
          "
        />

        <AnimatePresence>
          {localValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="
                p-1 rounded-full
                hover:bg-gray-100
                transition-colors duration-200
              "
              type="button"
            >
              <X className="w-4 h-4 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search hint */}
      {isFocused && !localValue && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="
            absolute top-full left-0 right-0 mt-2
            p-4 bg-white rounded-lg border border-gray-200 shadow-lg
            z-10
          "
        >
          <p className="text-sm text-gray-500 mb-2">💡 검색 팁</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 상품명, 설명으로 검색할 수 있습니다</li>
            <li>• 여러 단어를 입력하면 모두 포함된 결과를 찾습니다</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}
