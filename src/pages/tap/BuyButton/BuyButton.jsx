import React from 'react';
import classNames from 'classnames';
import { ReactComponent as TonIcon } from '../../../assets/TON.svg';
import styles from './BuyButton.module.css';
import themes from '../themes';

export default function BuyButton({ theme, onCompleted }) {
  const nextTheme = () => {
    if (!theme) return;

    const index = themes.findIndex((el) => el.id === theme.id);

    if (index < 0 || index === themes.length - 1) return;

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
    <>
      <span className={styles.description}>Upgrade and play now</span>

      <button
        type="button"
        className={classNames(styles.button, styles[theme.id])}
        onClick={clickHandler}>
        <TonIcon />
        <span>{nextThemeResult.cost}</span>
        <span>X{nextThemeResult.multiplier}</span>
      </button>
    </>
  );
}
