import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setAdvertisementModal,
  setAdvertisementOfferModal
} from '../../../store/reducers/gameSlice';
import { ReactComponent as PlayIcon } from '../../../assets/play_media.svg';
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
        <svg
          viewBox="0 0 300 339"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_5953_29029)">
            {image && (
              <image
                href={image}
                x="0"
                y="0"
                width="300"
                height="339"
                clipPath="url(#hexagon-clip)"
                filter="url(#blur-filter)"
                preserveAspectRatio="xMidYMid slice"
                opacity="1"
              />
            )}

            <path
              d="M141.918 7.66593C146.919 4.77864 153.081 4.77864 158.082 7.66593L284.813 80.8341C289.814 83.7214 292.894 89.0573 292.894 94.8319V241.168C292.894 246.943 289.814 252.279 284.813 255.166L158.082 328.334C153.081 331.221 146.919 331.221 141.918 328.334L15.1874 255.166C10.1865 252.279 7.1058 246.943 7.1058 241.168V94.8319C7.1058 89.0573 10.1865 83.7214 15.1874 80.8341L141.918 7.66593Z"
              fill="#181E20"
              opacity="0.8"
            />
            <path
              d="M142.043 7.88244C146.967 5.03981 153.033 5.03981 157.957 7.88244L284.688 81.0506C289.611 83.8932 292.644 89.1466 292.644 94.8319V241.168C292.644 246.853 289.611 252.107 284.688 254.949L157.957 328.118C153.033 330.96 146.967 330.96 142.043 328.118L15.3124 254.949C10.3889 252.107 7.3558 246.853 7.3558 241.168V94.8319C7.3558 89.1466 10.3889 83.8932 15.3124 81.0506L142.043 7.88244Z"
              stroke="white"
              strokeWidth="0.5"
            />
          </g>
          <defs>
            <clipPath id="hexagon-clip">
              <path
                d="M141.918 7.66593C146.919 4.77864 153.081 4.77864 158.082 7.66593L284.813 80.8341C289.814 83.7214 292.894 89.0573 292.894 94.8319V241.168C292.894 246.943 289.814 252.279 284.813 255.166L158.082 328.334C153.081 331.221 146.919 331.221 141.918 328.334L15.1874 255.166C10.1865 252.279 7.1058 246.943 7.1058 241.168V94.8319C7.1058 89.0573 10.1865 83.7214 15.1874 80.8341L141.918 7.66593Z"
                fill="#181E20"
              />
            </clipPath>
            <filter id="blur-filter" x="0" y="0">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter
              id="filter0_d_5953_29029"
              x="0.910039"
              y="0.651021"
              width="298.18"
              height="337.392"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.34694" />
              <feGaussianBlur stdDeviation="3.09796" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0961362 0 0 0 0 0.447469 0 0 0 0 0.717725 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_5953_29029"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_5953_29029"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
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
