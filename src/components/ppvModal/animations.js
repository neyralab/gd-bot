import gsap from 'gsap';

export const runInitAnimation = () => {
  gsap.fromTo(
    `[data-animation="ppv-counter-animation-1"]`,
    {
      opacity: 0,
      x: (index) => (index % 2 === 0 ? -600 : 600),
      scale: 0.2
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      delay: 0.2,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power4.out'
    }
  );

  gsap.fromTo(
    `[data-animation="ppv-textarea-animation-1"]`,
    {
      opacity: 0,
      scale: 0.6,
      y: 100
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      delay: 0.5,
      duration: 0.7,
      ease: 'power4.out'
    }
  );

  gsap.fromTo(
    `[data-animation="ppv-footer-animation-1"]`,
    {
      opacity: 0,
      x: -100
    },
    {
      opacity: 1,
      x: 0,
      delay: 1,
      duration: 1.5,
      ease: 'power1.out'
    }
  );

  gsap.fromTo(
    `[data-animation="ppv-footer-animation-2"]`,
    {
      opacity: 0,
      scale: 0.9,
      y: 200
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      delay: 0.5,
      duration: 0.8,
      ease: 'power2.out'
    }
  );
};

export const animateButton = (button) => {
  gsap.fromTo(
    button,
    { scale: 1 },
    { scale: 0.9, duration: 0.05, ease: 'bounce.out', yoyo: true, repeat: 1 }
  );
};
