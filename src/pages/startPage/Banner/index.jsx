import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';

import CardsSlider from '../../../components/CardsSlider/CardsSlider';
import { BannerItem } from './BannerItem';

import { isiOS } from '../../../utils/client';
import { MOBILE_APP_LINKS } from '../../../config/contracts';
import { getBannersEffect } from '../../../effects/bannerEffect';
import { API_PATH_ROOT } from '../../../utils/api-urls';
import Loader2 from '../../../components/Loader2/Loader2';

const createBanners = ({ onClick, banners }) =>
  banners.map((banner) => ({
    ...banner,
    bg: API_PATH_ROOT + banner.image,
    onClick: () => {
      onClick(banner.link);
    }
  }));

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

  const doRedirectToApp = (url) => {
    const mobileUrl = isiOS ? MOBILE_APP_LINKS.iOS : MOBILE_APP_LINKS.android;
    const link = document.createElement('a');
    link.href = url ? url : mobileUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const slides = useMemo(() => {
    return createBanners({
      onClick: doRedirectToApp,
      banners
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
