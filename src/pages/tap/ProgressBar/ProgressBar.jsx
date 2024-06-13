import React from 'react';
import classNames from 'classnames';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ percent, theme }) {
  return (
    <div className={classNames(styles.container, theme && styles[theme.id])}>
      <div className={styles.empty}></div>
      <div className={styles.active} style={{ width: percent + '%' }}></div>
    </div>
  );
}
