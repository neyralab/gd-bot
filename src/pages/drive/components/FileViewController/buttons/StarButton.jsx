import React from 'react';
import classNames from 'classnames';
import { ReactComponent as StarFullIcon } from '../../../../../assets/starFull.svg';
import styles from './buttons.module.scss';

export default function StarButton({ viewType }) {
  return (
    <button
      className={classNames(
        styles['star-menu-btn'],
        viewType === 'grid'
          ? styles['star-btn--grid']
          : styles['star-btn--list']
      )}>
      <StarFullIcon />
    </button>
  );
}
