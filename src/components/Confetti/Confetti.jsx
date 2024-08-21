import React, { useRef, useEffect } from 'react';
import { gsap, Linear, Sine } from 'gsap';
import styles from './Confetti.module.scss';

const colors = ['#DF4678', '#00CECB', '#995AE2', '#FFC857', '#CA3B4E'];

const getRandomNumber = (max) => Math.random() * max;
const getRandomInRange = (min, max) =>
  min + Math.floor(Math.random() * (max - min));

const Confetti = ({ onClick }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    runAnimation();
  }, []);

  const runAnimation = () => {
    const confettiContainer = containerRef.current;
    const total = 100;
    const w = confettiContainer.offsetWidth;
    const h = confettiContainer.offsetHeight;

    for (let i = 0; i < total; i++) {
      const div = document.createElement('div');
      div.classList.add(styles.dot);
      div.style.background = colors[getRandomInRange(0, colors.length)];
      confettiContainer.appendChild(div);

      gsap.set(div, {
        x: getRandomNumber(w),
        y: getRandomInRange(-200, -100), // Start above the visible area
        opacity: 1,
        scale: getRandomNumber(0.8) + 0.4,
        backgroundColor: `hsl(${getRandomInRange(170, 360)}, 50%, 50%)`
      });

      animateDot(div, h);
    }

    function animateDot(elm, containerHeight) {
      gsap.set(confettiContainer, { display: 'block' });

      gsap.to(elm, {
        y: containerHeight + 100, // Move below the bottom line
        ease: Linear.easeNone,
        delay: 0,
        duration: getRandomNumber(3) + 1,
        repeat: 0
      });

      gsap.to(elm, {
        x: '+=70',
        ease: Sine.easeInOut,
        duration: getRandomNumber(5) + 1,
        repeat: 1
      });

      gsap.to(elm, {
        scaleX: 0.2,
        rotation: getRandomNumber(360),
        ease: Sine.easeInOut,
        duration: getRandomNumber(2) + 1,
        repeat: 1
      });
    }
  };

  return (
    <div onClick={onClick} ref={containerRef} className={styles.container}>
      <div className={styles.confetti}></div>
    </div>
  );
};

export default Confetti;
