import React from 'react';
import { useSelector } from 'react-redux';
import { selectExperiencePoints } from '../../../store/reducers/game/game.selectors';
import styles from './Balance.module.css';

export default function Balance() {
  const balance = useSelector(selectExperiencePoints);
  
  return (
    <div className={styles.balance}>
      {balance?.toLocaleString('en-US')}
    </div>
  );
}
