import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';

import CardsSlider from '../../../components/CardsSlider/CardsSlider';
import { BannerItem } from './BannerItem';

import { isAppStoreUrl, isiOS, isPlayStoreUrl } from '../../../utils/client';
import { getBannersEffect } from '../../../effects/bannerEffect';
import { API_PATH_ROOT } from '../../../utils/api-urls';
import Loader2 from '../../../components/Loader2/Loader2';
import BannerSource from '../assets/banner.png';

const createBanners = ({ onClick, banners, onOpenShareModal, storageSize }) => {
  const items = banners.map((banner) => ({
    ...banner,
    bg: API_PATH_ROOT + banner.image,
    onClick: () => {
      onClick(banner.link, banner.link_second);
    }
  }));
  return [
    {
      id: 0,
      onOpenShareModal,
      bg: BannerSource,
      initialBaner: true,
      storageSize
    },
    ...items
  ];
};

const Banner = ({ storageSize, onOpenShareModal, ...res }) => {
  const [banners, setBanners] = useState([]);
  const { t } = useTranslation('system');

  useEffect(() => {
    getBannersEffect()
      .then((data) => setBanners(data))
      .catch(() => {
        toast.error(t('message.errorAndRetry'), {
          position: 'bottom-center'
        });
      });
  }, []);

  const handleClick = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  };

  const getUrlForDevice = (firstUrl, secondUrl) => {
    if (isAppStoreUrl(firstUrl)) return isiOS() ? firstUrl : secondUrl;
    if (isPlayStoreUrl(firstUrl)) return isiOS() ? secondUrl : firstUrl;
    return firstUrl;
  };

  const doRedirectToApp = (firstUrl, secondUrl) => {
    if (!firstUrl && !secondUrl) return;

    if (firstUrl && secondUrl) {
      const urlToUse = getUrlForDevice(firstUrl, secondUrl);
      handleClick(urlToUse);
    } else {
      handleClick(firstUrl || secondUrl);
    }
  };

  const slides = useMemo(() => {
    return createBanners({
      onClick: doRedirectToApp,
      banners,
      storageSize
    }).map((el) => ({
      id: el.id,
      html: <BannerItem key={el.id} {...el} />
    }));
  }, [banners]);

  return (
    <div className={styles.banner} {...res}>
      {banners.length > 0 ? (
        <CardsSlider items={slides} timeout={10000} />
      ) : (
        <Loader2 />
      )}
    </div>
  );
};

export { Banner };
