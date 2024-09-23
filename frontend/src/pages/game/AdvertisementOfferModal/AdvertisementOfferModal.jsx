import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setAdvertisementModal,
  setAdvertisementOfferModal
} from '../../../store/reducers/gameSlice';
import styles from './AdvertisementOfferModal.module.scss';

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

  const points = 1000;
  const parts = useMemo(() => {
    const translatedText = t('advertisement.watchAndPlay', { points });
    return translatedText.split(new RegExp(`(${points})`));
  }, [t, points]);

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
  }, [advertisementOfferModal, theme.id, nextTheme.isSwitching, status]);

  const clickHandler = (e) => {
    if (!isClickable) return;
    e?.preventDefault();
    e?.stopPropagation();
    dispatch(
      setAdvertisementModal({
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

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={clickHandler}
        className={classNames(
          styles.container,
          isClosing && styles['is-closing']
        )}>
        <div className={styles.content}>
          {parts.map((part, index) =>
            part === `${points}` ? (
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

      <div onClick={clickHandler} className={styles['model-trigger']}></div>
    </>
  );
}