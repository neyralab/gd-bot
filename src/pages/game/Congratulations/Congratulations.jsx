import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectExperienceLevel,
  confirmNewlevel,
  selectReachNewLevel,
  selectStatus
} from '../../../store/reducers/gameSlice';
import levels from '../levels';
import styles from './Congratulations.module.css';

export default function Congratulations() {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const reachedNewLevel = useSelector(selectReachNewLevel);
  const experienceLevel = useSelector(selectExperienceLevel);
  const [experienceLevelIndex, setExperienceLevelIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  // TODO: fix levels, get em from the store

  useEffect(() => {
    setExperienceLevelIndex(
      levels.findIndex((el) => el.id === experienceLevel)
    );
  }, [experienceLevel]);

  useEffect(() => {
    if (status === 'finished' && reachedNewLevel) {
      setIsOpen(true);

      setTimeout(() => {
        setIsClickable(true);
      }, 1500);
    }
  }, [status, reachedNewLevel]);

  const points = useMemo(() => {
    if (!levels[experienceLevelIndex - 1]) return levels[0].giftPoints;
    return levels[experienceLevelIndex - 1].giftPoints;
  }, [experienceLevelIndex]);

  const clickHandler = () => {
    if (isClickable) {
      dispatch(confirmNewlevel());
      setIsClickable(false);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={clickHandler}>
      <div
        className={styles.container}
        style={{
          backgroundImage: `url('/assets/game-page/congrats-modal.png')`
        }}>
        <div
          className={styles.icon}
          style={{
            backgroundImage: `url('/assets/game-page/congrats-icon.png')`
          }}></div>
          {/* TODO: no points anymore */}
        <div className={styles.points}>+{points}</div>
        <div className={styles.description}>
          Congratulations! You've Reached Level {experienceLevel}
        </div>
      </div>
    </div>
  );
}
