'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), {
  ssr: false,
});

export default function Hero() {
  const [showCanvas, setShowCanvas] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle3D = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.visible === 'boolean') {
        setShowCanvas(customEvent.detail.visible);
      }
    };

    window.addEventListener('toggle-3d-model', handleToggle3D);

    return () => {
      window.removeEventListener('toggle-3d-model', handleToggle3D);
    };
  }, []);

  return (
    <section id="hero" ref={heroRef} className="p-0 max-w-full">
      <video
        id="sky-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/portfolio-resources/sky-cloud.mp4" type="video/mp4" />
      </video>
      <div id="hero-overlay" />
      <div className="hero-text-layer">
        {/* <p className="hero-eyebrow">Hi, I am Rajan</p>
        <h1 className="hero-headline">I am a designer.</h1>
        <p className="hero-sub-text">Building thoughtful interfaces and creative experiences.</p> */}
        <p className="hero-eyebrow">Hi, I am Rajan</p>
        <h1 className="hero-headline">Graphic Designer</h1>
        <p className="hero-sub-text">Visual storytelling through compelling design.</p>
        <div className="hero-cv-container min-w-fit">
          <div className="cv-btn-group hero-cv-group min-w-fit h-8 lg:h-10">
            <a
              href="/portfolio-resources/Rajan-Khadka-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="cv-btn-view lg:px-4 text-sm"
            >
              View Resume
            </a>
            <a
              href="/portfolio-resources/Rajan-Khadka-Resume.pdf"
              download="Rajan-Khadka-Resume.pdf"
              className="cv-btn-download lg:px-4 min-w-fit"
              aria-label="Download Resume"
            >
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {showCanvas && <HeroCanvas />}

      <div className="scroll-hint">
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="7" r="2" fill="currentColor">
            <animate attributeName="cy" values="7;14;7" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
        Scroll
      </div>
    </section>
  );
}
