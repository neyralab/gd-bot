import React, { useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStatus,
  selectTheme,
  startRound,
  selectThemeAccess,
  addExperience,
  selectNextTheme,
  initGame,
  selectIsInitialized,
  addBalance,
  selectIsTransactionLoading
} from '../../store/reducers/gameSlice';
import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import Background from './Background/Background';
import BuyButton from './BuyButton/BuyButton';
import EndGameAddedPoints from './EndGameAddedPoints/EndGameAddedPoints';
import PointsGrowArea from './PointsGrowArea/PointsGrowArea';
import Timer from './Timer/Timer';
import Menu from '../../components/Menu/Menu';
import ProgressBar from './ProgressBar/ProgressBar';
import Congratulations from './Congratulations/Congratulations';
import GhostLoader from '../../components/ghostLoader';
import styles from './styles.module.css';
import Counter from './Counter/Counter';
import Balance from './Balance/Balance';
import Status from './Status/Status';
import LevelDescription from './LevelDescription/LevelDescription';
import ThemeSwitcher from './ThemeSwitcher/ThemeSwitcher';

export function GamePage() {
  const dispatch = useDispatch();

  const backgroundRef = useRef(null);
  const pointsAreaRef = useRef(null);
  const mainButtonRef = useRef(null);
  const currentThemeRef = useRef(null);
  const nextThemeRef = useRef(null);

  const isInitialized = useSelector(selectIsInitialized);
  const theme = useSelector(selectTheme);
  const themeAccess = useSelector(selectThemeAccess);
  const status = useSelector(selectStatus, (prev, next) => prev === next);
  const nextTheme = useSelector(selectNextTheme);
  const isTransactionLoading = useSelector(selectIsTransactionLoading);
  const counterIsFinished = useSelector(
    (state) => state.game.counter.isFinished
  );

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (e) => {
      // switchTheme(e, 'next');
    },
    onSwipedRight: (e) => {
      // switchTheme(e, 'prev');
    }
  });

  useEffect(() => {
    dispatch(initGame());
  }, []);

  // const switchTheme = useCallback(
  //   (e, direction) => {
  //     e?.preventDefault?.();
  //     e?.stopPropagation?.();

  //     if (status === 'playing') return;
  //     if (!counterIsFinished) return;

  //     let newThemeIndex;

  //     if (direction === 'next') {
  //       newThemeIndex = (themeIndex + 1) % themes.length;
  //       if (newThemeIndex >= themes.length || newThemeIndex <= 0) return;
  //     } else if (direction === 'prev') {
  //       newThemeIndex = (themeIndex - 1 + themes.length) % themes.length;
  //       if (newThemeIndex >= themes.length - 1 || newThemeIndex < 0) return;
  //     }

  //     const nextThemeStyle =
  //       direction === 'next'
  //         ? styles['next-theme-appear-right']
  //         : styles['next-theme-appear-left'];

  //     dispatch(setNextTheme(themes[newThemeIndex]));
  //     // dispatch(setStatus('waiting'));

  //     currentThemeRef.current.classList.add(styles['current-theme-dissapear']);
  //     nextThemeRef.current.classList.add(nextThemeStyle);

  //     setTimeout(() => {
  //       dispatch(setTheme(themes[newThemeIndex]));
  //       dispatch(setNextTheme(null));

  //       currentThemeRef.current.classList.remove(
  //         styles['current-theme-dissapear']
  //       );
  //       nextThemeRef.current.classList.remove(nextThemeStyle);
  //     }, 500);
  //   },
  //   [dispatch, status, themeIndex, themes, counterIsFinished]
  // );

  const clickHandler = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (
      !counterIsFinished ||
      !theme ||
      !themeAccess[theme.id] ||
      status === 'finished'
    )
      return;

    if (status === 'waiting') {
      dispatch(startRound());
    }

    window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');

    // Run animations
    mainButtonRef.current.runAnimation();
    backgroundRef.current.runAnimation();
    pointsAreaRef.current.runAnimation();

    // Update state and timers
    dispatch(addExperience());
    dispatch(addBalance(1));
  };

  const handleEvent = async (event) => {
    if (event.type.startsWith('touch')) {
      const touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        await clickHandler(event);
      }
    } else {
      await clickHandler(event);
    }
  };

  // const conditionalSwipeHandlers = () => {
  //   return status !== 'playing' ? swipeHandlers : {}; // just in case the swipe will affect click.
  // };

  if (!isInitialized || isTransactionLoading) {
    return (
      <GhostLoader
        texts={
          isTransactionLoading ? ['Waiting for transaction confirmation'] : []
        }
      />
    );
  }

  return (
    <div className={styles.container}>
      <Background ref={backgroundRef} />
      <Header />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <Balance />
          </div>

          <div className={styles['timer-container']}>
            <Timer />
            <Status />
          </div>

          <div className={styles['main-button-container']}>
            <div
              className={styles['main-button-touch-area']}
              // {...conditionalSwipeHandlers}
              onTouchEnd={handleEvent}
              onMouseUp={handleEvent}>
              <div className={styles['points-grow-area-container']}>
                <PointsGrowArea ref={pointsAreaRef} />
              </div>

              <div className={styles['main-button-inner-container']}>
                <div ref={currentThemeRef} className={styles['current-theme']}>
                  <MainButton ref={mainButtonRef} theme={theme} />
                </div>

                <div ref={nextThemeRef} className={styles['next-theme']}>
                  {nextTheme && <MainButton theme={nextTheme} />}
                </div>

                <EndGameAddedPoints />
              </div>

              <div className={styles['level-description-container']}>
                <LevelDescription />
              </div>

              <div className={styles['counter-container']}>
                <Counter />
              </div>
            </div>

            <div className={styles['theme-switcher-container']}>
              {/* <ThemeSwitcher /> */}
            </div>
          </div>

          <div className={styles['actions-container']}>
            <BuyButton />
          </div>

          <div className={styles['experience-container']}>
            <ProgressBar />
          </div>
        </div>
      </div>

      <Menu />

      <Congratulations />
    </div>
  );
}
