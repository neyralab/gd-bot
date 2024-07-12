import CN from 'classnames';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';
import { toast } from 'react-toastify';
import TonWeb from 'tonweb';

import { StorageIcon } from './icon';
import { Header } from '../../components/header';
import { selectCurrentWorkspace } from '../../store/reducers/workspaceSlice';
import { handlePaymentSelectModal, selectPaymentSelectModal } from '../../store/reducers/modalSlice';
import { DEFAULT_TARIFFS_NAMES } from '../upgradeStorage';
import { getTonWallet } from '../../effects/paymentEffect';
import { SlidingModal } from '../../components/slidingModal';
import PaymentMenu from '../../components/paymentMenu/Menu';
import { sendStarInvoice } from '../../effects/paymentEffect';
import { transformSize } from '../../utils/transformSize';

import { ReactComponent as Star } from '../../assets/star.svg';
import useButtonVibration from '../../hooks/useButtonVibration';
import { createInvoice, INVOICE_TYPE } from '../../utils/createStarInvoice';
import { isiOS } from '../../utils/client';
import { NumberEncoder } from '../../utils/numberEncoder';
import { tg } from '../../App';

import styles from './styles.module.css';

export const BoostPage = ({ tariffs }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeMultiplier, setActiveMultiplier] = useState();
  const ws = useSelector(selectCurrentWorkspace);
  const isPaymentModalOpen = useSelector(selectPaymentSelectModal);
  const user = useSelector((state) => state.user.data);
  const spaceTotal = user?.space_total;
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();
  const dispatch = useDispatch();
  const handleVibrationClick = useButtonVibration();
  const isiOSPlatform = isiOS();

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
            modals: ['before', 'success', 'error'],
            notifications: []
          });
          toast('Payment made successfully.');
        } else {
          setActiveMultiplier(undefined);
          toast.error('Something went wrong', {
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
      toast.error('Something went wrong', {
        theme: 'colored',
        position: 'bottom-center'
      });
    }
  };

  const invoiceCallback = async (result) => {
    try {
      console.log('Invoice callback', result)
    } catch (error) {
      console.log('error')
    }
  }

  const makeInvoice = async (el) => {
    try {
      const encoder = new NumberEncoder();
      const input = `${el?.id};${user.id};${ws}`;
      const byteArray = encoder.encodeNumbers(input, [1, 8, 8]);
      const base64String = encoder.encodeToBase64(byteArray);

      const invoiceInput = createInvoice({
        type: INVOICE_TYPE.boost,
        additionalData: {
          mult: el.multiplicator,
          price: el.stars,
          payload: base64String,
        }
      });
      const invoiceLink = await sendStarInvoice(dispatch, invoiceInput);  
      debugger
      if (invoiceLink) {
        tg.openInvoice(invoiceLink, invoiceCallback);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something was wrong.', {
        theme: 'colored',
        position: 'top-center'
      });
    } 
  }

  const handleStartPayment = (el) => {
    if (el.action === "ton") {
      payByTON(el);
    } else {
      makeInvoice(el);
    }
    onClosePaymentModal();
  }

  const onClosePaymentModal = () => {
    setSelectedPayment(null);
    dispatch(handlePaymentSelectModal(false));
  }

  const handleSelect = (el) => {
    if (isiOSPlatform) {
      makeInvoice(el);
    } else {
      setSelectedPayment(el);
      dispatch(handlePaymentSelectModal(true));
    }
  }

  return (
    <div className={styles.container}>
      <Header label={'Boost Points Rewards'} className={styles.backBtn} />
      <div>
        <p className={styles.header}>Current multiplier</p>
        <div className={styles.current_item}>
          <div className={styles.flex}>
            <StorageIcon storage={currentPrice} />
            <p className={styles.current_storage}>
              <span className={styles.span}>
                {DEFAULT_TARIFFS_NAMES[spaceTotal] || '1GB'}
              </span>
              {' Storage'}
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
        <p className={styles.header}>Boost multiplier</p>
        <ul className={styles.list}>
          {tariffs?.map((el, index) => (
            <li key={index} onClick={handleVibrationClick()}>
              <button
                disabled={currentPrice?.storage === el?.storage}
                onClick={() => {handleSelect(el)}}
                className={CN(
                  styles.item,
                  activeMultiplier?.storage === el.storage && styles.active_item
                )}>
                <div className={styles.flex}>
                  <StorageIcon storage={el} />
                  <div className={styles.item_storage}>
                    <p className={styles.storage}>
                      {transformSize(el?.storage, 0)}
                    </p>
                    <p className={styles.item_text}>Storage per year</p>
                  </div>
                </div>
                <div className={styles.cost}>
                  <p className={styles.cost_value}>{el?.stars}</p>
                  <Star className={styles.cost_svg} viewBox="0 0 21 21" />
                </div>
              </button>
            </li>
          ))}
        </ul>
        {/*<div>*/}
        {/*  <div className={styles.info_header}>*/}
        {/*    <Info />*/}
        {/*    <p className={styles.header}>How it works?</p>*/}
        {/*  </div>*/}
        {/*  <p className={styles.info_text}>*/}
        {/*    We also offer a Points Booster package that includes additional*/}
        {/*    storage space for one year. Enhance your earning potential and enjoy*/}
        {/*    expanded storage capabilities:*/}
        {/*  </p>*/}
        {/*  <ul className={styles.info_list}>*/}
        {/*    {infoData.map((el, index) => (*/}
        {/*      <li key={index} className={styles.info_item}>*/}
        {/*        {el}*/}
        {/*      </li>*/}
        {/*    ))}*/}
        {/*  </ul>*/}
        {/*</div>*/}
      </div>
      {/*<footer className={styles.footer}>*/}
      {/*  <Button*/}
      {/*    disabled={!activeMultiplier}*/}
      {/*    label="Pay"*/}
      {/*    onClick={payByTON}*/}
      {/*    img={<PayIcon className={styles.pay_icon} />}*/}
      {/*    className={CN(styles.pay_btn, !activeMultiplier && styles.disabled)}*/}
      {/*  />*/}
      {/*</footer>*/}
      <SlidingModal
        onClose={onClosePaymentModal}
        isOpen={isPaymentModalOpen}
        snapPoints={[170, 170, 50, 0]}
      >
        <PaymentMenu
          payload={selectedPayment}
          onClick={handleStartPayment}
        />
      </SlidingModal>
    </div>
  );
};
