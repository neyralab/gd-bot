import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  initGame,
  selectIsInitialized,
  selectIsTransactionLoading,
  gameCleanup,
  checkAdvertisementOffer
} from '../../store/reducers/gameSlice';
import { Header } from '../../components/header_v2';
import BuyButton from './BuyButton/BuyButton';
import Timer from './Timer/Timer';
import Menu from '../../components/Menu/Menu';
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
  const isTransactionLoading = useSelector(selectIsTransactionLoading);

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

      <Menu />

      <GoldPlayModal />

      <GameModal />

      <AdvertisementOfferModal />

      <AdvertisementPlayModal />

      <SystemModalWrapper />
    </div>
  );
}
