import React, { useEffect, memo, useState } from 'react';
import CountUp from 'react-countup';
import classNames from 'classnames';

import styles from './TempUpdate.module.css';

const TIME_OUT = 6000;

const TempUpdate = ({ isActive, counter, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isActive) {
      const id = setTimeout(() => {
        onClose();
        setShow(true);
      }, TIME_OUT)

      const secondId = setTimeout(() => {
        setShow(false);
      }, TIME_OUT - 1000)

      return () => {
        clearTimeout(id);
        clearTimeout(secondId)
      }
    }
  }, [isActive, onClose]);

  return (
    <div className={classNames(styles['temp-update'], (isActive && show) && styles['temp-active'])}>
      <p className={styles.count}><CountUp delay={1} end={counter}/></p>
      <span className={styles[`points-text`]}>points</span>
    </div>
  );
}

export default memo(TempUpdate)