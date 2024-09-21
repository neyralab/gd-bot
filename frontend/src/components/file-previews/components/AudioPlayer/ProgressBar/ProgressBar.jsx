import React, { useMemo } from 'react';
import styles from './ProgressBar.module.scss';

export default function ProgressBar({ radius, progress, handleProgressClick }) {
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  return (
    <div
      style={{ height: `${radius * 2}px` }}
      className={styles['progress-container']}
      onClick={handleProgressClick}>
      <svg
        className={styles['circle-audio-svg']}
        width={`${radius * 2}px`}
        height={`${radius * 2}px`}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: '#00F2FE', stopOpacity: 0.3 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#00F2FE', stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        <circle
          className={styles['progress-background']}
          cx={radius}
          cy={radius}
          r={radius}
          strokeWidth="4"
        />

        <circle
          className={styles['progress']}
          cx={radius}
          cy={radius}
          r={radius}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={
            isNaN(circumference - (progress / 100) * circumference)
              ? '0'
              : circumference - (progress / 100) * circumference
          }
        />
      </svg>

      <div
        className={styles['indicator']}
        style={{
          transform: `rotate(${(progress / 100) * 360}deg) translate(0, -${radius}px)`
        }}>
        <div className={styles['indicator-dot']}></div>
      </div>
    </div>
  );
}
