'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/constants';
import ThemeToggle from '../ui/ThemeToggle';
import { useThemeContext } from '@/providers/ThemeProvider';
import { useLenis } from '@/providers/SmoothScrollProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useThemeContext();
  const lenis = useLenis();

  const [scrolled, setScrolled] = useState(false);
  const [show3d, setShow3d] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const isHomePage = pathname === '/';
  const isDesignsPage = pathname === '/designs';

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // IntersectionObserver for tracking active home page sections
  useEffect(() => {
    if (!isHomePage) {
      setActiveSection('');
      return;
    }

    const sections = ['works', 'skills', 'process', 'contact'];
    const visibleSections = new Set<string>();
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleSections.add(id);
            } else {
              visibleSections.delete(id);
            }

            const current = sections.find((s) => visibleSections.has(s));
            if (current && window.scrollY >= 200) {
              setActiveSection(current);
            } else {
              setActiveSection('');
            }
          });
        },
        { rootMargin: '-30% 0px -40% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHomePage]);

  // Smooth scroll to element on load/path changes when a hash is present
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      const target = document.querySelector(hash) as HTMLElement;
      if (target) {
        const timer = setTimeout(() => {
          const offset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;

          if (lenis) {
            lenis.scrollTo(offsetPosition, { duration: 1.2 });
          } else {
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, lenis]);

  useEffect(() => {
    const handleScroll = (scrollVal: number) => {
      setScrolled(scrollVal > 40);
      if (scrollVal < 200) {
        setActiveSection('');
      }
    };

    // Fallback to window scroll if lenis is not yet initialised
    const windowScrollHandler = () => {
      if (!lenis) {
        handleScroll(window.scrollY);
      }
    };

    window.addEventListener('scroll', windowScrollHandler);

    if (lenis) {
      const onLenisScroll = (e: any) => {
        handleScroll(e.scroll);
      };
      lenis.on('scroll', onLenisScroll);
      return () => {
        window.removeEventListener('scroll', windowScrollHandler);
        lenis.off('scroll', onLenisScroll);
      };
    }

    return () => {
      window.removeEventListener('scroll', windowScrollHandler);
    };
  }, [lenis]);

  useEffect(() => {
    const scrollUpThreshold = 15;
    const scrollDownThreshold = 10;
    
    let lastY = window.scrollY;
    let accumulated = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (currentY < 50) {
        setVisible(true);
        accumulated = 0;
        lastY = currentY;
        return;
      }

      if (delta > 0) {
        // Scrolling down
        accumulated = Math.max(0, accumulated) + delta;
        if (accumulated > scrollDownThreshold) {
          setVisible(false);
          accumulated = 0;
        }
      } else if (delta < 0) {
        // Scrolling up
        accumulated = Math.min(0, accumulated) + delta;
        if (Math.abs(accumulated) > scrollUpThreshold) {
          setVisible(true);
          accumulated = 0;
        }
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle3D = () => {
    const nextVal = !show3d;
    setShow3d(nextVal);
    window.dispatchEvent(
      new CustomEvent('toggle-3d-model', { detail: { visible: nextVal } })
    );
  };

  useEffect(() => {
    const handleExternalToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.visible === 'boolean') {
        setShow3d(customEvent.detail.visible);
      }
    };
    window.addEventListener('sync-3d-model-state', handleExternalToggle);
    return () => {
      window.removeEventListener('sync-3d-model-state', handleExternalToggle);
    };
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);
    if (isHomePage) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        if (lenis) {
          lenis.scrollTo(offsetPosition, { duration: 1.2 });
        } else {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileOpen(false);
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

  // Safe early exit AFTER all hooks are called
  if (isDesignsPage) {
    return null;
  }

  const isAtTop = !scrolled;
  const isLightTheme = theme === 'light';

  const atTopClass = isAtTop && isHomePage ? 'at-top' : '';
  const scrolledClass = scrolled ? 'scrolled' : '';
  const notHeroClass = !isHomePage ? 'not-hero' : '';

  // Hamburger colour: white on hero at-top, otherwise theme text colour
  const hamburgerColor =
    isAtTop && isHomePage ? 'rgba(255,255,255,0.9)' : 'var(--color-text)';

  return (
    <>
      <nav className={`${scrolledClass} ${atTopClass} ${notHeroClass}`} id="navbar">
        <Link href="/" onClick={handleLogoClick} className="nav-logo" aria-label="Rajan Portfolio Home">
          <svg
            width="28"
            height="24"
            viewBox="0 0 1110 947"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block h-[1.35rem] w-auto"
          >
            <path d="M243.5 115H636.5L394 946.5H0L243.5 115Z" fill="currentColor" />
            <path d="M1109.5 0H716.5L623.5 316H732.5L679.5 498H570.5L546.5 579L629 832H867L1109.5 0Z" fill="currentColor" />
          </svg>
        </Link>

        {/* Desktop nav links */}
        <ul className="nav-links">
          {NAV_LINKS.map((link) => {
            const isAnchor = link.href.startsWith('#');
            if (isAnchor) {
              const finalHref = isHomePage ? link.href : `/${link.href}`;
              const isActive = isHomePage && activeSection === link.href.substring(1);
              return (
                <li key={link.href}>
                  <a
                    href={finalHref}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={isActive ? 'active-link' : ''}
                  >
                    {link.label}
                  </a>
                </li>
              );
            } else {
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={pathname === link.href ? 'active-link' : ''}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            }
          })}
        </ul>

        <div className="nav-right">
          <ThemeToggle />

          {/* Hamburger button — visible only on mobile via CSS */}
          <button
            className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            style={{ color: hamburgerColor }}
          >
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen overlay ── */}
      <div className={`nav-mobile-overlay${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>

        {/* Close button */}
        <button
          className="nav-mobile-close"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          style={{ color: 'var(--color-text)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <ul className="nav-mobile-links">
          {NAV_LINKS.map((link) => {
            const isAnchor = link.href.startsWith('#');
            if (isAnchor) {
              const finalHref = isHomePage ? link.href : `/${link.href}`;
              const isActive = isHomePage && activeSection === link.href.substring(1);
              return (
                <li key={link.href}>
                  <a
                    href={finalHref}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={isActive ? 'active-link' : ''}
                  >
                    {link.label}
                  </a>
                </li>
              );
            } else {
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={pathname === link.href ? 'active-link' : ''}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            }
          })}
        </ul>

        {/* Social links at the bottom of overlay */}
        <div className="nav-mobile-footer">
          <a href="https://www.linkedin.com/in/rajan-khadka-106868268/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://wa.me/+9779814364007?text=Hello%20Rajan,%20Let%27s%20work%20together." target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
