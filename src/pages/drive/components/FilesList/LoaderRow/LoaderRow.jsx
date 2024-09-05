import React from 'react';
import styles from './LoaderRow.module.scss';
import Loader2 from '../../../../../components/Loader2/Loader2';

export default function LoaderRow({ style }) {
  return (
    <div style={style} className={styles['list-loader']}>
      <Loader2 />
      <span>Loading...</span>
    </div>
  );
}
