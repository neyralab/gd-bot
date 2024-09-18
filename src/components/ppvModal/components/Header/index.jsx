import React from "react";
import CN from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

const Header = ({ onClose, onAction, title, leftText = 'Back', rightText }) => {
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
