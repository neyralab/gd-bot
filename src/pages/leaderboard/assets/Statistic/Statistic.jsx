import React, { useEffect } from 'react';
import CN from 'classnames';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { formatLargeNumberExtended } from '../../../../utils/number.js';

import styles from './Statistic.module.css';

export default function Statistic({ totalTaps, totalPoints, totalUsers }) {
  const { t } = useTranslation('game');

  useEffect(() => {
    /** Animation */
    gsap.fromTo(
      `[data-animation="statistics-animation-1"]`,
      {
        opacity: 0,
        x: 50,
        y: -50,
        scale: 0
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(0.2)'
      }
    );
  }, []);

  return (
    <div className={styles.container}>
      <div data-animation="statistics-animation-1" className={styles.section}>
        <p className={styles.title}>{t('leadboard.totalUsers')}</p>
        <span className={CN(styles.value, styles.green)}>
          {totalUsers && formatLargeNumberExtended(totalUsers)}
        </span>
      </div>

      <div data-animation="statistics-animation-1" className={styles.section}>
        <p className={styles.title}>{t('leadboard.totalPoints')}</p>
        <span className={CN(styles.value, styles.yellow)}>
          {totalPoints && formatLargeNumberExtended(totalPoints)}
        </span>
      </div>

      <div data-animation="statistics-animation-1" className={styles.section}>
        <p className={styles.title}>{t('leadboard.totalTaps')}</p>
        <span className={CN(styles.value, styles.blue)}>
          {totalTaps && formatLargeNumberExtended(totalTaps)}
        </span>
      </div>
    </div>
  );
}
