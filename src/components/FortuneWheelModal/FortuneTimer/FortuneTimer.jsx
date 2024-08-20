import React from 'react';
import { useTimer } from 'react-timer-hook';
import { formatTime } from '../../../utils/dates';
import { ReactComponent as StarIcon } from '../../../assets/star.svg';
import styles from './FortuneTimer.module.scss';

export default function FortuneTimer({ timestamp, onComplete }) {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: timestamp,
    onExpire: () => {
      onComplete?.();
    }
  });

  const onBuy = () => {
    onComplete?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.description}>The next spin starts in</div>
      <div className={styles.timer}>
        {formatTime(hours || 24)}:{formatTime(minutes || 0)}:
        {formatTime(seconds || 0)}
      </div>
      <div className={styles.actions}>
        {/* <button onClick={onBuy}>
          <span>1 Spin</span> <b>400</b> <StarIcon />
        </button> */}
      </div>
    </div>
  );
}
