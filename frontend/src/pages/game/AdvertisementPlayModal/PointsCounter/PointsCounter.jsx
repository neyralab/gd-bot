import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './PointsCounter.module.scss';

export default function PointsCounter({ duration, timeLeft, totalPoints }) {
  const [points, setPoints] = useState(0);
  const [prevPoints, setPrevPoints] = useState(0);
  const pointsRef = useRef(null);
  const prevPointsRef = useRef(null);

  useEffect(() => {
    if (duration > 0) {
      const calculatedPoints = ((duration - timeLeft) / duration) * totalPoints;
      setPrevPoints(points);
      setPoints(calculatedPoints);
    }
  }, [duration, timeLeft, totalPoints]);

  useEffect(() => {
    if (pointsRef.current && prevPointsRef.current) {
      gsap.fromTo(
        prevPointsRef.current,
        { y: 0 },
        { y: -20, duration: 0.2, onComplete: () => setPrevPoints(points) }
      );
      gsap.fromTo(pointsRef.current, { y: 20 }, { y: 0, duration: 0.1, ease: "power1.inOut" });
    }
  }, [points]);

  return (
    <div className={styles.container}>
      <span className={styles.description}>Points:</span>

      <div className={styles.pointsWrapper}>
        <div className={styles.prevPoints} ref={prevPointsRef}>
          {Math.round(prevPoints)}
        </div>

        <div className={styles.points} ref={pointsRef}>
          {Math.round(points)}
        </div>
      </div>
    </div>
  );
}
