import React from "react";
import { useTimer } from 'react-timer-hook';
import { formatTime } from '../../../utils/dates';

import styles from './FortuneTimer.module.scss';

const Timer = ({ timestamp, onComplete }) => {

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: timestamp,
    onExpire: () => {
      onComplete?.();
    }
  });

  return (
    <div className={styles.timer}>
      {formatTime(hours || 24)}<span>:</span>{formatTime(minutes || 0)}<span>:</span>
      {formatTime(seconds || 0)}
    </div>
  )
}

export { Timer }