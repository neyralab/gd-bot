import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectExperienceLevel,
  selectReachNewLevel,
  selectStatus
} from '../../../store/reducers/gameSlice';
import styles from './Congratulations.module.css';

{/* Not in use yet */}
export default function Congratulations() {
  const status = useSelector(selectStatus);
  const reachedNewLevel = useSelector(selectReachNewLevel);
  const experienceLevel = useSelector(selectExperienceLevel);
  const [isOpen, setIsOpen] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    if (status === 'finished' && reachedNewLevel) {
      setIsOpen(true);

      setTimeout(() => {
        setIsClickable(true);
      }, 1500);
    }
  }, [status, reachedNewLevel]);

  const clickHandler = () => {
    if (isClickable) {
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
          
        <div className={styles.points}>+{points}</div>
        <div className={styles.description}>
          Congratulations! You've Reached Level {experienceLevel}
        </div>
      </div>
    </div>
  );
}
