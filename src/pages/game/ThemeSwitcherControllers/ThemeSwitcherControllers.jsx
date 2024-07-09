import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStatus,
  selectThemeIndex,
  selectThemes,
  setNextTheme,
  setTheme
} from '../../../store/reducers/gameSlice';
import styles from './ThemeSwitcherControllers.module.css';

export default function ThemeSwitcherControllers() {
  const dispatch = useDispatch();

  const status = useSelector(selectStatus);
  const themes = useSelector(selectThemes);
  const themeIndex = useSelector(selectThemeIndex);
  const counterIsFinished = useSelector(
    (state) => state.game.counter.isFinished
  );

  const switchTheme = (e, direction) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (status === 'playing') return;
    if (!counterIsFinished) return;

    let newThemeIndex;

    if (direction === 'next') {
      newThemeIndex = (themeIndex + 1) % themes.length;
      if (newThemeIndex >= themes.length || newThemeIndex <= 0) return;
    } else if (direction === 'prev') {
      newThemeIndex = (themeIndex - 1 + themes.length) % themes.length;
      if (newThemeIndex >= themes.length - 1 || newThemeIndex < 0) return;
    }

    dispatch(
      setNextTheme({
        theme: themes[newThemeIndex],
        themeIndex: newThemeIndex,
        direction: direction,
        isSwitching: true
      })
    );

    setTimeout(() => {
      dispatch(setTheme(themes[newThemeIndex]));
      dispatch(
        setNextTheme({
          theme: null,
          themeIndex: null,
          direction: null,
          isSwitching: false
        })
      );
    }, 500);
  };

  if (status !== 'playing' && counterIsFinished) {
    return (
      <div className={styles.arrows}>
        {themeIndex !== 0 && (
          <div className={styles.prev} onClick={(e) => switchTheme(e, 'prev')}>
            {'<'}
          </div>
        )}

        {themeIndex !== themes.length - 1 && (
          <div className={styles.next} onClick={(e) => switchTheme(e, 'next')}>
            {'>'}
          </div>
        )}
      </div>
    );
  }

  return null;
}
