import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import styles from './ProgressBar.module.css';
import {
  selectTheme,
  selectExperienceLevel,
  selectExperiencePoints,
  selectReachNewLevel
} from '../../../store/reducers/gameSlice';
import levels from '../levels';

export default function ProgressBar() {
  const theme = useSelector(selectTheme);
  const reachedNewLevel = useSelector(selectReachNewLevel);
  const experienceLevel = useSelector(selectExperienceLevel);
  const experiencePoints = useSelector(selectExperiencePoints);
  const [experienceLevelIndex, setExperienceLevelIndex] = useState(0);

  useEffect(() => {
    setExperienceLevelIndex(
      levels.findIndex((el) => el.id === experienceLevel)
    );
  }, [experienceLevel]);

  const percent = useMemo(() => {
    let value = 0;
    if (experienceLevelIndex < 0) return value;
    value =
      (experiencePoints / levels[experienceLevelIndex].maxExperience) * 100;
    return value || 0;
  }, [experiencePoints, experienceLevel]);

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
            : `Level ${experienceLevel}`}
        </span>
        <span className={styles.points}>
          {experiencePoints} / {levels[experienceLevelIndex].maxExperience}
        </span>
      </div>
      <div className={styles['bar-container']}>
        <div className={styles.empty}></div>
        <div className={styles.active} style={{ width: percent + '%' }}></div>
      </div>
    </div>
  );
}
