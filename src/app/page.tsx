'use client';

import LocomotiveScroll from 'locomotive-scroll';
import { useEffect } from 'react';

import Description from './components/Description/Description';
import Hero from './components/Hero/Hero';
import PhotoList from './components/PhotoList/PhotoList';

export default function page() {
  useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll();
  }, []);

  return (
    <div>
      <Hero />
      <Description />
      <PhotoList />
    </div>
  );
}
