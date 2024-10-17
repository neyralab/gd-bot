import React from 'react';
import { useSelector } from 'react-redux';
import { selectLevel } from '../../../store/reducers/game/game.selectors';
import styles from './LevelDescription.module.css';

export default function LevelDescription() {
  const level = useSelector(selectLevel);

  if (level.id - 1) {
    return (
      <div className={styles.description}>
        <span>X{level.id - 1}</span>
      </div>
    );
  }

  return null;
}
