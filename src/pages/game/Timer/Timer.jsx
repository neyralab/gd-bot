import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectTheme,
  selectRoundTimerTimestamp,
  selectLockTimerTimestamp,
  selectStatus
} from '../../../store/reducers/gameSlice';
import styles from './Times.module.css';

export default function Timer() {
  const theme = useSelector(selectTheme);
  const status = useSelector(selectStatus);
  const roundTimerTimestamp = useSelector(selectRoundTimerTimestamp);
  const lockTimerTimestamp = useSelector(selectLockTimerTimestamp);

  const [remainingTime, setRemainingTime] = useState('0:15');
  const [lockTime, setLockTime] = useState('15:00');
  const roundCountdownRef = useRef();
  const lockCountdownRef = useRef();

  const formatRoundTime = (timeLeft) => {
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatLockTime = (timeLeft) => {
    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Round timer countdown
  useEffect(() => {
    if (status === 'playing' && roundTimerTimestamp) {
      const endTime = new Date(roundTimerTimestamp).getTime();
      setRemainingTime(formatRoundTime(endTime - Date.now()));

      roundCountdownRef.current = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
          clearInterval(roundCountdownRef.current);
          setRemainingTime('0:00');
        } else {
          setRemainingTime(formatRoundTime(timeLeft));
        }
      }, 1000);
    }

    return () => {
      clearInterval(roundCountdownRef.current);
    };
  }, [status, roundTimerTimestamp]);

  // Lock timer countdown
  useEffect(() => {
    if (theme.id === 'hawk' && lockTimerTimestamp) {
      const endTime = new Date(lockTimerTimestamp).getTime();
      setLockTime(formatLockTime(endTime - Date.now()));

      lockCountdownRef.current = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
          clearInterval(lockCountdownRef.current);
          setLockTime('0:00');
        } else {
          setLockTime(formatLockTime(timeLeft));
        }
      }, 1000);
    }

    return () => {
      clearInterval(lockCountdownRef.current);
    };
  }, [status, theme.id, lockTimerTimestamp]);

  const drawTime = useMemo(() => {
    if (status === 'playing') {
      return remainingTime;
    }

    if (status === 'waiting') {
      if (theme.id !== 'hawk') {
        return '0:15';
      } else {
        if (lockTimerTimestamp) {
          return lockTime;
        } else {
          return '0:15';
        }
      }
    }

    if (status === 'finished') {
      if (theme.id !== 'hawk') {
        return '0:00';
      } else {
        if (lockTimerTimestamp) {
          return lockTime;
        } else {
          return '0:00';
        }
      }
    }
  }, [remainingTime, lockTime, lockTimerTimestamp, status, theme.id]);

  return <div className={styles.timer}>{drawTime}</div>;
}
