import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect
} from 'react';
import classNames from 'classnames';
import styles from './Background.module.css';

const Background = forwardRef(({ theme }, ref) => {
  const starsRef = useRef(null);
  const glowRef = useRef(null);
  const object1Ref = useRef(null);
  const object2Ref = useRef(null);
  const planetRef = useRef(null);

  const requestAnimationRef = useRef();
  const speedRef = useRef(0.01); // I'm using ref instead of useState ON PURPOSE! It won't work with useState because of js closures in animate function
  const distanceRef = useRef(0); // I'm using ref instead of useState ON PURPOSE! It won't work with useState because of js closures in animate function
  const lastClickTimeRef = useRef(Date.now()); // I'm using ref instead of useState ON PURPOSE! It won't work with useState because of js closures in animate function
  const thenRef = useRef(Date.now());

  const maxSpeed = 1;
  const decreaseInterval = 2000; //  decrease coef to 0
  const noClickTimeout = 1000;
  const fps = 60; // The max frame rate
  const fpsInterval = 1000 / fps; // The interval between frames in milliseconds

  const animate = () => {
    if (
      !starsRef.current ||
      !glowRef.current ||
      !object1Ref.current ||
      !object2Ref.current ||
      !planetRef.current
    )
      return;

    const now = Date.now();
    const elapsed = now - thenRef.current;

    if (elapsed > fpsInterval) {
      thenRef.current = now - (elapsed % fpsInterval);

      distanceRef.current += speedRef.current; // Increment distance by the current speed

      starsRef.current.style.backgroundPosition = `50% ${-distanceRef.current}%`;
      glowRef.current.style.backgroundPosition = `50% ${-distanceRef.current * 0.1}%`;
      object1Ref.current.style.backgroundPosition = `50% ${-distanceRef.current * 0.3}%`;
      object2Ref.current.style.backgroundPosition = `50% ${-distanceRef.current * 0.5}%`;
      planetRef.current.style.backgroundPosition = `50% ${-distanceRef.current * 0.15}%`;
    }

    requestAnimationRef.current = requestAnimationFrame(animate);
  };

  const runAnimation = () => {
    if (requestAnimationRef.current) {
      cancelAnimationFrame(requestAnimationRef.current);
    }

    lastClickTimeRef.current = Date.now();
    const newSpeed = Math.min(speedRef.current + 0.1, maxSpeed);
    speedRef.current = newSpeed;

    requestAnimationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Date.now() - lastClickTimeRef.current > noClickTimeout) {
        const newSpeed =
          speedRef.current - (speedRef.current / decreaseInterval) * 100;
        speedRef.current = newSpeed;
        if (newSpeed <= 0.01) {
          // Stop the animation
          cancelAnimationFrame(requestAnimationRef.current);
          requestAnimationRef.current = null;
        }
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(requestAnimationRef.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    runAnimation: runAnimation
  }));

  return (
    <div
      className={classNames(
        styles.container,
        theme === 'gold' ? styles.gold : styles.default
      )}>
      <div ref={starsRef} className={styles.stars}></div>
      <div ref={glowRef} className={styles.glow}></div>
      <div ref={object1Ref} className={styles.object1}></div>
      <div ref={object2Ref} className={styles.object2}></div>
      <div ref={planetRef} className={styles.planet}></div>
    </div>
  );
});

export default Background;
