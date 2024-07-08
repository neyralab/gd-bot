import React from 'react';

import useButtonVibration from '../../../hooks/useButtonVibration';

import { ReactComponent as TonIcon } from '../../../assets/TON.svg';

import classNames from 'classnames';
import styles from './BuyButton.module.css';

export default function BuyButton({ theme, onCompleted }) {
  const handleVibrationClick = useButtonVibration();

  const clickHandler = () => {
    if (onCompleted) {
      onCompleted();
    }
  };

  return (
    <button
      type="button"
      className={classNames(styles.button, styles[theme.id])}
      onClick={handleVibrationClick(clickHandler)}>
      <TonIcon />
      <span className={styles.cost}>{theme.cost || 'FREE'}</span>
      <span className={styles.multiplier}>X{theme.multiplier}</span>
    </button>
  );
}
