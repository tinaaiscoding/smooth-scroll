'use client'

import LocomotiveScroll from 'locomotive-scroll';
import { useEffect } from 'react';

import Hero from './components/Hero/Hero';

export default function page() {
  useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll();
  }, []);

  return (
    <div>
      <Hero />
    </div>
  );
}
