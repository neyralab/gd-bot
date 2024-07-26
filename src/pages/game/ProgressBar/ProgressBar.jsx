import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  selectTheme,
  selectExperienceLevel,
  selectExperiencePoints,
  selectReachNewLevel,
  selectLevels,
  selectNextTheme
} from '../../../store/reducers/gameSlice';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ themeChangeTimeout = 0 }) {
  const { t } = useTranslation('game');
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const levels = useSelector(selectLevels);
  const reachedNewLevel = useSelector(selectReachNewLevel);
  const experienceLevel = useSelector(selectExperienceLevel);
  const experiencePoints = useSelector(selectExperiencePoints);
  const [currentLevel, setCurrentLevel] = useState();
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    if (levels) {
      const l = levels?.find((el) => el.id === experienceLevel);
      setCurrentLevel(l);
    }
  }, [levels, experienceLevel]);

  useEffect(() => {
    if (!nextTheme.theme) return;
    const newTheme = JSON.parse(JSON.stringify(nextTheme.theme));
    setTimeout(() => {
      setCurrentTheme(newTheme);
    }, themeChangeTimeout);
  }, [nextTheme.theme]);

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
            ? `${t('navigate.reachedLevel')} ${experienceLevel + 1}!`
            : `${t('process.level')} ${experienceLevel}`}
        </span>
        <span className={styles.points}>
          {experiencePoints} / {currentLevel?.tapping_to}
        </span>
      </div>
      <div className={styles['bar-container']}>
        <div
          className={styles.empty}
          style={{
            background: `linear-gradient(90deg, rgba(${currentTheme.colors.experienceBar.empty.background1[0]}, ${currentTheme.colors.experienceBar.empty.background1[1]}, ${currentTheme.colors.experienceBar.empty.background1[2]}, 0.3) 0%, rgba(${currentTheme.colors.experienceBar.empty.background2[0]}, ${currentTheme.colors.experienceBar.empty.background2[1]}, ${currentTheme.colors.experienceBar.empty.background2[2]}, 0.3) 100%)`,
            boxShadow: `0px 0px 10.3px 0px ${currentTheme.colors.experienceBar.empty.boxShadow}`
          }}></div>
        <div
          className={styles.active}
          style={{
            width: percent + '%',
            background: `linear-gradient(90deg, ${currentTheme.colors.experienceBar.active.background1} 0%, ${currentTheme.colors.experienceBar.active.background2} 100%)`,
            boxShadow: `0px 0px 10.3px 0px ${currentTheme.colors.experienceBar.active.boxShadow}`
          }}></div>
      </div>
    </div>
  );
}
