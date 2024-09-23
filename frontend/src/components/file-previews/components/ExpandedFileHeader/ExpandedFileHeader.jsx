import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExpandedFileHeader.module.scss';
import { vibrate } from '../../../../utils/vibration';

export default function ExpandedFileHeader({ onClose }) {
  const { t } = useTranslation('system');

  const onClick = () => {
    vibrate();
    onClose?.();
  };

  return (
    <div className={styles.header}>
      <button className={styles.back} onClick={onClick}>
        {t('dashboard.back')}
      </button>
    </div>
  );
}
