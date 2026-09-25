'use client';

import React from 'react';
import { GraphicDesign } from '@/lib/designs';

interface DesignCardProps {
  design: GraphicDesign;
  onSelect?: (design: GraphicDesign) => void;
  priority?: boolean;
}

export default function DesignCard({ design, onSelect, priority = false }: DesignCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(design);
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group relative flex flex-col bg-white dark:bg-[#141418] border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 transition-colors duration-300 cursor-pointer overflow-hidden rounded-none"
      tabIndex={0}
      role="button"
      aria-label={`View ${design.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* 4:5 Poster Image Canvas with theme-adaptive background (whitish-grey in light mode, dark in dark mode) */}
      <div className="aspect-[4/5] relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center p-1.5 sm:p-2">
        <img
          src={design.image}
          alt={design.title}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Card Footer with truncated clean title and brand tag */}
      <div className="p-3.5 md:p-4 flex items-center justify-between gap-2.5 border-t border-black/10 dark:border-white/10 bg-white dark:bg-[#141418] min-w-0">
        <h3
          className="text-sm md:text-base font-semibold text-[var(--color-text)] truncate min-w-0 flex-1 tracking-tight"
          title={design.title}
        >
          {design.title}
        </h3>
        <span className="text-xs font-medium tracking-normal text-[var(--color-text-muted)] shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          {design.category}
        </span>
      </div>
    </article>
  );
}
