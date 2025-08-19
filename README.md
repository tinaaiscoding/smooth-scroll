# Smooth scroll + PhotoList animation
This project started as a follow-along with the [Smooth Scroll tutorial](https://blog.olivierlarose.com/tutorials/smooth-scroll), but I wanted to make the photo list component interactive. The photo list still includes the original mouseover effects, with the addition of a smooth transition when clicking a photo title and animating in the next component.

## Demo

---

## Tech Stack
- Next.js (React framework)  
- TypeScript  
- GSAP
- CSS / Tailwind
- Locomotive Scroll

---
## Features
- Hover to preview different photos
- Click a title to animate into single photo view using **GSAP Flip**  
- Animated captions and smooth back button transition  
- Uses CSS custom properties for brightness control 
- Uses Locomotive Scroll to create quick and easy parallax scroll effect.

---
## What I Learned
- How to use **GSAP Flip** to capture and animate DOM states  
- The importance of capturing Flip states *before* DOM changes  
- Managing refs cleanly in React for GSAP animations  
- Using CSS variables with GSAP (`--brightness`) to avoid janky transitions  
- Structuring reusable utility functions (e.g., filtering list items, handling refs)  
- How to use DevTools to view event listeners.

---

## Challenges & Solutions
- **Problem:** Event listeners were not being cleaned up properly causing unwanted animation behaviour
  - **Solution:** Used gsap context to scope things properly, and made sure the clean up was running properly on unmount/re-render. Used DevTools to assist with debug the event listeners
- **Problem:** Brightness animation was jumping from 70% → 0% → 100%  
  - **Solution:** Used a CSS variable (`--brightness`) instead of directly animating `filter`  
- **Problem:** Handling smooth back transitions with Flip  
  - **Solution:** Ensured that the DOM existed at the time the transition was running.
- **Problem:** The mouseover effect was still active after clicking a photo title, causing the displayed photo to change on hover when it should have only shown the photo for the clicked title.
  - **Solution:** Updated state to track the photo index of the clicked title and set the pointer events of all other titles to `none`.

## Run Locally
```
git clone https://github.com/tinaaiscoding/smooth-scroll.git
cd smooth-scroll
npm install
npm run dev
```

## Credits / Acknowledgements
- Thank you to Olivier Lacrose for the tutorial!
  - [Smooth Scroll tutorial](https://blog.olivierlarose.com/tutorials/smooth-scroll)
  - [Original live demo](https://blog.olivierlarose.com/demos/smooth-scroll)