import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setAdvertisementModal,
  setAdvertisementOfferModal
} from '../../../store/reducers/gameSlice';
import { ReactComponent as PlayIcon } from '../../../assets/play_media.svg';
import AdvertisementOfferModalSvg from './AdvertisementOfferModalSvg';
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
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (
      advertisementOfferModal &&
      theme.id === 'hawk' &&
      status !== 'playing' &&
      !nextTheme.isSwitching
    ) {
      setIsOpen(true);
      setIsClickable(false);
      setImage(advertisementOfferModal.previewUrl);
      setIsClosing(false);
      setTimeout(() => {
        setIsClickable(true);
      }, 1000);
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setImage(null);
        setIsClosing(false);
        setIsClickable(false);
      }, 600);
    }
  }, [advertisementOfferModal, theme.id, nextTheme, status]);

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
    dispatch(setAdvertisementOfferModal(null));
  };

  if (!isOpen) return;

  return (
    <div
      onClick={clickHandler}
      className={classNames(
        styles.container,
        isClosing && styles['is-closing']
      )}>
      <div className={styles.hexagon}>
        <AdvertisementOfferModalSvg image={image} />
      </div>

      <div className={styles.content}>
        <div className={styles.icon}>
          <PlayIcon />
        </div>

        <span>{t('advertisement.watchAndPlay')}</span>
      </div>
    </div>
  );
}
