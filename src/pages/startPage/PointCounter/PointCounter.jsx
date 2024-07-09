import React from 'react';
import CN from 'classnames';
import CountUp from 'react-countup';

import styles from './PointCounter.module.css';

export default function PointCounter({ points, className, onClick, rank }) {
  return (
    <div
      className={CN(styles['point-counter'], styles['to-appear'], className)}
      onClick={onClick}
    >
      <CountUp className={styles['counter']} delay={1} end={points} />
      <span className={styles['name']}>
        {`Rank: ${rank}`}
      </span>
    </div>
  );
}
