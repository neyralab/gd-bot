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

import styles from './styles.module.css';

const ConnectModal = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state?.user?.data);
  const [tonConnectUI] = useTonConnectUI();
  const { connectWallet } = useWallet();
  const dispatch = useDispatch();


  useEffect(() => {
    tonConnectUI.modal.onStateChange(async (state) => {
      if (state.status === "opened") {
        onClose()
      }
      if (
        state.status === 'closed' &&
        state.closeReason === 'wallet-selected' &&
        !!user?.wallet?.filter((el) => el !== tonConnectUI.account?.address)
          .length
      ) {
        const res = await saveUserWallet({
          account: tonConnectUI?.account
        });
        const newWallets = res.map((el) => el.public_address);
        dispatch(setUser({ ...user, wallet: newWallets }));
      }
    });
  }, []);

  const tonConnect = useCallback(async () => {
    await tonConnectUI?.openModal();
  }, [tonConnectUI]);

  const OKXConnect = useCallback(async () => {
    connectWallet();
  }, []);

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
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      shouldCloseOnOverlayClick={true}
      className={styles.modal}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>Choose a Wallet Connection Method</h1>
        <button className={styles.closeButton} onClick={onClose} >
          <CloseIcon />
        </button>
        <ul className={styles.list}>
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
          )) }
        </ul>
      </div>
    </Modal>
  )
}

export { ConnectModal };