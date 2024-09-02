import gsap from 'gsap';

export const runInitAnimation = () => {
  gsap.fromTo(
    `[data-animation="statistics-animation-1"]`,
    {
      opacity: 0,
      x: 50,
      y: -50,
      scale: 0
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(0.2)'
    }
  );
};
