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
  const list = useRef<HTMLDivElement>(null);
  const photoDescription = useRef<HTMLDivElement>(null);
  const photoDescriptionTitle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!photoList.current || !list.current) return;
    gsap.set(photoDescription.current, { display: 'none' });
    const listItems = list.current.querySelectorAll('.title_wrap');

    const handleMouseEnter = (index: number) => {
      return () => setPhotoIndex(index);
    };

    if (!listItems.length) return;

    let activeItem: number;

    const createListItemTimelines = () => {
      const timelines = [];

      listItems.forEach((item, i) => {
        const mouseEnterHandler = handleMouseEnter(i);
        item.addEventListener('mouseenter', mouseEnterHandler);

        const title = item.querySelector('p');
        if (!title) return;

        const timeline = gsap.timeline({
          paused: true,
          defaults: { duration: 1 },
        });

        const clickHandler = (e) => {
          gsap.set(photoDescription.current, { display: 'flex' });
          activeItem = +i;
          timeline.to(listItems, { opacity: 0 });
          timeline.set(list.current, { display: 'none' }, '<');

          const state = Flip.getState(title);
          if (title?.parentNode === item) {
            photoDescriptionTitle.current?.appendChild(title);
          }

          Flip.from(state, {
            duration: 1,
            ease: 'power1.inOut',
          });

          timeline.play().eventCallback('onComplete', () => {
            setActivePhoto({ active: true, index: i });
          });
        };

        timelines.push({ item, timeline, clickHandler });
      });

      return timelines;
    };

    const backHandler = () => {
      const { timeline, item } = listItemTimelines[activeItem];
      const title = document.querySelector('.photo_description_title_wrap p');

      const state = Flip.getState(title);

      if (title?.parentNode === photoDescriptionTitle.current) {
        item.append(title);
      }

      timeline.set(list.current, { display: 'block' });
      timeline.to(listItems, { opacity: 1 });
      timeline.set(photoDescription.current, { display: 'none' });

      timeline.play().eventCallback('onComplete', () => {
        setActivePhoto({ active: false, index: activeItem });
      });

      Flip.from(state, {
        duration: 1,
        ease: 'power1.inOut',
      });
    };

    const listItemTimelines = createListItemTimelines();

    listItemTimelines.forEach(({ item, clickHandler }) => {
      item.addEventListener('click', clickHandler);
    });

    document.querySelector('.back_btn')?.addEventListener('click', backHandler);

    return () => {};
  }, []);

  return (
    <div className='photo_list_wrap'>
      <div
        ref={photoList}
        className='photo_list_contain flex flex-row items-center justify-between'
      >
        <div className='photo_wrap'>
          <Image
            src={
              photos[activePhoto.active ? activePhoto.index : photoIndex]
                .imageSrc
            }
            alt={photos[photoIndex].title}
            fill={true}
          />
        </div>

        <div
          ref={photoDescription}
          className='photo_description_wrap flex flex-col items-end justify-between'
        >
          <p className='back_btn'>Back</p>
          <div
            ref={photoDescriptionTitle}
            className='photo_description_title_wrap'
          ></div>
          <p>{photos[activePhoto.index].description}</p>
        </div>
      </div>

      <div
        ref={list}
        className='list_wrap item-end flex flex-col justify-between'
      >
        {photos.map((photo, i) => {
          return (
            <div
              key={i}
              data-id={i}
              className='title_wrap flex flex-row items-center justify-end'
            >
              <p>{photo.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
