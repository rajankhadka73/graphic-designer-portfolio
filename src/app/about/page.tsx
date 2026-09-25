import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';

export default function AboutPage() {
  return (
    <main className="page-section pt-32 min-h-[70vh] flex flex-col justify-center">
      <SectionHeader
        eyebrow="About Me"
        title="Hi, I'm Rajan"
        body="A designer building thoughtful interfaces and creative experiences. Coming soon."
      />
    </main>
  );
}
