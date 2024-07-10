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
import { DEFAULT_TARIFFS_NAMES } from '../upgradeStorage';
import { getTonWallet } from '../../effects/paymentEffect';
import { transformSize } from '../../utils/transformSize';

import { ReactComponent as Diamond } from '../../assets/diamond.svg';
import styles from './styles.module.css';
import useButtonVibration from '../../hooks/useButtonVibration';

export const BoostPage = ({ tariffs }) => {
  const [activeMultiplier, setActiveMultiplier] = useState();
  const ws = useSelector(selectCurrentWorkspace);
  const user = useSelector((state) => state.user.data);
  const spaceTotal = user?.space_total;
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();
  const dispatch = useDispatch();
  const handleVibrationClick = useButtonVibration();

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
              {currentPrice?.ton_price || '0'}
            </p>
            <Diamond className={styles.current_diamond} />
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
                onClick={async () => {
                  await payByTON(el);
                }}
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
                  <p className={styles.cost_value}>{el?.ton_price}</p>
                  <Diamond />
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
    </div>
  );
};
