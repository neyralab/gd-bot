import React from 'react';
import Loader2 from '../../../../../components/Loader2/Loader2';
import styles from './LoaderRow.module.scss';

export default function LoaderRow({ style }) {
  return (
    <div style={style} className={styles['list-loader']}>
      <Loader2 />
      <span>Loading...</span>
    </div>
  );
}
