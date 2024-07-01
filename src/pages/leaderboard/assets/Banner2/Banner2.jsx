import React, { useMemo } from 'react';
import useWeeklyTimer from '../../../../utils/useWeeklyTimer';
import { getWeekNumber } from '../../../../utils/dates';
import styles from './Banner2.module.css';

export default function Banner2() {
  const timer = useWeeklyTimer();
  const points = 25000;

  const week = useMemo(() => {
    return getWeekNumber(new Date(Date.UTC(2024, 6, 1)));
  }, []);

  return (
    <div className={styles.banner}>
      <div className={styles['banner-image']}>
        <img src="/assets/banner2.png" alt="Week Bonus" />
      </div>
      <div className={styles['banner-description']}>
        <div className={styles['banner-description__title']}>
          <h2>Week {week}: Bonus</h2>
        </div>
        <div className={styles['banner-description__points']}>
        <span>{points.toLocaleString()}</span>
        </div>
        <div className={styles['banner-description__timer']}>{timer}</div>
      </div>
    </div>
  );
}
