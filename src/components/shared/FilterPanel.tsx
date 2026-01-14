'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FilterOptions {
  categories: Array<{ id: number; name: string }>;
  priceRange: { min: number; max: number };
  tags: string[];
  sortBy: 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'name';
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableCategories: Array<{ id: number; name: string }>;
  availableTags?: string[];
  showPriceFilter?: boolean;
  showTagFilter?: boolean;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  availableCategories,
  availableTags = ['신상품', '베스트', '인기', '추천'],
  showPriceFilter = true,
  showTagFilter = true,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: false,
    tags: false,
    sort: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryToggle = (categoryId: number) => {
    const isSelected = filters.categories.some((c) => c.id === categoryId);
    const category = availableCategories.find((c) => c.id === categoryId);
    
    if (!category) return;

    const newCategories = isSelected
      ? filters.categories.filter((c) => c.id !== categoryId)
      : [...filters.categories, category];

    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];

    onFilterChange({ ...filters, tags: newTags });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: numValue,
      },
    });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const resetFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: { min: 0, max: 1000000 },
      tags: [],
      sortBy: 'newest',
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 1000000;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">필터</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-gray-500 hover:text-gray-900"
          >
            <X className="w-4 h-4 mr-1" />
            초기화
          </Button>
        )}
      </div>

      {/* Sort By */}
      <FilterSection
        title="정렬"
        isExpanded={expandedSections.sort}
        onToggle={() => toggleSection('sort')}
      >
        <div className="space-y-2">
          {[
            { value: 'newest', label: '최신순' },
            { value: 'popular', label: '인기순' },
            { value: 'price_asc', label: '가격 낮은순' },
            { value: 'price_desc', label: '가격 높은순' },
            { value: 'name', label: '이름순' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="sortBy"
                value={option.value}
                checked={filters.sortBy === option.value}
                onChange={() => handleSortChange(option.value as FilterOptions['sortBy'])}
                className="w-4 h-4 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm group-hover:text-gray-900 transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category Filter */}
      <FilterSection
        title="카테고리"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.some((c) => c.id === category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm group-hover:text-gray-900 transition-colors">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      {showPriceFilter && (
        <FilterSection
          title="가격 범위"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">최소</label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">최대</label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
                  placeholder="1000000"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {filters.priceRange.min.toLocaleString()}원 ~{' '}
              {filters.priceRange.max.toLocaleString()}원
            </p>
          </div>
        </FilterSection>
      )}

      {/* Tags Filter */}
      {showTagFilter && (
        <FilterSection
          title="태그"
          isExpanded={expandedSections.tags}
          onToggle={() => toggleSection('tags')}
        >
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${
                    filters.tags.includes(tag)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <h4 className="text-sm font-semibold group-hover:text-gray-600 transition-colors">
          {title}
        </h4>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
