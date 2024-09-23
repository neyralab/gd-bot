import gsap from 'gsap';

export const runInitAnimation = () => {
  gsap.fromTo(
    `[data-animation="tab-animation-1"]`,
    {
      opacity: 0,
      y: -100,
      scale: 0
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.1,
      duration: 0.5,
      delay: 0,
      ease: 'back.out(0.2)'
    }
  );

  gsap.fromTo(
    `[data-animation="history-animation-1"]`,
    {
      opacity: 0,
      x: 20,
      scale: 0.7
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.5,
      delay: 0.25,
      ease: 'back.out(0.2)'
    }
  );

  gsap.fromTo(
    `[data-animation="no-history-animation-1"]`,
    {
      opacity: 0,
      y: 20,
      scale: 1
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      delay: 0.15,
      ease: 'power1.out'
    }
  );
};
