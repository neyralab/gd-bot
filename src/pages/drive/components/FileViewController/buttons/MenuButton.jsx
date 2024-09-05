import React from 'react';
import { ReactComponent as DotsIcon } from '../../../../../assets/dots.svg';
import styles from './buttons.module.scss';

export default function MenuButton({onMenuClick}) {
  return (
    <button className={styles.fileMenuButton} onClick={onMenuClick}>
      <DotsIcon />
    </button>
  );
}
