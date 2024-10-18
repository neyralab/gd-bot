import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../store/reducers/game/game.selectors';
import styles from './PointsGrowArea.module.css';

const PointsGrowArea = forwardRef((_, ref) => {
  const containerRef = useRef(null);
  const theme = useSelector(selectTheme);

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
