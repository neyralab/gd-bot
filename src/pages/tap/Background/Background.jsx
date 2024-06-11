import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect
} from 'react';
import styles from './Background.module.css';

const Background = forwardRef((_, ref) => {
  const containerRef = useRef(null);
  const requestAnimationRef = useRef();
  const speedRef = useRef(0.02); // I'm using ref instead of useState ON PURPOSE! It won't work with useState because of js closures in animate function
  const maxSpeed = 3;
  const decreaseInterval = 2000; //  decrease coef to 0
  const noClickTimeout = 1000;
  let lastClickTime = Date.now();
  let yPos = 0;

  const animate = () => {
    yPos += speedRef.current; // Increment yPos by the current speed
    if (containerRef.current) {
      containerRef.current.style.backgroundPosition = `50% ${-yPos}%`;
    }
    requestAnimationRef.current = requestAnimationFrame(animate);
  };

  const runAnimation = () => {
    lastClickTime = Date.now();
    const newSpeed = Math.min(speedRef.current + 0.2, maxSpeed);
    speedRef.current = newSpeed;
    if (!requestAnimationRef.current) {
      requestAnimationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Date.now() - lastClickTime > noClickTimeout) {
        const newSpeed = Math.max(
          speedRef.current - (speedRef.current / decreaseInterval) * 50,
          0
        );
        speedRef.current = newSpeed;

        if (newSpeed <= 0.01) {
          // Stop the animation
          cancelAnimationFrame(requestAnimationRef.current);
          requestAnimationRef.current = null;
        }
      }
    }, 50);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(requestAnimationRef.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    runAnimation: runAnimation
  }));

  return <div ref={containerRef} className={styles.container}></div>;
});

export default Background;
