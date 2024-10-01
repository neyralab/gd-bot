import gsap from 'gsap';

export const fadeIn = (windowModel) => {
  windowModel.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      gsap.to(child.material, {
        opacity: 1,
        duration: 0.5,
        ease: 'power1.inOut'
      });
    }
  });
};

export const fadeOut = (windowModel) => {
  windowModel.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = true;
      gsap.to(child.material, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.inOut'
      });
    }
  });
};
