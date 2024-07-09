import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect
} from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import {
  selectNextTheme,
  selectTheme
} from '../../../store/reducers/gameSlice';
import styles from './Background.module.css';

const Background = forwardRef((_, ref) => {
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

  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);

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
    let timeout1;
    let timeout2;

    if (nextTheme.theme) {
      glowRef.current.classList.remove(styles['next-theme-appear']);
      planetRef.current.classList.remove(styles['next-theme-appear']);

      glowRef.current.classList.add(styles['current-theme-dissapear']);
      planetRef.current.classList.add(styles['current-theme-dissapear']);

      timeout1 = setTimeout(() => {
        glowRef.current.style.opacity = 0;
        planetRef.current.style.opacity = 0;
      }, 490); // to avoid flickering
    } else {
      glowRef.current.classList.remove(styles['current-theme-dissapear']);
      planetRef.current.classList.remove(styles['current-theme-dissapear']);

      glowRef.current.classList.add(styles['next-theme-appear']);
      planetRef.current.classList.add(styles['next-theme-appear']);

      timeout2 = setTimeout(() => {
        glowRef.current.style.opacity = 1;
        planetRef.current.style.opacity = 1;
      }, 990); // to avoid flickering
    }

    return () => {
      if (timeout1) {
        clearTimeout(timeout1);
      }
      if (timeout2) {
        clearTimeout(timeout2);
      }
    };
  }, [nextTheme.theme]);

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
    <div className={classNames(styles.container, theme && styles[theme.id])}>
      <div
        ref={starsRef}
        className={styles.stars}
        style={{
          backgroundImage: `url('/assets/game-page/stars.png')`
        }}></div>
      <div
        ref={glowRef}
        className={styles.glow}
        style={{
          backgroundImage: `url('/assets/game-page/glow-${theme.id}.png')`
        }}></div>
      <div
        ref={object1Ref}
        className={styles.object1}
        style={{
          backgroundImage: `url('/assets/game-page/object1.png')`
        }}></div>
      <div
        ref={object2Ref}
        className={styles.object2}
        style={{
          backgroundImage: `url('/assets/game-page/object2.png')`
        }}></div>
      <div
        ref={planetRef}
        className={styles.planet}
        style={{
          backgroundImage: `url('/assets/game-page/planet-${theme.id}.png')`
        }}></div>
    </div>
  );
});

export default Background;
