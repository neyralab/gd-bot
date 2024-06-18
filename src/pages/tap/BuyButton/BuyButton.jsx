import React from 'react';
import classNames from 'classnames';
import { ReactComponent as TonIcon } from '../../../assets/TON.svg';
import styles from './BuyButton.module.css';

export default function BuyButton({ theme, onCompleted }) {
  const clickHandler = () => {
    if (onCompleted) {
      onCompleted();
    }
  };

  return (
    <button
      type="button"
      className={classNames(styles.button, styles[theme.id])}
      onClick={clickHandler}>
      <TonIcon />
      <span className={styles.cost}>{theme.cost || 'FREE'}</span>
      <span className={styles.multiplier}>X{theme.multiplier}</span>
    </button>
  );
}
