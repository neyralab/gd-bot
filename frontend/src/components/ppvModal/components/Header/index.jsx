import React from "react";
import CN from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

const Header = ({ onAction, title, rightText }) => {
  const { t } = useTranslation('drive');

  return (
    <header className={styles.header}>
      <span></span>
      <h1 className={styles.title}>{title ||t('ppv.ppv')}</h1>
      <button
        className={CN(styles.button, styles.right)}
        onClick={onAction}
        aria-label={rightText}
      >
        {rightText}
      </button>
    </header>
  );
}

export default Header;
