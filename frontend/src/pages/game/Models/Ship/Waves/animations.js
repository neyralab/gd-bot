import gsap from 'gsap';

export const waveAnimation = (circleRef, id, onComplete) => {
  gsap.fromTo(
    circleRef.current.scale,
    { x: 0, y: 0, z: 0 },
    {
      x: 0.17,
      y: 0.17,
      z: 0.17,
      duration: 1,
      onComplete: () => {
        onComplete?.(id);
      }
    }
  );

  gsap.to(circleRef.current.material, {
    opacity: 0,
    delay: 0.2,
    duration: 0.6
  });
  
  gsap.to(circleRef.current.material, {
    emissiveIntensity: 0,
    delay: 0.2,
    duration: 0.6
  });
};
