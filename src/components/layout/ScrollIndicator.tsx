'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const SECTION_IDS = ['works', 'skills', 'process', 'contact'];
const DOT_OFFSET_PX = 120;

export default function ScrollIndicator() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [dots, setDots] = useState<{ id: string; top: number; visible: boolean }[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isHomePage) {
      setDots([]);
      return;
    }

    const tickDots = () => {
      const trackTop = window.innerHeight * 0.08;
      const trackBottom = window.innerHeight * 0.92;

      const updatedDots = SECTION_IDS.map((id) => {
        const section = document.getElementById(id);
        if (!section) return { id, top: 0, visible: false };

        const rect = section.getBoundingClientRect();
        const dotY = rect.top + DOT_OFFSET_PX;
        const visible = dotY >= trackTop && dotY <= trackBottom;

        return { id, top: dotY, visible };
      });

      setDots(updatedDots);
      animationFrameRef.current = requestAnimationFrame(tickDots);
    };

    animationFrameRef.current = requestAnimationFrame(tickDots);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHomePage]);

  if (!isHomePage) return null;

  return (
    <>
      <div id="scroll-track" />
      {dots.map(
        ({ id, top, visible }) =>
          visible && (
            <div
              key={id}
              className="section-dot"
              style={{
                top: `${top}px`,
              }}
            />
          )
      )}
    </>
  );
}
