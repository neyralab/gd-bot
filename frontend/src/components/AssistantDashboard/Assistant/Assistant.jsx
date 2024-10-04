import React from 'react';
import styles from './Assistant.module.scss';

export default function Assistant() {
  return (
    <div className={styles.container}>
      <div className={styles['captain-container']}>
        <div
          className={styles.captain}
          style={{ backgroundImage: 'url(/assets/assistant/captain.png)' }}></div>
      </div>
    </div>
  );
}
