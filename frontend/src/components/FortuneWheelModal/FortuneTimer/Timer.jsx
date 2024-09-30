import React, { useMemo } from "react";
import { useTimer } from 'react-timer-hook';
import moment from 'moment';

import styles from './FortuneTimer.module.scss';

const Timer = ({ timestamp, onComplete }) => {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: timestamp,
    onExpire: onComplete,
  });

  const formattedTime = useMemo(() => moment({ hours, minutes, seconds }), [hours, minutes, seconds]);

  return (
    <div className={styles.timer}>
      {formattedTime.format('HH')}<span>:</span>{formattedTime.format('mm')}<span>:</span>
      {formattedTime.format('ss')}
    </div>
  );
};

export { Timer };
