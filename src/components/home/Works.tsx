'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SectionHeader from '../ui/SectionHeader';
import ScrollReveal from '../ui/ScrollReveal';
import DesignCard from '../designs/DesignCard';
import DesignLightbox from '../designs/DesignLightbox';
import { getFeaturedDesigns, GraphicDesign } from '@/lib/designs';

export default function Works() {
  const featuredDesigns = getFeaturedDesigns();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleSelect = (design: GraphicDesign) => {
    const idx = featuredDesigns.findIndex((d) => d.id === design.id);
    if (idx !== -1) {
      setSelectedIdx(idx);
    }
  };

  return (
    <div id="works" className="page-section">
      {/* Header */}
      <ScrollReveal className="mb-12">
        <SectionHeader
          eyebrow="Graphic Design"
          title="Things I've designed."
          body="A curated collection of poster designs, cultural creatives, and visual artwork crafted with bold typography, balanced compositions, and vivid storytelling."
        />
      </ScrollReveal>

      {/* Responsive Graphic Designs Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
        {featuredDesigns.map((design, index) => (
          <ScrollReveal key={design.id}>
            <DesignCard
              design={design}
              onSelect={handleSelect}
              priority={index < 3}
            />
          </ScrollReveal>
        ))}
      </div>

      {/* Button to View All Designs on /designs route */}
      <ScrollReveal className="mt-14 flex justify-center">
        <Link
          href="/designs"
          className="group cursor-pointer relative overflow-hidden px-8 py-4 flex items-center justify-center gap-2 bg-white dark:bg-[#1c1c21] text-black dark:text-white border border-black/10 dark:border-white/10 transition-colors duration-500 rounded-none shadow-xs hover:border-black/30 dark:hover:border-white/30"
        >
          {/* Expanding Dot Background Animation */}
          <span className="btn-dot absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black dark:bg-white transition-all duration-800 ease-out pointer-events-none z-0 group-hover:scale-[200] rounded-full" />
          <div className="z-10 relative flex items-center gap-2">
            <span className="text-base font-semibold text-black dark:text-white group-hover:text-white group-hover:dark:text-black transition-colors duration-500">
              View All Designs
            </span>
            <svg
              className="transition-transform duration-300 transform text-black dark:text-white group-hover:text-white group-hover:dark:text-black group-hover:translate-x-1"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </Link>
      </ScrollReveal>

      {/* Fullscreen Lightbox for Preview */}
      <DesignLightbox
        designs={featuredDesigns}
        currentIndex={selectedIdx}
        onClose={() => setSelectedIdx(null)}
        onNavigate={(idx) => setSelectedIdx(idx)}
      />
    </div>
  );
}
