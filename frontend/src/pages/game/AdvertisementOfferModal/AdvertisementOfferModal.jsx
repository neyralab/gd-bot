import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setAdvertisementModal,
  setAdvertisementOfferModal
} from '../../../store/reducers/game/game.slice';
import { refreshFreeGame } from '../../../store/reducers/game/game.thunks';
import { useAdsgram } from '../../../utils/useAdsgram';
import { ADSGRAM_BLOCK_ID } from '../../../utils/api-urls';
import { isValidEnvVariable } from '../../../utils/string';

import {
  startWatchingAdvertisementVideo,
  endWatchingAdvertisementVideo
} from '../../../effects/advertisementEffect';
import { AdController } from '../../../App';
import styles from './AdvertisementOfferModal.module.scss';

const HIDE_ADD_MODAL_KEY = 'ad-modal-display';

export default function AdvertisementOfferModal() {
  const dispatch = useDispatch();
  const advertisementOfferModal = useSelector(
    (state) => state.game.advertisementOfferModal
  );
  const { t } = useTranslation('game');
  const status = useSelector((state) => state.game.status);
  const theme = useSelector((state) => state.game.theme);
  const nextTheme = useSelector((state) => state.game.nextTheme);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  const parts = useMemo(() => {
    const points = advertisementOfferModal ? advertisementOfferModal.points : 0;
    const translatedText = t('advertisement.watchAndPlay', {
      points
    });
    return translatedText.split(new RegExp(`(${points})`));
  }, [t, advertisementOfferModal]);
  const isADModalHidden = useMemo(
    () => !!JSON.parse(localStorage.getItem(HIDE_ADD_MODAL_KEY)),
    [status, theme]
  );

  useEffect(() => {
    if (AdController) {
      const bannerNotFound = () => {
        console.warn('onBannerNotFound');
      };
      AdController?.addEventListener?.('onBannerNotFound', bannerNotFound);

      return () => {
        AdController?.removeEventListener?.('onBannerNotFound', bannerNotFound);
      };
    }
  }, [AdController]);

  useEffect(() => {
    if (
      advertisementOfferModal &&
      theme.id === 'hawk' &&
      status !== 'playing' &&
      !nextTheme.isSwitching
    ) {
      setIsOpen(true);
      setIsClickable(false);
      setIsClosing(false);
      setTimeout(() => {
        setIsClickable(true);
      }, 1000);
    }

    if (
      isOpen &&
      (theme.id !== 'hawk' ||
        !advertisementOfferModal ||
        nextTheme.isSwitching ||
        status === 'playing')
    ) {
      closeModal();
    }
  }, [
    advertisementOfferModal,
    theme.id,
    nextTheme.isSwitching,
    status,
    isADModalHidden
  ]);

  const disabledAdModal = () => {
    localStorage.setItem(HIDE_ADD_MODAL_KEY, true);
  };

  const showLocalAD = () => {
    dispatch(
      setAdvertisementModal({
        points: advertisementOfferModal.points,
        videoUrl: advertisementOfferModal.videoUrl,
        videoId: advertisementOfferModal.videoId
      })
    );
    closeModal();
    dispatch(setAdvertisementOfferModal(null));
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsClickable(false);
    }, 600);
  };

  const onReward = async () => {
    try {
      await endWatchingAdvertisementVideo(advertisementOfferModal.videoId);
      dispatch(refreshFreeGame({ points: advertisementOfferModal.points }));
      setIsOpen(false);
      setIsClickable(false);
      dispatch(setAdvertisementOfferModal(null));
    } catch (error) {
      console.warn(error);
    }
  };

  const onError = (e) => {
    console.warn('Adsgram error: ', e);
    showLocalAD();
  };

  const showAd = useAdsgram({ onReward, onError });

  const clickHandler = async (e) => {
    if (!isClickable) return;

    try {
      !isADModalHidden && disabledAdModal();
      if (isValidEnvVariable(ADSGRAM_BLOCK_ID)) {
        await startWatchingAdvertisementVideo(advertisementOfferModal.videoId);
        await showAd();
      } else {
        showLocalAD();
      }
    } catch (error) {
      console.warn(error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {!isADModalHidden && (
        <div
          onClick={clickHandler}
          className={classNames(
            styles.container,
            isClosing && styles['is-closing']
          )}>
          <div className={styles.content}>
            {parts.map((part, index) =>
              part ===
              `${advertisementOfferModal ? advertisementOfferModal.points : 0}` ? (
                <span key={index} className={styles.highlight}>
                  {part}
                </span>
              ) : (
                <React.Fragment key={index}>
                  {part}
                  {index < parts.length - 1 && <br />}
                </React.Fragment>
              )
            )}
          </div>
        </div>
      )}

      <div onClick={clickHandler} className={styles['model-trigger']}></div>
    </>
  );
}
