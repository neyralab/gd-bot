import React, { useEffect, memo, useState } from 'react';
import classNames from 'classnames';

import styles from './TempUpdate.module.css';

const TIME_OUT = 6000;

const TempUpdate = ({ isActive, counter, onClose }) => {
  const [show, setShow] = useState(true);
  const [currentCounter, setCrrentCounter] = useState(0);

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
  }, [isActive]);

  
  useEffect(() => {
    if (isActive && currentCounter < counter) {
      const increment = counter / 100; // increment value per step
      const interval = setInterval(() => {
        setCrrentCounter((prevCount) => {
          const newCount = prevCount + increment;
          return Math.round(newCount >= counter ? counter : newCount);
        });
      }, 10); // 100 steps per second

      return () => clearInterval(interval); // clean up interval on component unmount
    }
  }, [currentCounter, counter, isActive]);

  return (
    <div className={classNames(styles['temp-update'], (isActive && show) && styles['temp-active'])}>
      <p className={styles.count}>{currentCounter}</p>
      <span className={styles[`points-text`]}>points</span>
    </div>
  );
}

export default memo(TempUpdate)