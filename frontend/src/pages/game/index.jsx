import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';
import {
  initGame,
  selectIsInitialized,
  selectIsTransactionLoading,
  selectIsGameDisabled,
  gameCleanup,
  checkAdvertisementOffer,
  setAllowThemeChange
} from '../../store/reducers/gameSlice';
import { Header } from '../../components/header_v2';
import BuyButton from './BuyButton/BuyButton';
import Timer from './Timer/Timer';
import Menu from '../../components/Menu/Menu';
import TemporaryControls from '../../components/AssistantDashboard/TemporaryControls/TemporaryControls';
import ProgressBar from './ProgressBar/ProgressBar';
import GhostLoader from '../../components/ghostLoader';
import Balance from './Balance/Balance';
import Status from './Status/Status';
import ThemeSwitcherControllers from './ThemeSwitcherControllers/ThemeSwitcherControllers';
import GameCanvas from './Models/GameCanvas';
import GoldPlayModal from './GoldPlayModal/GoldPlayModal';
import GameModal from './GameModal/GameModal';
import SystemModalWrapper from './SystemModalWrapper/SystemModalWrapper';
import MainButton from './MainButton/MainButton';
import AdvertisementOfferModal from './AdvertisementOfferModal/AdvertisementOfferModal';
import AdvertisementPlayModal from './AdvertisementPlayModal/AdvertisementPlayModal';
import { isMobilePlatform } from '../../utils/client';
import styles from './styles.module.css';

/** Please, do not add extra selectors or state
 * It will force the component to rerender, that will cause lags and rerenders
 */

export function GamePage() {
  const { t } = useTranslation('system');
  const dispatch = useDispatch();

  const canvasRef = useRef(null);

  const isInitialized = useSelector(selectIsInitialized);
  const userIsInitialized = useSelector((state) => !!state.user.data);
  const isCanvasLoaded = useSelector((state) => state.game.isCanvasLoaded);
  const allowThemeChange = useSelector((state) => state.game.allowThemeChange);
  const isTransactionLoading = useSelector(selectIsTransactionLoading);
  const isGamedDisabled = useSelector(selectIsGameDisabled);

  useEffect(() => {
    if (!isInitialized && userIsInitialized) {
      dispatch(initGame());
    }

    if (isInitialized && userIsInitialized) {
      dispatch(checkAdvertisementOffer());
    }

    return () => {
      dispatch(gameCleanup());
    };
  }, [userIsInitialized]);

  useEffect(() => {
    let timeout;
    if (
      isInitialized &&
      userIsInitialized &&
      isCanvasLoaded &&
      !allowThemeChange
    ) {
      timeout = setTimeout(() => {
        dispatch(setAllowThemeChange(true));
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isInitialized, userIsInitialized, isCanvasLoaded, allowThemeChange]);

  const onPushAnimation = () => {
    canvasRef.current?.runPushAnimation();
  };

  /** All the data for the game should be fetched in the store's thunks.
   * Do not add extra actions and side effects.
   * Keep the component clear,
   * otherwise, it will cause lags and rerenders
   */

  if (!isInitialized || !userIsInitialized || isTransactionLoading) {
    return (
      <>
        <GhostLoader
          texts={isTransactionLoading ? [t('message.transaction')] : []}
        />
        <TemporaryControls className={styles['control-paner']} />
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles['canvas-container']}>
          <div
            className={CN(
              styles.canvas,
              isGamedDisabled && styles['canvas-disabled']
            )}>
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
          <MainButton onPushAnimation={onPushAnimation} />

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

      <TemporaryControls />

      <GoldPlayModal />

      <GameModal />

      <AdvertisementOfferModal />

      <AdvertisementPlayModal />

      <SystemModalWrapper />
    </div>
  );
}
