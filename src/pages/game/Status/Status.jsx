import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
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

  const drawTimerDescription = useMemo(() => {
    if (
      (status === 'finished' || status === 'waiting') &&
      lockTimerTimestamp &&
      theme.id === 'hawk'
    ) {
      return (
        <span className={styles['timer-description']}>Next free play</span>
      );
    } else if (themeAccess[theme.id] && !lockTimerTimestamp) {
      return <span className={styles['timer-description']}>Play now</span>;
    } else {
      return null;
    }
  }, [status, lockTimerTimestamp, theme.id, themeAccess]);

  return (
    <div>
      {drawTimerDescription}
      {status !== 'playing' && theme.id !== 'hawk' && (
        <span className={styles['actions-description']}>Boost mode</span>
      )}
    </div>
  );
}
