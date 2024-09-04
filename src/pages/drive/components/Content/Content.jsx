import React from 'react';
import Categories from '../Categories/Categories';
import styles from './Content.module.scss';

export default function Content() {
  return (
    <div className={styles.container}>
      <Categories />
    </div>
  );
}
