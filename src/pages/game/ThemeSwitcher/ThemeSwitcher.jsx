import React from 'react';
import styles from './ThemeSwitcher.module.css';
import { useSelector } from 'react-redux';
import {
  selectStatus,
  selectTheme,
  selectThemeIndex,
  selectThemes
} from '../../../store/reducers/gameSlice';

export default function ThemeSwitcher({ switchTheme }) {
  const status = useSelector(selectStatus);
  const theme = useSelector(selectTheme);
  const themes = useSelector(selectThemes);
  const themeIndex = useSelector(selectThemeIndex);

  // TODO: themes
  // TODO: theme index
  // TODO: counterIsFinished
  //   if (status !== 'playing' && counterIsFinished) {
  if (status !== 'playing') {
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
