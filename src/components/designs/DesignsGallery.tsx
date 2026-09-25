'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import DesignCard from './DesignCard';
import DesignLightbox from './DesignLightbox';
import { GraphicDesign } from '@/lib/designs';

interface DesignsGalleryProps {
  initialDesigns: GraphicDesign[];
}

export default function DesignsGallery({ initialDesigns }: DesignsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Extract unique categories (Companies / Brands)
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialDesigns.forEach((d) => set.add(d.category));
    return ['All', ...Array.from(set)];
  }, [initialDesigns]);

  // Filter designs based on selected company / brand
  const filteredDesigns = useMemo(() => {
    if (selectedCategory === 'All') return initialDesigns;
    return initialDesigns.filter((d) => d.category === selectedCategory);
  }, [initialDesigns, selectedCategory]);

  const checkScroll = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = tabsRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, categories]);

  const scrollTabs = (offset: number) => {
    tabsRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleSelectCard = (design: GraphicDesign) => {
    const idx = filteredDesigns.findIndex((d) => d.id === design.id);
    if (idx !== -1) {
      setLightboxIdx(idx);
    }
  };

  return (
    <div className="w-full">
      {/* Category filter pills with circular chevron scroll buttons */}
      <div className="relative mb-8 flex items-center">
        {/* Left Chevron Button */}
        {canScrollLeft && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center pr-4 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent">
            <button
              onClick={() => scrollTabs(-200)}
              className="w-8 h-8 rounded-full bg-white dark:bg-[#1a1a20] border border-black/15 dark:border-white/15 shadow-md flex items-center justify-center text-[var(--color-text)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Scroll categories left"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
        )}

        {/* Scrollable Pills Row (Native scrollbar completely hidden) */}
        <div
          ref={tabsRef}
          className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'All'
                ? initialDesigns.length
                : initialDesigns.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs md:text-sm font-medium tracking-normal whitespace-nowrap transition-all duration-200 border cursor-pointer ${
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

        {/* Right Chevron Button */}
        {canScrollRight && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center pl-4 bg-gradient-to-l from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent">
            <button
              onClick={() => scrollTabs(200)}
              className="w-8 h-8 rounded-full bg-white dark:bg-[#1a1a20] border border-black/15 dark:border-white/15 shadow-md flex items-center justify-center text-[var(--color-text)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Scroll categories right"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
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
          <p className="text-[var(--color-text-muted)] text-base">No designs found for this brand.</p>
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
