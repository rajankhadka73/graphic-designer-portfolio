import React from 'react';
import Hero from '@/components/home/Hero';
import Works from '@/components/home/Works';
import Skills from '@/components/home/Skills';
import Process from '@/components/home/Process';
import Contact from '@/components/home/Contact';
import Divider from '@/components/ui/Divider';

export default function Home() {
  return (
    <main>
      <Hero />
      <Divider />
      <Works />
      <Divider />
      <Skills />
      <Divider />
      <Process />
      <Divider />
      <Contact />
    </main>
  );
}
