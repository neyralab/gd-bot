import React, { useEffect } from 'react';
import { ReactComponent as WaveIcon } from '../../../assets/half-opacity-wave.svg';
import styles from './Wave.module.scss';

export default function Wave({onComplete}) {
  useEffect(() => {
    setTimeout(() => {
      onComplete?.();
    }, 600)
  },[])

  return (
    <div className={styles.wave}>
      <WaveIcon />
    </div>
  );
}
