import React, { useEffect } from 'react';
import CN from 'classnames';
import { useTranslation } from 'react-i18next';

import { formatLargeNumberExtended } from '../../../../utils/number.js';
import { runInitAnimation } from './animations.js';

import styles from './Statistic.module.css';

export default function Statistic({ totalTaps, totalPoints, totalUsers }) {
  const { t } = useTranslation('game');

  useEffect(() => {
    runInitAnimation();
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
