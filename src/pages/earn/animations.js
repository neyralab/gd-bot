import gsap from 'gsap';

export const runInitAnimation = () => {
  gsap.fromTo(
    `[data-animation="segmented-animation-1"]`,
    {
      opacity: 0,
      x: 0,
      y: -30,
      scale: 0
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      delay: 0.2,
      ease: 'back.out(0.2)'
    }
  );
};