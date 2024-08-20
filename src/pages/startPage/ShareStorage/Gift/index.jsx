import React, { useState } from "react";
import CN from 'classnames';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ReactComponent as CloseIcon } from '../../../../assets/close.svg';
import { Button } from '../../../../components/button';
import { getResponseError } from '../../../../utils/string';

import {
  acceptStorageGiftEffect,
  rejectStorageGiftEffect
} from '../../../../effects/storageEffects';
import { getToken } from '../../../../effects/set-token';
import { setUser } from '../../../../store/reducers/userSlice';
import { getUserEffect } from '../../../../effects/userEffects';

import styles from '../ShareForm/styles.module.scss';

const Gift = ({ onCloseGift, giftData, systemModalRef }) => {
  const { t } = useTranslation('system');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);  const item = giftData.length ? giftData[0] : { text: '' }
  const sender = item?.text?.split(' ')[0] || '';
  const size = item?.text?.split(' ')[4] || '';

  const onAccept = async () => {
    try {
      setLoading(true);
      const data = await acceptStorageGiftEffect(item.id);
      if (data.message === "success") {
        const token = await getToken();
        const updatedUser = await getUserEffect(token);
        dispatch(setUser(updatedUser));
        systemModalRef.current.open({
          title: t('increaseStorage').replace('{size}', size),
          text: t('share.increaseStorageDesc').replace('{size}', size),
         });
        setLoading(false);
        onCloseGift();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(getResponseError(error), {
        theme: 'colored',
        position: 'top-center'
      });
    }
  }

  const onReject = async () => {
    try {
      setLoading(true);
      const data = await rejectStorageGiftEffect(item.id);
      if (data.message === "success") {
        systemModalRef.current.open({
          title: t('share.declineIncrease'),
          text: t('share.declineIncreaseDesc').replace('{size}', size),
         });
        setLoading(false);
        onCloseGift();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(getResponseError(error), {
        theme: 'colored',
        position: 'top-center'
      });
    }
  }

  const handleReject = () => {
    systemModalRef.current.open({
      title: t('share.areYouSure'),
      actions: [
        {
          type: 'primary',
          text: t('share.decline'),
          onClick: () => {
            systemModalRef.current.close();
            onReject();
          }
        },
        {
          type: 'default',
          text: t('share.accept'),
          onClick: () => {
            systemModalRef.current.close();
            onAccept();
          }
        },
      ]
    });
  }

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <h1 className={styles['header-title']}>{t('share.shareStorage')}</h1>
        <button
          onClick={handleReject}
          className={styles['header-button']}
        >
          <CloseIcon />
        </button>
      </div>
      <div className={styles['gift']}>
        <div className={styles['gift-header']}>
          <span className={styles['gift-header-badget']}>
            {`@${sender}`}
          </span>
        </div>
        <div className={styles['gift-preview']}>
          <h1>{`+${size}`}</h1>
          <img src="/assets/gift.webp" alt="Gift" />
        </div>
      </div>
      <div className={styles['gift-footer']}>
        <Button
          disable={loading}
          className={CN(styles['gift-action'], loading && styles['footer-action-disabled'])}
          label={t('share.accept')}
          onClick={onAccept}
        />
      </div>
    </div>
  )
}

export default Gift;