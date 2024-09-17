import React from 'react';
import styles from './SliderDots.module.scss';

export default function SliderDots({ totalPages, currentPage }) {
  if (totalPages <= 1) return null;

  const dots = [];
  for (let i = 1; i <= totalPages; i++) {
    const scale = 1 - Math.min(Math.abs(currentPage - i) * 0.15, 1);
    const opacity = 1 - Math.min(Math.abs(currentPage - i) * 0.3, 1);
    dots.push(
      <div
        key={i}
        className={`${styles.dot} ${i === currentPage ? styles.active : ''}`}
        style={{ transform: `scale(${scale})`, opacity: opacity }}
      />
    );
  }

  const containerWidth = 300; // Width of the visible area for dots
  const dotWidth = 14; // Width of each dot including margin
  const totalDotsWidth = totalPages * dotWidth;
  const maxOffset = Math.max(totalDotsWidth - containerWidth, 0);
  const offset = Math.min(
    (currentPage - 1) * dotWidth - containerWidth / 2 + dotWidth / 2,
    maxOffset
  );

  return (
    <div className={styles['dots-container']}>
      <div
        className={styles['dots-inner-container']}
        style={{ transform: `translateX(${-offset}px)` }}>
        {dots}
      </div>
    </div>
  );
}
