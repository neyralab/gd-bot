import { gsap } from 'gsap';

export const runInitAnimation = () => {
  gsap.fromTo(
    `[data-animation="search-animation-1"]`,
    {
      opacity: 0,
      scale: 0.5,
      x: 100
    },
    {
      opacity: 1,
      scale: 1,
      x: 0,
      duration: 0.5,
      ease: 'back.out(0.5)'
    }
  );

  gsap.fromTo(
    `[data-animation="storage-animation-1"]`,
    {
      opacity: 0,
      scale: 1,
      y: -20,
      x: 200
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      duration: 0.3,
      delay: 0.1,
      ease: 'back.out(0.5)'
    }
  );
};