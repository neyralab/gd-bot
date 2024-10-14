import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useTonConnectUI } from '@tonconnect/ui-react';
import Modal from 'react-modal';

import { useWallet } from '../../store/context/WalletProvider';
import { setUser } from '../../store/reducers/userSlice';
import { saveUserWallet } from '../../effects/userEffects';
import { ReactComponent as TonIcon } from '../../assets/logo/ton.svg';
import { ReactComponent as OKXIcon } from '../../assets/logo/okx.svg';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import { OkxConnect } from './okxConnect';
import { isOkxWallet } from '../../utils/string';

import styles from './styles.module.css';

const ConnectModal = ({ isOpen, onClose, successCallback }) => {
  const [startOKXConnect, setStartOKXConnect] = useState(false);
  const [okxConnectLink, setOKXConnectLink] = useState('');
  const user = useSelector((state) => state?.user?.data);
  const [tonConnectUI] = useTonConnectUI();
  const { wallet, connectWallet } = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = tonConnectUI.modal.onStateChange(async (state) => {
      if (state.status === "opened") {
        onClose()
      }
      if (
        state.status === 'closed' &&
        state.closeReason === 'wallet-selected' &&
        !!user?.wallet?.filter((el) => el !== tonConnectUI.account?.address).length
        ) {
        const walletName = isOkxWallet(tonConnectUI.walletInfo.name) ? 'okx' : 'ton';
        const res = await saveUserWallet({
          account: tonConnectUI?.account,
          channel: 'ton',
          [walletName]: true
        });
        const newWallets = res.map((el) => el.public_address);
        dispatch(setUser({ ...user, wallet: newWallets }));
        successCallback?.();
        unsubscribe();
      }
    });
  }, []);

  useEffect(() => {
    if (wallet) {
      const unsubscribe = wallet.onStatusChange(async (res) => {
        if (res) {
          if (!!user?.wallet?.filter((el) => el !== res.account?.address).length) {
            const data = await saveUserWallet({
              account: res?.account,
              channel: 'ton',
              okx: true
            });
            const newWallets = data.map((el) => el.public_address);
            dispatch(setUser({ ...user, wallet: newWallets }));
          }
          onClose();
<<<<<<< HEAD
          unsubscribe();
          successCallback?.();
=======
>>>>>>> origin/master
        }
      })

      return () => {
        unsubscribe();
      }
    }
  }, [wallet]);

  const tonConnect = useCallback(async () => {
    await tonConnectUI?.openModal();
  }, [tonConnectUI]);

  const OKXConnect = useCallback(async () => {
    try {
      const link = await connectWallet();
      link && setOKXConnectLink(link);
      setStartOKXConnect(true);      
    } catch (error) {
      console.warn(error);
    }
  }, []);

  const handleOnClose = () => {
    setStartOKXConnect(false);
    onClose();
  }

  const retry = async () => {
    try {
      const link = await connectWallet();
      link && setOKXConnectLink(link);
    } catch (error) {
      console.warn(error);
    }
  }

  const connectList = [
    {
      icon: <TonIcon />,
      title: 'Ton Connect',
      onClick: tonConnect 
    },
    {
      icon: <OKXIcon />,
      title: 'OKX Wallet',
      onClick: OKXConnect
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleOnClose}
      overlayClassName={styles.overlay}
      shouldCloseOnOverlayClick={true}
      className={styles.modal}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>
          { startOKXConnect ? 'OKX Wallet' : 'Choose a Wallet Connection Method' }
          </h1>
        <button className={styles.closeButton} onClick={onClose} >
          <CloseIcon />
        </button>
        {!startOKXConnect && <ul className={styles.list}>
          { connectList.map(({ icon, title, onClick }, index) => (
            <li
              key={`connect-method-${index}`}
              className={styles.item}
              onClick={onClick}
            >
              <div className={styles['item-img']}>
                { icon }
              </div>
              <p className={styles['item-title']}>{title}</p>
            </li>
          ))}
        </ul>}
        {startOKXConnect && <OkxConnect retry={retry} okxConnectLink={okxConnectLink} /> }
      </div>
    </Modal>
  )
}

export { ConnectModal };