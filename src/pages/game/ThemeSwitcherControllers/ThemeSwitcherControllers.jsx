import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStatus,
  selectThemeIndex,
  selectThemes,
  switchTheme
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

  const clickHandler = (e, direction) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    dispatch(switchTheme({direction}));
  };

  if (status !== 'playing' && counterIsFinished) {
    return (
      <div className={styles.arrows}>
        {themeIndex !== 0 && (
          <div className={styles.prev} onClick={(e) => clickHandler(e, 'prev')}>
            {'<'}
          </div>
        )}

        {themeIndex !== themes.length - 1 && (
          <div className={styles.next} onClick={(e) => clickHandler(e, 'next')}>
            {'>'}
          </div>
        )}
      </div>
    );
  }

  return null;
}
