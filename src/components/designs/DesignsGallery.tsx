'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import DesignCard from './DesignCard';
import DesignLightbox from './DesignLightbox';
import { GraphicDesign } from '@/lib/designs';

interface DesignsGalleryProps {
  initialDesigns: GraphicDesign[];
}

export default function DesignsGallery({ initialDesigns }: DesignsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialDesigns.forEach((d) => set.add(d.category));
    return ['All', ...Array.from(set)];
  }, [initialDesigns]);

  // Filter designs based on category
  const filteredDesigns = useMemo(() => {
    if (selectedCategory === 'All') return initialDesigns;
    return initialDesigns.filter((d) => d.category === selectedCategory);
  }, [initialDesigns, selectedCategory]);

  const handleSelectCard = (design: GraphicDesign) => {
    const idx = filteredDesigns.findIndex((d) => d.id === design.id);
    if (idx !== -1) {
      setLightboxIdx(idx);
    }
  };

  return (
    <div className="w-full">
      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = cat === 'All' ? initialDesigns.length : initialDesigns.filter(d => d.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs md:text-sm font-medium tracking-wide uppercase whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                isActive
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                  : 'bg-white/60 dark:bg-[#141418] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25'
              }`}
            >
              {cat} <span className="opacity-60 text-[11px] ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
        {filteredDesigns.map((design, index) => (
          <DesignCard
            key={design.id}
            design={design}
            onSelect={handleSelectCard}
            priority={index < 6}
          />
        ))}
      </div>

      {/* If empty */}
      {filteredDesigns.length === 0 && (
        <div className="text-center py-20 border border-dashed border-black/10 dark:border-white/10 p-8 my-8">
          <p className="text-[var(--color-text-muted)] text-base">No designs found in this category.</p>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <DesignLightbox
        designs={filteredDesigns}
        currentIndex={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onNavigate={(idx) => setLightboxIdx(idx)}
      />
    </div>
  );
}
