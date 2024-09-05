import React, { useMemo } from "react"
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';

import CardsSlider from '../../../components/CardsSlider/CardsSlider';
import { BannerItem } from './BannerItem';
import ComputingRef from '../assets/computing-banner.png';
import GeoPinRef from '../assets/geo-pin-banner.png';
import StorageRef from '../assets/storage-banner.png';
import TokenizationRef from '../assets/tokenization-banner.png';
import UploadRef from '../assets/upload-banner.png';

import { isiOS } from '../../../utils/client';
import { MOBILE_APP_LINKS } from '../../../config/contracts';

  const bannes = (t) => [
    {
      id: 1,
      title: t('banner.upload'),
      text:  t('banner.uploadText'),
      revers: true,
      bg: UploadRef,
    },
    {
      id: 2,
      title: t('banner.compression'),
      text:  t('banner.compressionText'),
      revers: false,
      bg: StorageRef,
    },
    {
      id: 3,
      title: t('banner.tokenization'),
      text:  t('banner.tokenizationText'),
      revers: false,
      bg: TokenizationRef,
    },
    {
      id: 4,
      title: t('banner.computing'),
      text:  t('banner.computingText'),
      revers: false,
      bg: ComputingRef,
    },
    {
      id: 5,
      title: t('banner.geoPin'),
      text:  t('banner.geoPinText'),
      revers: false,
      bg: GeoPinRef,
    },
  ];

const Banner = ({ ...res }) => {
  const { t } = useTranslation('system');
  const slides = useMemo(() => {
    return bannes(t).map((el) => {
      return { id: el.id, html: <BannerItem key={el?.id} {...el} /> };
    });
  }, []);

  const doRedirectToApp = () => {
    const link = document.createElement('a');
    link.href = isiOS ? MOBILE_APP_LINKS.iOS : MOBILE_APP_LINKS.android;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className={styles.banner} onClick={doRedirectToApp} {...res} >
      <CardsSlider items={slides} timeout={10000} />
    </div>
  )
}

export { Banner };