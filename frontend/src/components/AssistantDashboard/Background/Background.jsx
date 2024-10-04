import React from 'react';
import classNames from 'classnames';
import styles from './Background.module.scss';

export default function Background() {
  return (
    <div className={styles['main-background']}>
      <div className={classNames(styles.light, styles.light1)}></div>
      <div className={classNames(styles.light, styles.light2)}></div>
      <div className={classNames(styles.light, styles.light3)}></div>
      <div className={classNames(styles.light, styles.light4)}></div>
    </div>
  );
}
