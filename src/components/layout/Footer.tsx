'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLenis } from '@/providers/SmoothScrollProvider';

export default function Footer() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isHomePage = pathname === '/';

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <footer className="footer-wrap">
      <div className="footer-divider" />
      <div className="footer-container">
        {/* Left: Logo & Name */}
        <div className="footer-logo-wrap">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="footer-logo-link"
            aria-label="Rajan Portfolio Home"
          >
            <svg
              width="24"
              height="20"
              viewBox="0 0 1110 947"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="footer-logo-svg"
            >
              <path d="M243.5 115H636.5L394 946.5H0L243.5 115Z" fill="currentColor" />
              <path d="M1109.5 0H716.5L623.5 316H732.5L679.5 498H570.5L546.5 579L629 832H867L1109.5 0Z" fill="currentColor" />
            </svg>
            {/* <span className="footer-logo-text">Rajan</span>*/}
          </Link>
        </div>

        {/* Middle: Links */}
        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/rajan-khadka-106868268/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>
          <a
            href="https://wa.me/+9779814364007?text=Hello%20Rajan,%20Let%27s%20work%20together."
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            WhatsApp
          </a>
          {/* <a
            href="https://github.com/rajan-khadkaa"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a> */}
        </div>

        {/* Right: Copyright */}
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} Rajan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
