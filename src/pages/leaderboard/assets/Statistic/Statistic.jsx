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
          {formatLargeNumberExtended(totalUsers)}
        </span>
      </div>
      <div className={styles.section}>
        <p className={styles.title}>Total points:</p>
        <span
          className={CN(styles.value, styles.yellow)}
        >
          {formatLargeNumberExtended(totalPoints)}
        </span>
      </div>
      <div className={styles.section}>
        <p className={styles.title}>Total taps:</p>
        <span
          className={CN(styles.value, styles.blue)}
        >
          {formatLargeNumberExtended(totalTaps)}
        </span>
      </div>
    </div>
  );
}
