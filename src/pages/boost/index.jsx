import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CN from 'classnames';
import {
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';
import { toast } from 'react-toastify';
import TonWeb from 'tonweb';
import { useTranslation } from 'react-i18next';

import { StorageIcon } from './icon';
import { Header } from '../../components/header';
import { selectCurrentWorkspace } from '../../store/reducers/workspaceSlice';
import {
  handlePaymentSelectModal,
  selectPaymentSelectModal
} from '../../store/reducers/modalSlice';
import { DEFAULT_TARIFFS_NAMES } from '../upgradeStorage';
import { selectPaymenttByKey } from '../../store/reducers/paymentSlice';
import { getTonWallet, makeInvoice } from '../../effects/paymentEffect';
import { storageListEffect } from '../../effects/storageEffects';
import { SlidingModal } from '../../components/slidingModal';
import PaymentMenu from '../../components/paymentMenu/Menu';
import { transformSize } from '../../utils/transformSize';
import { ReactComponent as Star } from '../../assets/star.svg';
import { ReactComponent as Ton } from '../../assets/TON.svg';
import { vibrate } from '../../utils/vibration';
import { INVOICE_TYPE } from '../../utils/createStarInvoice';
import { isDevEnv } from '../../utils/isDevEnv';
import { sleep } from '../../utils/sleep';
import { getToken } from '../../effects/set-token';
import { runInitAnimation } from './animations';
import {
  isStarsPaymentEnabled,
  isAnyPaymentEnabled,
  isAllPaymentEnabled
} from '../../utils/paymentChecker';

import styles from './styles.module.css';

export const available_tariffs = {
  '1GB': 1073741824,
  '100GB': 107374182400,
  '1TB': 1099511627776,
  '3TB': 3298534883328
};

export const BoostPage = ({ tariffs, setTariffs }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeMultiplier, setActiveMultiplier] = useState();
  const { t } = useTranslation('system');
  const ws = useSelector(selectCurrentWorkspace);
  const isPaymentModalOpen = useSelector(selectPaymentSelectModal);
  const storagePayment = useSelector(selectPaymenttByKey('storage'));
  const user = useSelector((state) => state.user.data);
  const wallet = useTonWallet();
  const isDev = isDevEnv();
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tariffs) return;
    runInitAnimation();
  }, [tariffs]);

  const spaceTotal = useMemo(() => {
    if (user?.space_actual) return user?.space_actual;

    const space = user?.space_total;
    const tariffs = ['1GB', '100GB', '1TB', '3TB'];

    return tariffs.reduce(
      (result, tariff) =>
        space >= available_tariffs[tariff] ? available_tariffs[tariff] : result,
      available_tariffs['1GB']
    );
  }, [user?.space_total, user?.space_actual]);

  const currentPrice = useMemo(() => {
    return tariffs?.find((tariff) => tariff.storage === spaceTotal);
  }, [spaceTotal, tariffs]);

  const payByTON = async (el) => {
    try {
      setActiveMultiplier((prev) =>
        prev?.storage === el.storage ? undefined : el
      );
      if (!el) {
        return;
      }
      const paymentInfo = {
        user_id: user.id,
        workspace_id: ws,
        storage_id: el?.id
      };
      const { address: recipientWallet, memo } = await getTonWallet(
        dispatch,
        paymentInfo
      );
      const cell = new TonWeb.boc.Cell();
      cell.bits.writeUint(0, 32);
      cell.bits.writeString(memo);
      const boc = await cell.toBoc();
      const payload = TonWeb.utils.bytesToBase64(boc);
      console.log({ payload, memo });
      if (wallet) {
        if (recipientWallet) {
          const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
            messages: [
              {
                address: recipientWallet,
                amount: el?.ton_price * 1000000000,
                payload
              }
            ]
          };
          await tonConnectUI.sendTransaction(transaction, {
            modals: ['before', 'error'],
            notifications: []
          });
          toast.success(t('message.successPayment'), {
            theme: 'colored',
            position: 'bottom-center',
            autoClose: 2500
          });
        } else {
          setActiveMultiplier(undefined);
          toast.error(t('message.error'), {
            theme: 'colored',
            position: 'bottom-center',
            autoClose: 2500
          });
        }
      } else {
        open();
      }
    } catch (e) {
      console.log({ errrrrr: e });
      const errorMessage = e?.message?.includes('Canceled by the user')
        ? t('message.canceledTransaction')
        : t('message.errorAndRetry');
      toast.error(errorMessage, {
        theme: 'colored',
        position: 'bottom-center',
        autoClose: 2500
      });
    }
  };

  const invoiceCallback = async (result) => {
    try {
      if (result === 'paid') {
        await sleep(500);
        const token = await getToken();
        await storageListEffect(token).then((data) => {
          setTariffs(data);
        });
      } else {
        console.warn(`error: The payment was not completed. ${result}`);
      }
    } catch (error) {
      console.warn('error: ', error);
    }
  };

  const handleStartPayment = (el) => {
    if (el.action === 'ton') {
      payByTON(el);
    } else {
      const input = isDev ?
        `${storagePayment.Type};${el?.id};${user.id};${ws}`:
        `${el?.id};${user.id};${ws}`;

      const theme = {
        multiplier: el.multiplicator,
        stars: el.stars
      };
      makeInvoice({
        input,
        dispatch,
        callback: invoiceCallback,
        type: INVOICE_TYPE.boost,
        theme,
        isDev,
      });
    }
    onClosePaymentModal();
  };

  const onClosePaymentModal = () => {
    setSelectedPayment(null);
    dispatch(handlePaymentSelectModal(false));
  };

  const handleSelect = (el) => {
    if (isAnyPaymentEnabled && !isAllPaymentEnabled) {
      const body = isStarsPaymentEnabled
        ? { action: 'star', path: 'stars' }
        : { action: 'ton', path: 'ton_price' }
      handleStartPayment({ ...el, ...body })
    } else if (isAllPaymentEnabled) {
      setSelectedPayment(el);
      dispatch(handlePaymentSelectModal(true));
    }
  };

  return (
    <div className={styles.container}>
      <Header label={t('boost.upgradeStorage')} className={styles.backBtn} />

      {tariffs && (
        <>
          <div>
            <p
              data-animation="boost-animation-2"
              className={CN(
                styles.header,
                styles['initial-state-for-animation']
              )}>
              {t('boost.multiplier')}
            </p>

            <div
              data-animation="boost-animation-1"
              className={CN(
                styles.current_item,
                styles['initial-state-for-animation']
              )}>
              <div className={styles.flex}>
                <StorageIcon storage={currentPrice} />
                <p className={styles.current_storage}>
                  <span className={styles.span}>
                    {DEFAULT_TARIFFS_NAMES[spaceTotal] || '1GB'}
                  </span>
                  {` ${t('boost.storage')}`}
                </p>
              </div>
              <div className={styles.cost}>
                <p className={styles.cost_value}>
                  {currentPrice?.stars || '0'}
                </p>
                <Star className={styles.current_diamond} viewBox="0 0 21 21" />
              </div>
            </div>
          </div>

          <div>
            <p
              data-animation="boost-animation-2"
              className={CN(
                styles.header,
                styles['initial-state-for-animation']
              )}>
              {t('boost.boostMultiplier')}
            </p>

            <ul className={styles.list}>
              {tariffs?.map((el, index) => (
                <li
                  data-animation="boost-animation-1"
                  className={styles['initial-state-for-animation']}
                  key={index}
                  onClick={vibrate}>
                  <button
                    disabled={currentPrice?.storage === el?.storage}
                    onClick={() => {
                      handleSelect(el);
                    }}
                    className={CN(
                      styles.item,
                      activeMultiplier?.storage === el.storage &&
                        styles.active_item
                    )}>
                    <div className={styles.flex}>
                      <StorageIcon storage={el} />
                      <div className={styles.item_storage}>
                        <p className={styles.storage}>
                          {transformSize(el?.storage)}
                        </p>
                        <p className={styles.item_text}>
                          {t('boost.storageYear')}
                        </p>
                      </div>
                    </div>
                    {isAnyPaymentEnabled ? (
                      <div className={styles.cost}>
                        <p className={styles.cost_value}>{ isStarsPaymentEnabled ? el?.stars : el.ton_price}</p>
                        { isStarsPaymentEnabled ? (
                          <Star className={styles.cost_svg} viewBox="0 0 21 21" /> ) : (
                          <Ton className={styles.cost_svg} viewBox="0 0 25 28" /> )
                        }
                      </div>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <SlidingModal
        onClose={onClosePaymentModal}
        isOpen={isPaymentModalOpen}
        snapPoints={[190, 190, 50, 0]}>
        <PaymentMenu payload={selectedPayment} onClick={handleStartPayment} />
      </SlidingModal>
    </div>
  );
};
