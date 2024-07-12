import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRoundFinal } from '../../../store/reducers/gameSlice';
import styles from './EndGameAddedPoints.module.css';

const TIME_OUT = 8000;

const EndGameAddedPoints = () => {
  const dispatch = useDispatch();

  const isActive = useSelector((state) => state.game.roundFinal.isActive);
  const counter = useSelector((state) => state.game.roundFinal.roundPoints);
  const user = useSelector((state) => state.user.data);

  const [show, setShow] = useState(false);
  const [showRank, setShowRank] = useState(false);
  const [currentCounter, setCrrentCounter] = useState(0);

  useEffect(() => {
    if (isActive) {
      setShow(true);
      const rankTimeout = setTimeout(() => {
        setShowRank(true);
      }, TIME_OUT - 3000);

      const timeout = setTimeout(() => {
        setShow(false);
        setShowRank(false);
        dispatch(setRoundFinal({ roundPoins: null, isActive: false }));
      }, TIME_OUT);

      return () => {
        clearTimeout(timeout);
        clearTimeout(rankTimeout);
      };
    } else {
      setShow(false);
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

  if (!show) return;

  return (
    <div className={styles.container}>
      { showRank && user.rank ? (
        <span className={styles[`points-text`]}>{`rank: ${user.rank}`}</span>
      ) : (
        <>
          <p className={styles.count}>{currentCounter}</p>
          <span className={styles[`points-text`]}>points</span>
        </>
      ) }
    </div>
  );
};

export default EndGameAddedPoints;
