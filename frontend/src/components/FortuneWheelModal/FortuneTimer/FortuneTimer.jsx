import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTimer } from 'react-timer-hook';
import { useTranslation } from 'react-i18next';
import { isDevEnv } from '../../../utils/isDevEnv';
import { formatTime } from '../../../utils/dates';
import { INVOICE_TYPE } from '../../../utils/createStarInvoice';
import { makeInvoice } from '../../../effects/paymentEffect';
import { selectPaymenttByKey } from '../../../store/reducers/paymentSlice';
import { ReactComponent as StarIcon } from '../../../assets/star.svg';
import styles from './FortuneTimer.module.scss';

export default function FortuneTimer({ timestamp, onComplete }) {
  const { t } = useTranslation('game');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const spinType = useSelector(selectPaymenttByKey('spin_game'));
  const isDev = useMemo(() => isDevEnv(), []);

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: timestamp,
    onExpire: () => {
      onComplete?.();
    }
  });

  const invoiceCallback = async (result) => {
    try {
      if (result === 'paid') {
        await sleep(600);
        onComplete?.();
      } else {
        console.warn(`error: The payment was not completed. ${result}`)
      }
    } catch (error) {
      console.warn('error: ', error);
    }
  };

  const onBuy = () => {
    const input = `${spinType.Type};0;${user.id};0;0`;
    makeInvoice({
      input,
      dispatch,
      callback: invoiceCallback,
      type: INVOICE_TYPE.spin,
      theme: { stars: isDev ? 1 : 400 }
    }); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.description}>{t('earn.wheelNextSpin')}</div>
      <div className={styles.timer}>
        {formatTime(hours || 24)}:{formatTime(minutes || 0)}:
        {formatTime(seconds || 0)}
      </div> 
      {isDev && (
        <div className={styles.actions}>
          <button onClick={onBuy}>
            <span>1 Spin</span> <b>400</b> <StarIcon />
          </button>
        </div>
      )}
    </div>
  );
}
