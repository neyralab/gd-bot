import gsap from 'gsap';

export const runListAnimation = () => {
  gsap.fromTo(
    `[data-animation="game-item-animation-1"]`,
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
      delay: 0,
      ease: 'back.out(0.2)'
    }
  );
};

export const runInitAnimation = () => {
  gsap.fromTo(
    `[data-animation="games-search-animation-1"]`,
    {
      opacity: 0,
      y: -100,
      scale: 0
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(0.2)'
    }
  );
};
