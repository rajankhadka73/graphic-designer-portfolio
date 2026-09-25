import React from 'react';
import type { Metadata } from 'next';
import SectionHeader from '@/components/ui/SectionHeader';
import DesignsGallery from '@/components/designs/DesignsGallery';
import DesignsNavControls from '@/components/designs/DesignsNavControls';
import { getAllDesigns } from '@/lib/designs';

export const metadata: Metadata = {
  title: 'Graphic Designs Archive • Rajan',
  description:
    'Full gallery of graphic designs, cultural celebration posters, social media creatives, and visual artworks designed by Rajan.',
};

export default function DesignsPage() {
  const designs = getAllDesigns();

  return (
    <main className="page-section pt-24 sm:pt-28 md:pt-32 pb-24 relative min-h-screen">
      {/* Sticky/Fixed Back Button, ThemeToggle, and Scroll to Top */}
      <DesignsNavControls />

      {/* Page Header */}
      <div className="mb-10 md:mb-12">
        <SectionHeader
          eyebrow="Designs Collection"
          title="All Graphic Designs."
          body="An extensive collection of festival posters, cultural artwork, visual layouts, and creative projects. Click any design to preview in high resolution."
        />
      </div>

      {/* Responsive Gallery with Brand Categories & Chevron Scroll */}
      <DesignsGallery initialDesigns={designs} />
    </main>
  );
}
