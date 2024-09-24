import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Token.module.scss';

export default function Token({ targetPosition, onComplete }) {
  const tokenRef = useRef(null);

  useLayoutEffect(() => {
    if (!tokenRef.current) return;
    const initialPosition = {
      x: Math.random() * window.innerWidth,
      y: -20
    };
    const randomScale = Math.random() * 0.3 + 0.7; // Random scale between 0.7 and 1
    const randomRotation = Math.random() * 720; // Random rotation between 0 and 720 degrees

    gsap.fromTo(
      tokenRef.current,
      {
        x: initialPosition.x,
        y: initialPosition.y,
        scale: randomScale,
        rotation: 0
      },
      {
        x: targetPosition.x,
        y: targetPosition.y,
        scale: 1,
        rotation: randomRotation,
        duration: 0.5,
        ease: 'linear',
        onComplete: onComplete
      }
    );
  }, []);

  return (
    <div ref={tokenRef} className={styles.container}>
      <img src="/assets/token.png" alt="token" />
    </div>
  );
}
