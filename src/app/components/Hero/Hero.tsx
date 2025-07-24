import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';

import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const hero = useRef<HTMLDivElement>(null);
  const backgroundImage = useRef<HTMLDivElement>(null);
  const heroImage = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!hero.current || !backgroundImage.current || !heroImage.current) return;

    const ctx = gsap.context(() => {
      gsap.set(hero.current, { visibility: 'visible' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top',
          end: '+=500',
          scrub: true,
        },
      });

      timeline
        .from(backgroundImage.current, { clipPath: 'inset(15%)' })
        .to(heroImage.current, { height: '100px' }, 0);
    }, hero.current);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={hero}
      className='hero_wrap flex flex-col items-center justify-center'
    >
      <div ref={backgroundImage} className='hero_bg_image_wrap'>
        <Image
          src={'/images/nyc.jpg'}
          alt='nyc'
          fill={true}
        />
      </div>

      <div className='hero_content_wrap flex flex-col items-center justify-center'>
        <div
          ref={heroImage}
          data-scroll
          data-scroll-speed='0.5'
          className='hero_image_wrap'
        >
          <Image
            src={'/images/the-san-remo.jpg'}
            alt='nyc'
            fill={true}
          />
        </div>
        <h2 data-scroll data-scroll-speed='0.7'>
          New York City
        </h2>
      </div>
    </div>
  );
}
