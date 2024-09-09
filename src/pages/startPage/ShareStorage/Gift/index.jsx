import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import CN from 'classnames';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ReactComponent as CloseIcon } from '../../../../assets/close.svg';
import { Button } from '../../../../components/button';
import { getResponseError } from '../../../../utils/string';
import { transformSize } from '../../../../utils/transformSize';

import {
  acceptStorageGiftEffect,
  rejectStorageGiftEffect,
  checkGiftTokenEffect,
} from '../../../../effects/storageEffects';
import { getToken } from '../../../../effects/set-token';
import { setUser } from '../../../../store/reducers/userSlice';
import { getUserEffect } from '../../../../effects/userEffects';

import styles from '../ShareForm/styles.module.scss';

const Gift = ({ onClose, systemModalRef, giftToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('system');
  const [initialData, setInitialData] = useState({ name: 'roma', size: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await checkGiftTokenEffect(giftToken);
        setInitialData({ name: data?.user?.username || '', size: data?.bytes || 0 });
      } catch (error) {
        clearSearchParams();
      }
    }
    if (giftToken) {
      init()
    }
  }, [giftToken]);

  const clearSearchParams = () => {
    const params = new URLSearchParams(location.search);

    if (params.has('storageGift')) {
      params.delete('storageGift');

      navigate({
        pathname: location.pathname,
        search: params.toString(),
      }, { replace: true });
    }
  }

  const onAccept = async () => {
    try {
      setLoading(true);
      const data = await acceptStorageGiftEffect(giftToken);
      if (data.message === "success") {
        const token = await getToken();
        const updatedUser = await getUserEffect(token);
        dispatch(setUser(updatedUser));
        systemModalRef.current.open({
          title: t('share.increaseStorage').replace('{size}', initialData.size),
          text: t('share.increaseStorageDesc').replace('{size}', initialData.size),
         });
        setLoading(false);
        onClose();
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
      const data = await rejectStorageGiftEffect(giftToken);
      if (data.message === "success") {
        systemModalRef.current.open({
          title: t('share.declineIncrease'),
          text: t('share.declineIncreaseDesc').replace('{size}', initialData.size),
         });
        setLoading(false);
        onClose();
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
        <h1 className={styles['header-title']}>{t('share.shareGift')}</h1>
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
            {`@${giftToken ? initialData.name : sender}`}
          </span>
        </div>
        <div className={styles['gift-preview']}>
          <h1>{`+${giftToken ? transformSize(initialData.size) : size}`}</h1>
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