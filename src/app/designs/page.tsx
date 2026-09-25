import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import DesignsGallery from '@/components/designs/DesignsGallery';
import { getAllDesigns } from '@/lib/designs';

export const metadata: Metadata = {
  title: 'Graphic Designs Archive • Rajan',
  description:
    'Full gallery of graphic designs, cultural celebration posters, social media creatives, and visual artworks designed by Rajan.',
};

export default function DesignsPage() {
  const designs = getAllDesigns();

  return (
    <main className="page-section pt-28 sm:pt-32 md:pt-36 pb-24">
      {/* Back to Home link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium tracking-wide uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors group"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-10 md:mb-12">
        <SectionHeader
          eyebrow="Designs Collection"
          title="All Graphic Designs."
          body="An extensive collection of festival posters, cultural artwork, visual layouts, and creative projects. Click any design to preview in high resolution."
        />
      </div>

      {/* Responsive Gallery */}
      <DesignsGallery initialDesigns={designs} />
    </main>
  );
}
