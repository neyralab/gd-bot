import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  selectNextTheme,
  selectThemes,
  selectStatus,
  selectTheme
} from '../../../store/reducers/game/game.selectors';
import { switchTheme } from '../../../store/reducers/game/game.thunks';
import styles from './ThemeSwitcherControllers.module.css';

export default function ThemeSwitcherControllers({ themeChangeTimeout }) {
  const dispatch = useDispatch();
  const allowThemeChange = useSelector((state) => state.game.allowThemeChange);
  const isCanvasLoaded = useSelector((state) => state.game.isCanvasLoaded);
  const status = useSelector(selectStatus);
  const themes = useSelector(selectThemes);
  const theme = useSelector(selectTheme);
  const nextTheme = useSelector(selectNextTheme);
  const counterIsFinished = useSelector(
    (state) => state.game.counter.isFinished
  );
  const themeIndex = useMemo(
    () => themes.findIndex((el) => el.id === theme.id),
    [theme, themes]
  );

  const clickHandler = (e, direction) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    let themeId;

    if (direction === 'next') {
      const isNextGodTheme = themes[themeIndex + 1].id === 'gold';
      themeId = themes[themeIndex + (isNextGodTheme ? 2 : 1)].id;
    } else {
      const isNextGodTheme = themes[themeIndex - 1].id === 'gold';
      themeId = themes[themeIndex - (isNextGodTheme ? 2 : 1)].id;
    }

    dispatch(
      switchTheme({
        themeId,
        direction,
        timeout: themeChangeTimeout
      })
    );
  };

  if (
    status !== 'playing' &&
    counterIsFinished &&
    allowThemeChange &&
    isCanvasLoaded
  ) {
    return (
      <div
        className={classNames(
          styles.arrows,
          nextTheme.isSwitching && styles['is-switching']
        )}>
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
