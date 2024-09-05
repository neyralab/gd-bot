import React, { useMemo } from "react";
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';

import CardsSlider from '../../../components/CardsSlider/CardsSlider';
import { BannerItem } from './BannerItem';
import InitialRef from '../assets/initial-banner.png';
import ComputingRef from '../assets/computing-banner.png';
import GeoPinRef from '../assets/geo-pin-banner.png';
import StorageRef from '../assets/storage-banner.png';
import TokenizationRef from '../assets/tokenization-banner.png';
import UploadRef from '../assets/upload-banner.png';

import { isiOS } from '../../../utils/client';
import { MOBILE_APP_LINKS } from '../../../config/contracts';

const createBanners = ({ t, onClick, storageSize, onOpenShareModal }) => [
  {
    id: 0,
    initialBaner: true,
    storageSize,
    onOpenShareModal,
    bg: InitialRef,
  },
  {
    id: 1,
    title: t('banner.upload'),
    text: t('banner.uploadText'),
    bg: UploadRef,
  },
  {
    id: 2,
    title: t('banner.compression'),
    text: t('banner.compressionText'),
    bg: StorageRef,
  },
  {
    id: 3,
    title: t('banner.tokenization'),
    text: t('banner.tokenizationText'),
    bg: TokenizationRef,
  },
  {
    id: 4,
    title: t('banner.computing'),
    text: t('banner.computingText'),
    bg: ComputingRef,
  },
  {
    id: 5,
    title: t('banner.geoPin'),
    text: t('banner.geoPinText'),
    bg: GeoPinRef,
  },
].map((banner) => ({
  ...banner,
  title: banner.title || '',
  text: banner.text || '',
  initialBaner: banner.initialBaner || false,
  storageSize: banner.storageSize || '',
  onOpenShareModal: banner.onOpenShareModal || (() => {}),
  onClick: banner.onClick || (() => {}),
  revers: banner.revers || false,
}));

const Banner = ({ storageSize, onOpenShareModal, ...res }) => {
  const { t } = useTranslation('system');

  const doRedirectToApp = () => {
    const link = document.createElement('a');
    link.href = isiOS ? MOBILE_APP_LINKS.iOS : MOBILE_APP_LINKS.android;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const slides = useMemo(() => {
    return createBanners({ t, onClick: doRedirectToApp, storageSize, onOpenShareModal }).map((el) => ({
      id: el.id,
      html: <BannerItem key={el.id} {...el} />
    }));
  }, [t, storageSize, onOpenShareModal]);

  return (
    <div className={styles.banner} {...res}>
      <CardsSlider items={slides} timeout={10000} />
    </div>
  );
};

export { Banner };
