import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { fomatNumber, getNumbers } from '../../../utils/string';
import { MAX_POINT_COUNT } from '../../../pages/balance';
import { useClickOutside } from '../../../utils/useClickOutside';

import styles from './styles.module.css';

export const TextInput = ({ pointCount, setPointCount, pointBalance }) => {
  const { t } = useTranslation('system');
  const textInputRef = useRef(null);
  const [show, setShow] = useState(false);

  const onShow = () => {
    setShow(true);
  }

  useEffect(() => {
    if (show && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [show, textInputRef])

  const handleClickOutside = () => {
    setShow(false);
  };

  useClickOutside(textInputRef, handleClickOutside);
  
  const onPointCountChange = ({ target: { value } }) => {
    if (!value) {
      setPointCount('');
      return;
    }

    const nextValue = Number(getNumbers(value));
    if (nextValue > pointBalance)
      return;

    if (MAX_POINT_COUNT < nextValue) {
      toast.error(t('convert.convertLimit'));
      return;
    }

    setPointCount(fomatNumber(nextValue) || 0);
  }

  const onFocus = () => {
    if (pointCount === 0 || pointCount === '0') {
      setPointCount('')
    }
  }

  return (
    <div
      className={styles.left}
      onClick={onShow}
    >
      {show ?
        <input
          ref={textInputRef}
          onFocus={onFocus}
          className={styles.input}
          onChange={onPointCountChange}
          value={pointCount}
          type='text'
        /> :
        <p className={styles.count}>{pointCount || 0}</p>
      }
      <span className={styles.text}>{t('convert.enterPoints')}</span>
    </div>
  );
};
