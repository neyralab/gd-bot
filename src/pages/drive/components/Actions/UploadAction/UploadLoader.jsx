import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const UploadLoader = () => {
  const circlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const circles = circlesRef.current;

    const animateToBlue = () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      animationRef.current = gsap.to(circles, {
        fill: '#007DE9',
        duration: 0.2,
        stagger: 0.08,
        onComplete: () => {
          setTimeout(() => {
            animateToGray();
          }, 500);
        }
      });
    };

    const animateToGray = () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      animationRef.current = gsap.to(circles, {
        fill: '#4D4D4D',
        duration: 0.5,
        stagger: 0.08,
        onComplete: () => {
          animateToBlue();
        }
      });
    };

    animateToBlue();

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <svg width="64" height="64" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle ref={el => circlesRef.current[0] = el} cx="31" cy="2" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[1] = el} cx="38.5" cy="3.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[2] = el} cx="45.5" cy="6.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[3] = el} cx="51.5" cy="10.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[4] = el} cx="56" cy="16" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[5] = el} cx="58.5" cy="23.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[6] = el} cx="60" cy="31" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[7] = el} cx="58.5" cy="38.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[8] = el} cx="56" cy="46" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[9] = el} cx="51.5" cy="51.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[10] = el} cx="45.5" cy="55.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[11] = el} cx="38.5" cy="58.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[12] = el} cx="31" cy="60" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[13] = el} cx="23.5" cy="58.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[14] = el} cx="16" cy="56" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[15] = el} cx="10.5" cy="51.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[16] = el} cx="6.5" cy="45.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[17] = el} cx="3.5" cy="38.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[18] = el} cx="2" cy="31" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[19] = el} cx="3.5" cy="23.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[20] = el} cx="6.5" cy="16" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[21] = el} cx="10.5" cy="10.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[22] = el} cx="16" cy="6" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[23] = el} cx="23.5" cy="3.5" r="2.5" fill="#4D4D4D" />
      <circle ref={el => circlesRef.current[24] = el} cx="31" cy="2" r="2.5" fill="#4D4D4D" />
    </svg>
  );
};

export default UploadLoader;
