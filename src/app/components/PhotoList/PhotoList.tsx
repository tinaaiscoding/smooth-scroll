import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import './PhotoList.css';

const photos = [
  {
    title: 'Brooklyn Bridge',
    imageSrc: '/images/brooklyn-bridge.jpg',
    description: '2001 Oliver Williams',
  },
  {
    title: 'Chrysler Building',
    imageSrc: '/images/chrysler-building.jpg',
    description: '2013, Charlotte Johnson',
  },
  {
    title: 'George W. Bridge',
    imageSrc: '/images/george-washington-bridge.jpg',
    description: '2005, Ava Ambrose',
  },
  {
    title: 'Statue of Liberty',
    imageSrc: '/images/statue-of-liberty.jpg',
    description: '2017, Jack Banks',
  },
];

gsap.registerPlugin(Flip);

export default function PhotoList() {
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [activePhoto, setActivePhoto] = useState({ active: false, index: 0 });

  const photoList = useRef<HTMLDivElement>(null);
  const photoDescription = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (index: number) => {
    setPhotoIndex(index);
  };

  const handleBackClick = () => {
    setActivePhoto({ ...activePhoto, active: false });
  };

  useEffect(() => {
    if (!photoList.current) return;

    const listItems = photoList.current?.querySelectorAll('.title_wrap');

    const ctx = gsap.context(() => {
      const createListItemTimelines = () => {
        const timelines = [];

        listItems.forEach((item, i) => {
          const otherListItems = [...listItems].filter((li) => li !== item);

          const timeline = gsap.timeline({
            paused: true,
            defaults: { duration: 1 },
          });

          timeline.to(item, {
            top: 0,
            backgroundColor: 'red',
          });
          timeline.to(otherListItems, { opacity: 0 }, 0);

          const clickHandler = () => {
            console.log('click');

            const state = Flip.getState(item);

            if (item.parentNode === list.current) {
              photoDescription.current?.appendChild(item);
            } else {
              list.current?.appendChild(item);
            }

            Flip.from(state, {
              duration: 1,
              ease: 'power1.inOut',
            });

            timeline
              .timeScale(1)
              .play()
              .eventCallback('onComplete', () => {
                setActivePhoto({ active: true, index: i });
              });
          };

          timelines.push({ item, timeline, clickHandler });
        });

        return timelines;
      };

      const listItemTimelines = createListItemTimelines();

      listItemTimelines.forEach(({ item, clickHandler }) => {
        item.addEventListener('click', clickHandler);
      });
    }, photoList.current);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={photoList}
      className='photo_list_wrap flex flex-row items-center justify-between'
    >
      <div className='photo_wrap'>
        <Image
          src={photos[photoIndex].imageSrc}
          alt={photos[photoIndex].title}
          fill={true}
        />
      </div>

      <div
        ref={photoDescription}
        className='list_wrap item-end flex flex-col justify-between'
      >
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

      <div
        ref={list}
        className='photo_description_wrap flex flex-col items-end justify-between'
      >
        <p onClick={handleBackClick}>Back</p>
        <p>{photos[activePhoto.index].description}</p>
      </div>
    </div>
  );
}
