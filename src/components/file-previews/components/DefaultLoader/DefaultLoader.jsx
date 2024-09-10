import React from 'react';
import GhostLoader from '../../../ghostLoader';
import styles from './DefaultLoader.module.scss';

export default function DefaultLoader() {
  return (
    <div className={styles['default-loader']}>
      <GhostLoader />
    </div>
  );
}
