import gsap from 'gsap';

export const runInitAnimation = () => {
  gsap.fromTo(
    `[data-animation="task-animation-1"]`,
    {
      opacity: 0,
      x: window.innerWidth + 200,
      y: -window.innerHeight + 500,
      scale: 0
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      stagger: 0.05,
      duration: 0.5,
      ease: 'back.out(0.2)'
    }
  );
};
