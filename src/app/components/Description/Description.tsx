import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

import './Description.css';

const phrases = [
  'New York City is a global hub',
  'Famous for art, food, and culture',
  "It's made up of five busy boroughs",
  'Millions call this vibrant place home',
  'Skyscrapers define its bold skyline',
];

gsap.registerPlugin(ScrollTrigger);

export default function Description() {
  return (
    <div className='description_wrap px-24 py-24'>
      {phrases.map((phrase, i) => {
        return <AnimatedText key={i}>{phrase}</AnimatedText>;
      })}
    </div>
  );
}

function AnimatedText({ children }: { children: string }) {
  const text = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!text.current) return;

    const ctx = gsap.context(() => {
      gsap.from(text.current, {
        scrollTrigger: {
          trigger: text.current,
          start: 'top 80%',
          end: 'bottom center',
          scrub: true,
        },
        ease: 'power3.Out',
        opacity: 0,
        x: -300,
      });
    }, text.current);

    return () => ctx.revert();
  }, []);

  return <p ref={text}>{children}</p>;
}
