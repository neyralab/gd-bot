import React from 'react';
import styles from './ProgressBar.module.scss';

export default function ProgressBar({ progress }) {
  return (
    <div className={styles['progress-bar']}>
      <div className={styles.progress} style={{ width: `${progress}%` }}></div>
    </div>
  );
}
