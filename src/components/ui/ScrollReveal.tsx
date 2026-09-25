'use client';

import React, { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'main' | 'span';
}

export default function ScrollReveal({
  children,
  className = '',
  as = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  const Component = as;

  return (
    <Component ref={ref as any} className={`reveal ${className}`}>
      {children}
    </Component>
  );
}
