import React from 'react';
import styles from './Timer.module.scss';

export default function Timer({ duration, timeLeft }) {
  if (!duration) return;

  return (
    <div className={styles.timer}>
      {`${Math.floor(timeLeft / 60)}:${Math.floor(timeLeft % 60)
        .toString()
        .padStart(2, '0')}`}
    </div>
  );
}
