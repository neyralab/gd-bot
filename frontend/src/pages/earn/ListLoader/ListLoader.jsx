import React from 'react';
import { ReactComponent as LoaderIcon } from '../../../assets/loader.svg';
import styles from './ListLoader.module.scss';

export default function ListLoader() {
  return (
    <div className={styles['loader-container']}>
      <LoaderIcon />
    </div>
  );
}
