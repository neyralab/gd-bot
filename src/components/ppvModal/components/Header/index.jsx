import React from "react";
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

const Header = ({ onClose, onAction, leftText = 'Back', rightText }) => {
  const { t } = useTranslation('drive');

  return (
    <header className={styles.header}>
      <button
        className={styles.button}
        onClick={onClose}
        aria-label={leftText}
      >
        {leftText}
      </button>
      <h1 className={styles.title}>{t('ppv.ppv')}</h1>
      <button
        className={styles.button}
        onClick={onAction}
        aria-label={rightText}
      >
        {rightText}
      </button>
    </header>
  );
}

export default Header;
