import React from 'react';

import { ReactComponent as PlusIcon } from '../assets/plus.svg';

import styles from './SliderItem.module.css';

export default function SliderItem({ item }) {
  return (
    <li key={item.id} className={styles['slider-card']}>
      <div className={styles['slider-header']}>
        <p className={styles['slider-title']}>{item.title}</p>
        <button className={styles['slider-action']}>
          <PlusIcon />
        </button>
      </div>
    </li>
  );
}
