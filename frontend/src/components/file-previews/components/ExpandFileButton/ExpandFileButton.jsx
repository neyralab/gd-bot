import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExpandFileButton.module.scss';
import { vibrate } from '../../../../utils/vibration';

export default function ExpandFileButton({ onExpandClick }) {
  const { t } = useTranslation('drive');

  const clickHandler = () => {
    vibrate();
    onExpandClick?.();
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={clickHandler}>
        {t('files.expandFile')}
      </button>
    </div>
  );
}
