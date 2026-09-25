'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function DesignsNavControls() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Fixed Sticky Back Arrow in Top-Left */}
      <div className="fixed top-5 left-4 sm:top-7 sm:left-7 z-50">
        <Link
          href="/"
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white/90 dark:bg-[#141418]/90 backdrop-blur-md border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 text-[var(--color-text)] transition-all shadow-md hover:scale-105 active:scale-95 group cursor-pointer"
          aria-label="Back to Home"
          title="Back to Home"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
      </div>

      {/* Fixed ThemeToggle in Top-Right */}
      <div className="fixed top-5 right-4 sm:top-7 sm:right-7 z-50">
        <ThemeToggle />
      </div>

      {/* Fixed Scroll-to-Top Button in Bottom-Right */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="w-11 h-11 flex items-center justify-center bg-white/90 dark:bg-[#141418]/90 backdrop-blur-md border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30 text-[var(--color-text)] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Scroll to Top"
          title="Scroll to Top"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </>
  );
}
