import gsap from "gsap";

export const animateButton = (button) => {
  gsap.fromTo(
    button,
    { scale: 1 },
    { scale: 0.7, duration: 0.15, ease: 'power1.inOut', yoyo: true, repeat: 1 }
  );
};
