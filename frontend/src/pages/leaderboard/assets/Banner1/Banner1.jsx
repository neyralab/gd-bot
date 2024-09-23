import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useWeeklyTimer from '../../../../utils/useWeeklyTimer';
import { getWeekNumber } from '../../../../utils/dates';
import styles from './Banner1.module.css';

export default function Banner1() {
  const { t } = useTranslation('game');
  const timer = useWeeklyTimer();
  const points = 1000000;
  const isHidden = true;

  const week = useMemo(() => {
    const startDate = new Date(Date.UTC(2024, 6, 1, 8));
    return getWeekNumber(startDate);
  }, []);

  return (
    <div className={styles.banner}>
      <div className={styles['banner-image']}>
        <img src="/assets/banner1.png" alt="Week Bonus" />
      </div>
      <div className={styles['banner-description']}>
        {!isHidden && (
          <div className={styles['banner-description__memory']}>56GB</div>
        )}
        <div className={styles['banner-description__title']}>
          <h2>{`${t('leadboard.week')} ${week}: ${t('leadboard.bonus')}`}</h2>
        </div>
        <div className={styles['banner-description__points']}>
          <span>{points.toLocaleString()}</span>
          <span>{t('leadboard.points')}</span>
        </div>
        <div className={styles['banner-description__timer']}>{timer}</div>
      </div>
    </div>
  );
}
