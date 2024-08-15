import React from 'react';
import { useTimer } from 'react-timer-hook';
import styles from './FortuneTimer.module.scss';
import { ReactComponent as StarIcon } from '../../../assets/star.svg';

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
        {hours || '24'}:{minutes || '00'}:{seconds || '00'}
      </div>
      <div className={styles.actions}>
        <button onClick={onBuy}>
          <span>1 Spin</span> <b>400</b> <StarIcon />
        </button>
      </div>
    </div>
  );
}
