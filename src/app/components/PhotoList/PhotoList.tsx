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

// Utility functions
function getOtherListItems(listItems, currentItem) {
  return [...listItems].filter((i) => i !== currentItem);
}

function getRefElements(refs) {
  return Object.fromEntries(
    Object.entries(refs).map(([key, ref]) => [key, ref.current]),
  );
}

export default function PhotoList() {
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [activePhoto, setActivePhoto] = useState<{
    active: boolean;
    index: number;
  }>({ active: false, index: 0 });

  const refs = {
    photoList: useRef<HTMLDivElement>(null),
    photo: useRef<HTMLDivElement>(null),
    listContainer: useRef<HTMLDivElement>(null),
    photoDescription: useRef<HTMLDivElement>(null),
    photoDescriptionTitle: useRef<HTMLDivElement>(null),
    photoDescriptionCaption: useRef<HTMLDivElement>(null),
  };

  const handleMouseEnter = (index: number) => {
    return () => setPhotoIndex(index);
  };

  useEffect(() => {
    const {
      photoList,
      photo,
      listContainer,
      photoDescription,
      photoDescriptionTitle,
      photoDescriptionCaption,
    } = getRefElements(refs);

    if (
      !photoList ||
      !photo ||
      !listContainer ||
      !photoDescription ||
      !photoDescriptionTitle ||
      !photoDescriptionCaption
    )
      return;

    const backBtn = document.querySelector('.back_btn');
    const listItems =
      listContainer.querySelectorAll<HTMLDivElement>('.title_wrap');
    const bottomLines = listContainer.querySelectorAll('.bottom_line');
    let activeItem: number;

    if (!listItems.length) return;

    const ctx = gsap.context(() => {
      gsap.set(photoDescription, { display: 'none' });

      const clickHandler = (item, index, timeline) => {
        timeline.clear()
        gsap.to(photo, { '--brightness': 1 });
        const otherListItems = getOtherListItems(listItems, item);

        otherListItems.forEach((o) => {
          o.style.pointerEvents = 'none';
        });
        const title = item.querySelector('p');
        if (!title) return;

        const otherTitles = [...listItems].filter(
          (i) => i.querySelector('p') !== title,
        );

        setActivePhoto({ active: true, index });

        const state = Flip.getState(title);
        activeItem = +index;

        timeline.to(bottomLines, { xPercent: 100, opacity: 0 });
        timeline.to(otherTitles, { opacity: 0 }, '<');
        timeline.set(listContainer, { display: 'none' });
        gsap.set(photoDescription, { display: 'flex' });

        if (title?.parentNode === item) {
          photoDescriptionTitle?.appendChild(title);
        }

        timeline.play();
        Flip.from(state, {
          duration: 1,
          ease: 'power1.inOut',
        });

        gsap.from(photoDescriptionCaption, {
          opacity: 0,
          yPercent: 100,
          duration: 0.5,
        });
      };

      const createListItemTimelines = () => {
        const timelines = [];

        listItems.forEach((item, index) => {
          const mouseEnterHandler = handleMouseEnter(index);
          item.addEventListener('mouseenter', mouseEnterHandler);

          const timeline = gsap.timeline({
            paused: true,
            defaults: { duration: 0.5 },
          });

          timelines.push({
            item,
            timeline,
            clickHandler: () => clickHandler(item, index, timeline),
          });
        });

        return timelines;
      };

      const listItemTimelines = createListItemTimelines();

      listItemTimelines.forEach(({ item, clickHandler }) => {
        item.addEventListener('click', clickHandler);
      });

      const backHandler = () => {
        gsap.set(listContainer, { display: 'block' });
        gsap.to(photo, { '--brightness': 0.7 });

        if (!listItemTimelines) return;
        const { timeline, item } = listItemTimelines[activeItem];
        const otherListItems = getOtherListItems(listItems, item);
        const title = document.querySelector('.photo_description_title_wrap p');
        if (!title) return;

        const otherTitles = [...listItems].filter(
          (i) => i.querySelector('p') !== null,
        );

        const state = Flip.getState(title);

        gsap.set(photoDescription, { display: 'none' });

        if (title?.parentNode === photoDescriptionTitle) {
          item.prepend(title);
        }
        timeline.to(bottomLines, { xPercent: 0, opacity: 1 });
        timeline.to(otherTitles, { opacity: 1 }, '<');

        timeline.play();
        Flip.from(state, {
          duration: 1,
          ease: 'power1.inOut',
        });

        setActivePhoto({ active: false, index: activeItem });
        otherListItems.forEach((o) => {
          o.style.pointerEvents = 'auto';
        });
      };

      backBtn?.addEventListener('click', backHandler);
    }, photoList);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className='photo_list_wrap'>
      <div
        ref={refs.photoList}
        className='photo_list_contain flex flex-row items-center justify-between'
      >
        <div ref={refs.photo} className='photo_wrap'>
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
          ref={refs.photoDescription}
          className='photo_description_wrap flex flex-col items-end justify-between'
        >
          <div className='photo_description_header_wrap flex flex-col items-end'>
            <p className='back_btn'>Back</p>
            <div
              ref={refs.photoDescriptionTitle}
              className='photo_description_title_wrap'
            ></div>
          </div>

          <p ref={refs.photoDescriptionCaption}>
            {photos[activePhoto.index].description}
          </p>
        </div>
      </div>

      <div
        ref={refs.listContainer}
        className='list_wrap item-end flex flex-col justify-between'
      >
        {photos.map((photo, i) => {
          return (
            <div
              key={i}
              data-id={i}
              className='title_wrap flex flex-col items-end justify-between'
            >
              <p>{photo.title}</p>
              <div className='bottom_line_wrap'>
                <div className='bottom_line'></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
