import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  selectTheme,
  selectExperienceLevel,
  selectExperiencePoints,
  selectReachNewLevel,
  selectLevels
} from '../../../store/reducers/gameSlice';
import styles from './ProgressBar.module.css';

export default function ProgressBar() {
  const theme = useSelector(selectTheme);
  const levels = useSelector(selectLevels);
  const reachedNewLevel = useSelector(selectReachNewLevel);
  const experienceLevel = useSelector(selectExperienceLevel);
  const experiencePoints = useSelector(selectExperiencePoints);
  const [currentLevel, setCurrentLevel] = useState();

  useEffect(() => {
    if (levels) {
      const l = levels?.find((el) => el.id === experienceLevel);
      setCurrentLevel(l);
    }
  }, [levels, experienceLevel]);

  const percent = useMemo(() => {
    let value = 0;
    if (!currentLevel) return value;
    value = (experiencePoints / currentLevel?.tapping_to) * 100;
    return value || 0;
  }, [currentLevel, experiencePoints]);

  return (
    <div
      className={classNames(
        styles.container,
        theme && styles[theme.id],
        reachedNewLevel && styles['new-level']
      )}>
      <div className={styles.description}>
        <span className={styles.level}>
          {reachedNewLevel
            ? `You've reached level ${experienceLevel}!`
            : `Level ${experienceLevel - 1}`}
        </span>
        <span className={styles.points}>
          {experiencePoints} / {currentLevel?.tapping_to}
        </span>
      </div>
      <div className={styles['bar-container']}>
        <div className={styles.empty}></div>
        <div className={styles.active} style={{ width: percent + '%' }}></div>
      </div>
    </div>
  );
}
