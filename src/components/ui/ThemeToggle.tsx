'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '@/providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className="theme-toggle-new"
      aria-label="Toggle theme"
    >
      {/* Sliding selector background handle */}
      <motion.div
        className="theme-toggle-handle"
        animate={{
          x: isDark ? 0 : 32,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />

      {/* Moon Icon (Left) */}
      <span
        className="moon-icon z-10 flex items-center justify-center transition-opacity duration-300 absolute left-1 top-1 w-6 h-6"
        style={{
          opacity: isDark ? 1 : 0.55,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>

      {/* Sun Icon (Right) */}
      <span
        className="sun-icon z-10 flex items-center justify-center transition-opacity duration-300 absolute right-1 top-1 w-6 h-6"
        style={{
          opacity: !isDark ? 1 : 0.55,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </span>
    </button>
  );
}
