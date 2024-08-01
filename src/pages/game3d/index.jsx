import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSwipeable } from 'react-swipeable';
import {
  selectStatus,
  selectTheme,
  startRound,
  selectThemeAccess,
  proceedTap,
  initGame,
  selectIsInitialized,
  selectIsTransactionLoading,
  switchTheme,
  gameCleanup
} from '../../store/reducers/gameSlice';
import { Header } from '../../components/header_v2';
import BuyButton from '../game/BuyButton/BuyButton';
import EndGameAddedPoints from '../game/EndGameAddedPoints/EndGameAddedPoints';
import PointsGrowArea from '../game/PointsGrowArea/PointsGrowArea';
import Timer from '../game/Timer/Timer';
import Menu from '../../components/Menu/Menu';
import ProgressBar from '../game/ProgressBar/ProgressBar';
import GhostLoader from '../../components/ghostLoader';
import Counter from '../game/Counter/Counter';
import Balance from '../game/Balance/Balance';
import Status from '../game/Status/Status';
import ThemeSwitcherControllers from '../game/ThemeSwitcherControllers/ThemeSwitcherControllers';
import GameCanvas from './Models/GameCanvas';
import GoldPlayModal from '../game/GoldPlayModal/GoldPlayModal';
import GameModal from '../game/GameModal/GameModal';
import SystemModalWrapper from '../game/SystemModalWrapper/SystemModalWrapper';
import styles from './styles.module.css';

/** Please, do not add extra selectors or state
 * It will force the component to rerender, that will cause lags and rerenders
 */

export function Game3DPage() {
  const { t } = useTranslation('system');
  const dispatch = useDispatch();

  const pointsAreaRef = useRef(null);
  const canvasRef = useRef(null);

  const isInitialized = useSelector(selectIsInitialized);
  const userIsInitialized = useSelector((state) => !!state.user.data);
  const theme = useSelector(selectTheme);
  const themeAccess = useSelector(selectThemeAccess);
  const themeIsSwitching = useSelector(
    (state) => state.game.nextTheme.isSwitching
  );
  const status = useSelector(selectStatus, (prev, next) => prev === next);
  const isTransactionLoading = useSelector(selectIsTransactionLoading);
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
      dispatch(
        switchTheme({ themeId: 'ghost', direction: 'next', timeout: 2500 })
      );
    },
    onSwipedRight: () => {
      dispatch(
        switchTheme({
          themeId: themeAccess.gold ? 'gold' : 'hawk',
          direction: 'prev',
          timeout: 2500
        })
      );
    }
  });

  useEffect(() => {
    if (!isInitialized && userIsInitialized) {
      dispatch(initGame());
    }

    return () => {
      dispatch(gameCleanup());
    };
  }, [userIsInitialized]);

  /** All the data for the game should be fetched in the store's thunks.
   * Do not add extra actions and side effects.
   * Keep the component clear,
   * otherwise, it will cause lags and rerenders
   */

  const clickHandler = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    // // TODO: REMOVE LATER
    // pointsAreaRef.current.runAnimation();
    // canvasRef.current?.runPushAnimation();

    // return;
    // // TODO: REMOVE LATER

    if (
      (!counterIsFinished && theme.id === 'ghost') ||
      (lockTimerTimestamp !== null && theme.id === 'hawk') ||
      !theme ||
      !themeAccess[theme.id] ||
      status === 'finished' ||
      themeIsSwitching ||
      recentlyFinishedLocker
    )
      return;

    if (status === 'waiting') {
      dispatch(startRound());
    }

    window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');

    // Run animations
    pointsAreaRef.current.runAnimation();
    canvasRef.current?.runPushAnimation();

    // Update state and timers
    dispatch(proceedTap());
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

  if (!isInitialized || !userIsInitialized || isTransactionLoading) {
    return (
      <GhostLoader
        texts={isTransactionLoading ? [t('message.transaction')] : []}
      />
    );
  }

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        <div className={styles['canvas-container']}>
          <div className={styles.canvas}>
            <GameCanvas ref={canvasRef} />
          </div>
        </div>

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

          <div className={styles['theme-switcher-container']}>
            <ThemeSwitcherControllers themeChangeTimeout={2500} />
          </div>
        </div>

        <div className={styles['actions-container']}>
          <BuyButton />
        </div>

        <div className={styles['experience-container']}>
          <ProgressBar themeChangeTimeout={1000} />
        </div>
      </div>

      <Menu />

      <GoldPlayModal />

      <GameModal />

      <SystemModalWrapper />
    </div>
  );
}
