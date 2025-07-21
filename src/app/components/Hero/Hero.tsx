import Image from 'next/image';

import './Hero.css';

export default function Hero() {
  return (
    <div className='hero_wrap flex flex-col items-center justify-center'>
      <div className='hero_bg_image_wrap'>
        <Image
          src={'/images/pexels-vinta-supply-co-nyc-268013-842948.jpg'}
          alt='nyc'
          fill={true}
        />
      </div>
      <div data-scroll data-scroll-speed='0.3' className='hero_image_wrap'>
        <Image
          src={'/images/pexels-diogo-miranda-2044514-27068594.jpg'}
          alt='nyc'
          fill={true}
        />
      </div>
      <h2 data-scroll data-scroll-speed='0.7'>
        Smooth scroll
      </h2>
    </div>
  );
}
