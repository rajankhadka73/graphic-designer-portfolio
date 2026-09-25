import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';

export default function BlogPage() {
  return (
    <main className="page-section pt-32 min-h-[70vh] flex flex-col justify-center">
      <SectionHeader
        eyebrow="Writing"
        title="My Blog"
        body="Thoughts on design, front-end development, and creative technology. Coming soon."
      />
    </main>
  );
}
