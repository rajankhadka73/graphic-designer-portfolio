'use client';

import React, { useEffect, useCallback } from 'react';
import { GraphicDesign } from '@/lib/designs';

interface DesignLightboxProps {
  designs: GraphicDesign[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function DesignLightbox({
  designs,
  currentIndex,
  onClose,
  onNavigate,
}: DesignLightboxProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < designs.length;
  const currentDesign = isOpen ? designs[currentIndex] : null;

  const handlePrev = useCallback(() => {
    if (currentIndex !== null) {
      const prevIdx = (currentIndex - 1 + designs.length) % designs.length;
      onNavigate(prevIdx);
    }
  }, [currentIndex, designs.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex !== null) {
      const nextIdx = (currentIndex + 1) % designs.length;
      onNavigate(nextIdx);
    }
  }, [currentIndex, designs.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentDesign) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentDesign.title}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-between bg-black/92 backdrop-blur-md p-4 sm:p-6 md:p-8 select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="w-full max-w-6xl flex items-center justify-between z-10 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-white/50 font-mono">
            {String(currentIndex + 1).padStart(2, '0')} / {String(designs.length).padStart(2, '0')}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:inline-block" />
          <h2 className="text-white text-sm sm:text-base font-medium truncate max-w-xs sm:max-w-md md:max-w-lg">
            {currentDesign.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct link/download */}
          <a
            href={currentDesign.image}
            target="_blank"
            rel="noopener noreferrer"
            download={currentDesign.filename}
            className="p-2 text-white/70 hover:text-white transition-colors border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 flex items-center justify-center"
            title="Open original image"
            aria-label="Open original image"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white transition-colors border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 flex items-center justify-center"
            aria-label="Close image viewer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Central Image with Navigation */}
      <div
        className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-auto min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 sm:-left-12 lg:-left-16 p-3 text-white/60 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/20 z-20"
          aria-label="Previous design"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Display Image */}
        <div className="relative max-h-[82vh] max-w-[85vw] md:max-w-3xl flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl bg-black">
          <img
            key={currentDesign.id}
            src={currentDesign.image}
            alt={currentDesign.title}
            className="max-h-[80vh] w-auto max-w-full object-contain animate-fadeIn"
          />
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 sm:-right-12 lg:-right-16 p-3 text-white/60 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/20 z-20"
          aria-label="Next design"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Bottom info caption */}
      <div
        className="w-full max-w-6xl flex items-center justify-between z-10 py-2 border-t border-white/10 text-white/50 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-white text-[11px]">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-white text-[11px]">→</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-white text-[11px]">Esc</kbd> to exit</span>
        <span className="uppercase font-mono tracking-wider">{currentDesign.category}</span>
      </div>
    </div>
  );
}
