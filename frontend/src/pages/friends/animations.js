import gsap from 'gsap';

export const runInitAnimation = (tasksLength) => {
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

  gsap.fromTo(
    `[data-animation="friends-animation-2"]`,
    {
      opacity: 0,
      x: window.innerWidth + 200,
      y: -100,
      scale: 0
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.4,
      delay: tasksLength * 0.05,
      ease: 'power1.out'
    }
  );

  gsap.fromTo(
    `[data-animation="friends-animation-3"]`,
    {
      opacity: 0,
      x: 100,
      y: -30,
      scale: 0
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      delay: tasksLength * 0.05 + 0.1,
      ease: 'back.out(0.2)'
    }
  );

  gsap.fromTo(
    `[data-animation="person-animation-1"]`,
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
      delay: tasksLength * 0.05 + 0.13,
      ease: 'back.out(0.2)'
    }
  );
};
