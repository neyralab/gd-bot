import React, { useRef, useMemo } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStatus,
  selectTheme,
  selectThemes,
  selectThemeAccess,
  selectIsGameDisabled
} from '../../../store/reducers/game/game.selectors';
import {
  startRound,
  proceedTap,
  switchTheme
} from '../../../store/reducers/game/game.thunks';
import EndGameAddedPoints from '../EndGameAddedPoints/EndGameAddedPoints';
import PointsGrowArea from '../PointsGrowArea/PointsGrowArea';
import Counter from '../Counter/Counter';
import styles from './MainButton.module.scss';

const MainButton = ({ onPushAnimation }) => {
  const pointsAreaRef = useRef(null);
  const dispatch = useDispatch();
  const allowThemeChange = useSelector((state) => state.game.allowThemeChange);
  const isCanvasLoaded = useSelector((state) => state.game.isCanvasLoaded);
  const theme = useSelector(selectTheme);
  const themes = useSelector(selectThemes);
  const themeAccess = useSelector(selectThemeAccess);
  const isGamedDisabled = useSelector(selectIsGameDisabled);
  const themeIsSwitching = useSelector(
    (state) => state.game.nextTheme.isSwitching
  );
  const status = useSelector(selectStatus, (prev, next) => prev === next);
  const counterIsFinished = useSelector(
    (state) => state.game.counter.isFinished
  );
  const lockTimerTimestamp = useSelector(
    (state) => state.game.lockTimerTimestamp
  );
  const recentlyFinishedLocker = useSelector(
    (state) => state.game.recentlyFinishedLocker
  );
  const themeIndex = useMemo(
    () => themes.findIndex((el) => el.id === theme.id),
    [theme, themes]
  );

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (
        !isCanvasLoaded ||
        !allowThemeChange ||
        theme.id === themes[themes.length - 1].id
      )
        return;
      const isNextGodTheme = themes[themeIndex + 1].id === 'gold';
      dispatch(
        switchTheme({
          themeId: themes[themeIndex + (isNextGodTheme ? 2 : 1)].id,
          direction: 'next',
          timeout: 2500
        })
      );
    },
    onSwipedRight: () => {
      if (!isCanvasLoaded || !allowThemeChange || theme.id === 'hawk') return;
      const isNextGodTheme = themes[themeIndex - 1].id === 'gold';
      dispatch(
        switchTheme({
          themeId: themes[themeIndex - (isNextGodTheme ? 2 : 1)].id,
          direction: 'prev',
          timeout: 2500
        })
      );
    }
  });

  const tapHandler = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    // Run animations
    onPushAnimation?.();
    pointsAreaRef.current.runAnimation();

    // Update state and timers
    dispatch(proceedTap());
  };

  const handleEvent = async (event) => {
    if (
      (!counterIsFinished && theme.id !== 'hawk') ||
      (!counterIsFinished && theme.id !== 'gold') ||
      (lockTimerTimestamp !== null && theme.id === 'hawk') ||
      !theme ||
      !themeAccess[theme.id] ||
      status === 'finished' ||
      themeIsSwitching ||
      recentlyFinishedLocker ||
      !isCanvasLoaded ||
      isGamedDisabled
    )
      return;

    if (status === 'waiting') {
      dispatch(startRound());
    }

    window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');

    if (event.type.startsWith('touch')) {
      const touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        await tapHandler(event);
      }
    } else {
      await tapHandler(event);
    }
  };

  return (
    <div
      className={styles['main-button-touch-area']}
      {...(status !== 'playing' ? swipeHandlers : {})}
      onTouchEnd={handleEvent}
      onMouseUp={handleEvent}>
      <div className={styles['points-grow-area-container']}>
        <PointsGrowArea ref={pointsAreaRef} />
      </div>

      <div className={styles['main-button-inner-container']}>
        <EndGameAddedPoints />
      </div>

      <div className={styles['counter-container']}>
        <Counter />
      </div>
    </div>
  );
};

export default MainButton;
