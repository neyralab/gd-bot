import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import CN from 'classnames';

import { AutosizeInput } from '../../../../components/autosizeInput';
import { ReactComponent as CloseIcon } from '../../../../assets/close.svg';
import Slider from '../../../../components/slider';
import { Button } from '../../../../components/button';

import { storageSendEffect } from '../../../../effects/storageEffects';
import { getToken } from '../../../../effects/set-token';
import { setUser } from '../../../../store/reducers/userSlice';
import { getUserEffect } from '../../../../effects/userEffects';
import { getResponseError } from '../../../../utils/string';

import { fromByteToMb, fromMbToBytes, transformSize } from '../../../../utils/storage';

import styles from './styles.module.scss';

const oneGBinBytes = 1073741824;
const minUsernameLength = 3;

const ShareStorage = ({ onClose, handleFullScreeView }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { t } = useTranslation('system');
  const [loading, setLoading] = useState(false);
  const [inputValue, setIputValue] = useState(0);
  const [availableSize, setAvailableSize] = useState({ bytes: 0, mb: 0 });
  const [userName, setUserName] = useState('');
  const user = useSelector((state) => state?.user?.data);
  const isDisabled = useMemo(() => (
    userName.length <= minUsernameLength || !inputValue || loading
  ), [inputValue, userName, loading]);

  useEffect(() => {
    const usedSpace = user.space_used;
    const availableSpace = user.space_available;
    const allowSpace = usedSpace > oneGBinBytes ? availableSpace : user.space_total - oneGBinBytes;
    setAvailableSize({
      bytes: allowSpace,
      mb: Math.floor(fromByteToMb(allowSpace)),
    });
  }, [user]);


  const onUserNameChange = ({ target: { value } }) => {
    if (value && !value.includes('@')) {
      setUserName(`@${value}`);
    } else if (value === '@') {
      setUserName('');
    } else {
      setUserName(value);
    }
  }

  const onChangeSize = (size) => {
    const value = Number(size);
    if (size <= availableSize.mb) {
      setIputValue(value);
    }
  }

  const onFocusInput = () => {
    inputRef.current.focus();
  }

  const onSendStorage = async () => {
    try {
      if (!isDisabled) {
        setLoading(true);
        const data = await storageSendEffect({
          storage: fromMbToBytes(inputValue),
          username: userName.replace('@', '')
        });
        if (data.message === "success") {
          toast.success(t('share.successfullySend').replace('{size}', transformSize(fromMbToBytes(inputValue))).replace('{name}', userName), {
            theme: 'colored',
            position: 'top-center'
          });
          const token = await getToken();
          const updatedUser = await getUserEffect(token);
          dispatch(setUser(updatedUser));
          setLoading(false);
          onClose()
        }
      } 
    } catch (error) {
      setLoading(false);
      console.warn(error);
      toast.error(getResponseError(error), {
        theme: 'colored',
        position: 'top-center'
      });
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
        <div
          onClick={onFocusInput}
          className={styles['input-container']}
        >
          <div className={styles['input-field']}>
            <AutosizeInput
              ref={inputRef}
              type="number"
              value={inputValue}
              className={styles['input']}
              onChange={onChangeSize}
              onFocus={() => {handleFullScreeView(true)}}
              onBlur={() => {handleFullScreeView(false)}}
            />
            <span className={styles['input-size-prefix']}>MB</span>
            <span className={styles['input-size']}>{`/${fromByteToMb(user.space_available)}MB`}</span>
          </div>
          <span className={styles['input-text']}>{t('share.storage')}</span>
        </div>
        <Slider
          maxValue={availableSize.mb}
          value={inputValue}
          className={styles['slider']}
          onChange={onChangeSize}
        />
        <input
          value={userName}
          className={styles["username-input"]}
          placeholder="@Username"
          onChange={onUserNameChange}
          onFocus={() => {handleFullScreeView(true)}}
          onBlur={() => {handleFullScreeView(false)}}
        />
      </div>
      <div className={styles['footer']}>
        <Button
          disable={isDisabled}
          className={CN(styles['footer-action'], isDisabled && styles['footer-action-disabled'])}
          label={t('share.share')}
          onClick={onSendStorage}
        />
      </div>
    </div>
  )
}

export default ShareStorage;