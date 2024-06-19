import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import styles from './PointsGrowArea.module.css';

const PointsGrowArea = forwardRef(({ theme }, ref) => {
  const containerRef = useRef(null);

  const runAnimation = () => {
    // Create a new span element with the points class
    const point = document.createElement('span');
    point.className = styles.points;
    point.textContent = `+${theme.multiplier}`;

    // Generate random top and left values
    const top = Math.random() * 100;
    const left = Math.random() * 100;

    // Apply the random positions to the point element
    point.style.top = `${top}%`;
    point.style.left = `${left}%`;

    // Append the point to the container
    if (containerRef.current) {
      containerRef.current.appendChild(point);
    }

    // Schedule to remove the point after 1 second
    setTimeout(() => {
        if (point.parentNode) {
          point.parentNode.removeChild(point);
        }
      }, 1000);
  };

  useImperativeHandle(ref, () => ({
    runAnimation: runAnimation
  }));

  return <div ref={containerRef} className={styles.container}></div>;
});

export default PointsGrowArea;
