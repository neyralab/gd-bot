import React from 'react';
import classNames from 'classnames';
import { ReactComponent as TonIcon } from '../../../assets/TON.svg';
import styles from './BuyButton.module.css';
import themes from '../themes';

export default function BuyButton({ theme, onCompleted }) {
  const nextTheme = () => {
    if (!theme) return;

    const index = themes.findIndex((el) => el.id === theme.id);

    if (index < 0) return;

    // If the current theme is the last, then return the very first one
    if (index === themes.length - 1) {
      return themes[0];
    }

    return themes[index + 1];
  };

  const nextThemeResult = nextTheme();

  const clickHandler = () => {
    if (onCompleted) {
      onCompleted(nextThemeResult);
    }
  };

  if (!nextThemeResult) return;

  return (
    <button
      type="button"
      className={classNames(styles.button, styles[theme.id])}
      onClick={clickHandler}>
      <TonIcon />
      <span className={styles.cost}>{nextThemeResult.cost || 'FREE'}</span>
      <span className={styles.multiplier}>X{nextThemeResult.multiplier}</span>
    </button>
  );
}
