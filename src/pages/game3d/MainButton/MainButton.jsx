import React, { useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStatus,
  selectTheme,
  startRound,
  selectThemeAccess,
  proceedTap,
  switchTheme
} from '../../../store/reducers/gameSlice';
import EndGameAddedPoints from '../../game/EndGameAddedPoints/EndGameAddedPoints';
import PointsGrowArea from '../../game/PointsGrowArea/PointsGrowArea';
import Counter from '../../game/Counter/Counter';
import styles from './MainButton.module.scss';

const MainButton = ({ onPushAnimation }) => {
  const pointsAreaRef = useRef(null);

  const dispatch = useDispatch();
  const isCanvasLoaded = useSelector((state) => state.game.isCanvasLoaded);
  const theme = useSelector(selectTheme);
  const themeAccess = useSelector(selectThemeAccess);
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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isCanvasLoaded || theme.id === 'ghost') return;

      dispatch(
        switchTheme({ themeId: 'ghost', direction: 'next', timeout: 2500 })
      );
    },
    onSwipedRight: () => {
      if (!isCanvasLoaded || theme.id === 'hawk') return;

      dispatch(
        switchTheme({
          themeId: 'hawk',
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
      (!counterIsFinished && theme.id === 'ghost') ||
      (lockTimerTimestamp !== null && theme.id === 'hawk') ||
      !theme ||
      !themeAccess[theme.id] ||
      status === 'finished' ||
      themeIsSwitching ||
      recentlyFinishedLocker ||
      !isCanvasLoaded
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
