import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  selectNextTheme,
  selectStatus,
  selectTheme,
  selectThemeAccess,
  switchTheme
} from '../../../store/reducers/gameSlice';
import styles from './ThemeSwitcherControllers.module.css';

export default function ThemeSwitcherControllers({ themeChangeTimeout }) {
  const dispatch = useDispatch();

  const status = useSelector(selectStatus);
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const themeAccess = useSelector(selectThemeAccess);
  const counterIsFinished = useSelector(
    (state) => state.game.counter.isFinished
  );

  const clickHandler = (e, direction) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!nextTheme.theme) {
      let themeId = 'hawk';

      if (direction === 'next') {
        themeId = 'ghost';
      } else if (themeAccess.ghost) {
        themeId = 'gold';
      }

      dispatch(
        switchTheme({
          themeId,
          direction,
          timeout: themeChangeTimeout
        })
      );
    }
  };

  if (status !== 'playing' && counterIsFinished) {
    return (
      <div
        className={classNames(
          styles.arrows,
          nextTheme.isSwitching && styles['is-switching']
        )}>
        {theme.id === 'ghost' && (
          <div className={styles.prev} onClick={(e) => clickHandler(e, 'prev')}>
            {'<'}
          </div>
        )}

        {theme.id !== 'ghost' && (
          <div className={styles.next} onClick={(e) => clickHandler(e, 'next')}>
            {'>'}
          </div>
        )}
      </div>
    );
  }

  return null;
}
