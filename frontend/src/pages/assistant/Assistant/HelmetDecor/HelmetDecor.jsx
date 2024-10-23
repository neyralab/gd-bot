import React from 'react';
import styles from './HelmetDecor.module.scss';

export default function HelmetDecor() {
  return (
    <div className={styles['decor-container']}>
      {/* Big center circle */}
      <div
        className={styles.decor1}
        style={{
          backgroundImage: 'url(/assets/assistant/helmet-decor-1.png)'
        }}></div>

      {/* Medium dotted circles */}
      <div
        className={styles.decor2}
        style={{
          backgroundImage: 'url(/assets/assistant/helmet-decor-2-1.png)'
        }}></div>
      <div
        className={styles.decor3}
        style={{
          backgroundImage: 'url(/assets/assistant/helmet-decor-2-2.png)'
        }}></div>

      <div
        className={styles.decor4}
        style={{
          backgroundImage: 'url(/assets/assistant/helmet-decor-2-2.png)'
        }}></div>

      <div
        className={styles.decor5}
        style={{
          backgroundImage: 'url(/assets/assistant/helmet-decor-2-3.png)'
        }}></div>

      {/* Side circles */}
      <div
        className={styles.decor6}
        style={{
          backgroundImage: 'url(/assets/assistant/helmet-decor-3.png)'
        }}></div>
      <div
        className={styles.decor7}
        style={{
          backgroundImage: 'url(/assets/assistant/helmet-decor-3.png)'
        }}></div>
        <div
        className={styles.decor8}
        style={{
          backgroundImage: 'url(/assets/assistant/helmet-decor-3.png)'
        }}></div>
      <div
        className={styles.decor9}
        style={{
          backgroundImage: 'url(/assets/assistant/helmet-decor-3.png)'
        }}></div>
    </div>
  );
}
