import React from 'react';
import { ReactComponent as LoaderIcon } from '../../assets/loader.svg';
import styles from './Loader2.module.scss';

export default function Loader2() {
  return (
    <div className={styles['loader-container']}>
      <LoaderIcon />
    </div>
  );
}
