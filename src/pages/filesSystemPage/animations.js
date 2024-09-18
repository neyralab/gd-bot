import { gsap } from 'gsap';

export const runInitAnimation = () => {
  gsap.fromTo(
    `[data-animation="drive-grid-animation-1"]`,
    {
      opacity: 0,
      scale: 0.5,
      y: -50
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: 'back.out(0.5)'
    }
  );

  gsap.fromTo(
    `[data-animation="drive-grid-animation-2"]`,
    {
      opacity: 0,
      scale: 0.5,
      y: 50
    },
    {
      delay: 0.7,
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: 'back.out(0.5)'
    }
  );
};

export const runStorageAnimation = () => {
  gsap.fromTo(
    `[data-animation="drive-grid-animation-3"]`,
    {
      opacity: 0,
      scale: 0.8,
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
