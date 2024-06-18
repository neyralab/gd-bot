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

  const [remainingTime, setRemainingTime] = useState('1:00');
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
    if (status === 'finished' && theme.id === 'hawk' && lockTimerTimestamp) {
      const endTime = new Date(lockTimerTimestamp).getTime();
      setRemainingTime(formatLockTime(endTime - Date.now()));

      lockCountdownRef.current = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
          clearInterval(lockCountdownRef.current);
          setRemainingTime('0:00');
        } else {
          setRemainingTime(formatLockTime(timeLeft));
        }
      }, 1000);
    }
    return () => {
      clearInterval(lockCountdownRef.current);
    };
  }, [status, theme.id, lockTimerTimestamp]);

  const drawTime = useMemo(() => {
    if (status === 'finished' || status === 'waiting') {
      if (theme.id !== 'hawk') {
        return '0:00';
      } else {
        return remainingTime;
      }
    }

    if (status === 'playing') {
      return remainingTime;
    }
  }, [remainingTime, status, theme.id]);

  return <div className={styles.timer}>{drawTime}</div>;
}
