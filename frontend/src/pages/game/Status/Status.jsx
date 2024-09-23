import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  selectLockTimerTimestamp,
  selectStatus,
  selectTheme,
  selectThemeAccess
} from '../../../store/reducers/gameSlice';
import styles from './Status.module.css';

export default function Status() {
  const status = useSelector(selectStatus);
  const lockTimerTimestamp = useSelector(selectLockTimerTimestamp);
  const theme = useSelector(selectTheme);
  const themeAccess = useSelector(selectThemeAccess);
  const { t } = useTranslation('game');

  const drawTimerDescription = useMemo(() => {
    if (
      (status === 'finished' || status === 'waiting') &&
      lockTimerTimestamp &&
      theme.id === 'hawk'
    ) {
      return (
        <span className={styles['timer-description']}>{t('mode.freePlay')}</span>
      );
    } else if (themeAccess[theme.id]) {
      if (theme.id === 'hawk' && lockTimerTimestamp) return null;
      if (status === 'waiting') {
        return <span className={styles['timer-description']}>{t('mode.playNow')}</span>;
      } else {
        return <span className={styles['timer-description']}>{t('mode.play')}</span>;
      }
    } else {
      return null;
    }
  }, [status, lockTimerTimestamp, theme.id, themeAccess]);

  return (
    <div>
      {drawTimerDescription}
      {status !== 'playing' &&
        theme.id !== 'hawk' &&
        !themeAccess[theme.id] && (
          <span className={styles['actions-description']}>{t('mode.boost')}</span>
        )}
    </div>
  );
}
