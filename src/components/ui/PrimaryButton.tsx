'use client';

import React from 'react';

interface PrimaryButtonProps {
  CustomStyle?: string;
  text: string;
  btnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ArrowStyle?: string;
  chkBtnDisabled?: boolean;
  blurShape1?: string;
  blurShape2?: string;
}

export default function PrimaryButton({
  CustomStyle = '',
  text,
  btnClick,
  ArrowStyle = '',
  chkBtnDisabled = false,
  blurShape1 = '',
  blurShape2 = '',
}: PrimaryButtonProps) {
  return (
    <button
      disabled={chkBtnDisabled}
      onClick={btnClick}
      className={`group cursor-pointer relative overflow-hidden px-8 py-4 flex items-center justify-center gap-1.5 bg-white dark:bg-[#1c1c21] text-black dark:text-white border border-black/10 dark:border-white/10 transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-none ${CustomStyle}`}
    >
      {/* Expanding Dot Background Animation */}
      <span
        className="btn-dot absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black dark:bg-white transition-all duration-800 ease-out pointer-events-none z-0 group-hover:scale-[200] rounded-full"
      />
      <div className="z-10 relative flex items-center gap-1.5">
        <span className="text-base font-semibold text-black dark:text-white group-hover:text-white group-hover:dark:text-black transition-colors duration-500">
          {text}
        </span>
        <svg
          className={`transition-all duration-300 transform text-black dark:text-white group-hover:text-white group-hover:dark:text-black group-hover:translate-x-1 group-hover:animate-horizontal-bounce ${ArrowStyle}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </button>
  );
}
