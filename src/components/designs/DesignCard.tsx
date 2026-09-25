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
      className="group relative flex flex-col bg-white dark:bg-[#141418] border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1"
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
      {/* 4:5 Poster Image Canvas */}
      <div className="aspect-[4/5] relative w-full overflow-hidden bg-neutral-100 dark:bg-[#1a1a20]">
        <img
          src={design.image}
          alt={design.title}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 bg-black/75 backdrop-blur-md text-white text-xs font-medium tracking-wider uppercase border border-white/20 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            Preview
          </span>
        </div>
      </div>

      {/* Card Footer with truncated title */}
      <div className="p-3.5 md:p-4 flex items-center justify-between gap-2.5 border-t border-black/10 dark:border-white/10 bg-neutral-50/50 dark:bg-[#121215]/60 min-w-0">
        <h3
          className="text-sm md:text-base font-semibold text-[var(--color-text)] truncate min-w-0 flex-1 tracking-tight"
          title={design.title}
        >
          {design.title}
        </h3>
        <span className="text-[0.68rem] uppercase font-mono tracking-wider text-[var(--color-text-muted)] shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          {design.category}
        </span>
      </div>
    </article>
  );
}
