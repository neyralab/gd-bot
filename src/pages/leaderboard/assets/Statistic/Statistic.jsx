import React from 'react';
import CN from 'classnames';
import { formatLargeNumberExtended } from '../../../../utils/number.js';

import styles from './Statistic.module.css';

export default function Statistic({ totalTaps, totalPoints, totalUsers }) {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <p className={styles.title}>Total users:</p>
        <span
          className={CN(styles.value, styles.green)}
        >
          {totalUsers && formatLargeNumberExtended(totalUsers)}
        </span>
      </div>
      <div className={styles.section}>
        <p className={styles.title}>Total points:</p>
        <span
          className={CN(styles.value, styles.yellow)}
        >
          {totalPoints && formatLargeNumberExtended(totalPoints)}
        </span>
      </div>
      <div className={styles.section}>
        <p className={styles.title}>Total taps:</p>
        <span
          className={CN(styles.value, styles.blue)}
        >
          {totalTaps && formatLargeNumberExtended(totalTaps)}
        </span>
      </div>
    </div>
  );
}
