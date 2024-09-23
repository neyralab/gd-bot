import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { TelegramShareButton } from 'react-share';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import CN from 'classnames';

import { ReactComponent as CloseIcon } from '../../../../assets/close.svg';

import { createGiftTokenEffect } from '../../../../effects/storageEffects';
import { BOT_NAME } from '../../../../utils/api-urls';

import styles from './styles.module.scss';

const optionList = [
  {
    label: '250MB',
    value: 262144000,
  },
  {
    label: '500MB',
    value: 524288000,
  },
  {
    label: '1GB',
    value: 1073741824,
  },
]
const oneGBinBytes = 1073741824;

const ShareStorage = ({ onClose }) => {
  const { t } = useTranslation('system');
  const [selectedSize, setSelectedSize] = useState(0);
  const [token, setToken] = useState('');
  const user = useSelector((state) => state?.user?.data);

  const allowSpace = useMemo(() => {
    const usedSpace = user.space_used;
    const availableSpace = user.space_available;
    return usedSpace > oneGBinBytes ? availableSpace : user.space_total - oneGBinBytes;
  }, [user]);
  const url = useMemo(() =>
    (`https://t.me/${BOT_NAME}?start=storageGift_${token}`),
  [token]);

  const handleCreateShare = async (size) => {
    try {
      setSelectedSize(size);
      const token = await createGiftTokenEffect(size);
      setToken(token.token);
    } catch (error) {
      console.warn(error);
    }
  }

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <h1 className={styles['header-title']}>{t('share.shareStorage')}</h1>
        <button
          onClick={onClose}
          className={styles['header-button']}
        >
          <CloseIcon />
        </button>
      </div>
      <div className={styles['form']}>
        {optionList.map(({ label, value }) => (
          <button
            key={value}
            className={CN(
              styles['form-action'],
              selectedSize === value && styles['form-action-active']
            )}
            disabled={allowSpace < value}
            onClick={() => {handleCreateShare(value)}}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles['footer']}>
        <TelegramShareButton
          url={url}
          className={styles['footer-action']}
          disabled={!selectedSize}
        >
          {t('share.share')}
        </TelegramShareButton>
      </div>
    </div>
  )
}

export default ShareStorage;