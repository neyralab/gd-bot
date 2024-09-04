import React from 'react';
import { BackButton } from '../../../../components/backButton';
import Search from '../Search/Search';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <div className={styles.header}>
      <BackButton />
      <Search />
    </div>
  );
}
