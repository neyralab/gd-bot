import React from 'react';
import classNames from 'classnames';
import { ReactComponent as TonIcon } from '../../../assets/TON.svg';
import styles from './BuyButton.module.css';
import themes from '../themes';

export default function BuyButton({ theme }) {
  const nextTheme = () => {
    if (!theme) return;

    const index = themes.findIndex((el) => el.id === theme.id);

    if (index < 0 || index === themes.length - 1) return;

    return themes[index + 1];
  };

  const nextThemeResult = nextTheme();

  if (!nextThemeResult) return;

  return (
    <button
      type="button"
      className={classNames(styles.button, styles[theme.id])}>
      <TonIcon />
      <span>{nextThemeResult.cost}</span>
      <span>X{nextThemeResult.multiplier}</span>
    </button>
  );
}
