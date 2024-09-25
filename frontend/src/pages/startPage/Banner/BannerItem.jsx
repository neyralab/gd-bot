import React, { forwardRef, useMemo } from 'react';
import CN from 'classnames';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LogoIcon } from '../../../assets/ghost.svg';
import { transformSize } from '../../../utils/transformSize';
import { available_tariffs } from '../../boost';

import styles from './styles.module.css';

const MIN_SHARE_SIZE = 262144000;

const BannerItem = forwardRef(
  (
    {
      title,
      text,
      revers,
      initialBaner,
      bg,
      onClick,
      storageSize,
      onOpenShareModal
    },
    ref
  ) => {
    const { t } = useTranslation('system');
    const isGiftShareModalAllowed = useMemo(() => {
      if (storageSize > available_tariffs['1GB']) {
        const availableSize = storageSize - available_tariffs['1GB'];
        return availableSize > MIN_SHARE_SIZE;
      } else {
        return false;
      }
    }, [initialBaner, storageSize]);

    return (
      <div className={styles.bannerItem} onClick={onClick} ref={ref}>
        <img className={styles.image} src={bg} alt={title} />
        {initialBaner ? (
          <div className={styles.bannerHeader}>
            <div
              className={styles.logo}
              onClick={isGiftShareModalAllowed ? onOpenShareModal : undefined}>
              <LogoIcon />
              {isGiftShareModalAllowed && (
                <span className={styles.shareText}>{t('share.share')}</span>
              )}
            </div>
            <span className={styles.price}>{transformSize(storageSize)}</span>
          </div>
        ) : (
          <div className={CN(styles.info, revers && styles.revers)}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.text}>{text}</p>
          </div>
        )}
      </div>
    );
  }
);

export { BannerItem };
