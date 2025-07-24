import Image from 'next/image';
import { useState } from 'react';

import './PhotoList.css';

const photos = [
  {
    title: 'Brooklyn Bridge',
    imageSrc: '/images/brooklyn-bridge.jpg',
  },
  {
    title: 'Chrysler Building',
    imageSrc: '/images/chrysler-building.jpg',
  },
  {
    title: 'George W. Bridge',
    imageSrc: '/images/george-washington-bridge.jpg',
  },
  {
    title: 'Statue of Liberty',
    imageSrc: '/images/statue-of-liberty.jpg',
  },
];

export default function PhotoList() {
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  const handleMouseEnter = (index: number) => {
    setPhotoIndex(index);
  };

  return (
    <div className='photo_list_wrap flex flex-row items-center justify-between'>
      <div className='photo_wrap'>
        <Image
          src={photos[photoIndex].imageSrc}
          alt={photos[photoIndex].title}
          fill={true}
        />
      </div>
      <div className='list_wrap item-end flex flex-col justify-between'>
        {photos.map((photo, i) => {
          return (
            <div
              key={i}
              className='title_wrap flex flex-row items-center justify-end'
              onMouseEnter={() => handleMouseEnter(i)}
            >
              <p>{photo.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
