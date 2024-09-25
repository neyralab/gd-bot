import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import { ConnectModal } from './selectModal';
import { useTonAddress } from '@tonconnect/ui-react';
import { DisconnectWalletModal } from '../disconnectWalletModal';
import { useWallet } from '../../store/context/WalletProvider';

import styles from './styles.module.css';

const WalletConnect = () => {
  const { t } = useTranslation('system');
  const { wallet, useOKXAddress, recconectWallet } = useWallet();
  const address = useTonAddress();
  const okxAddress = useOKXAddress();
  const [isConnectModal, setIsConnectModal] = useState(false);
  const [isDisconectModal, setIsDisconectModal] = useState(false);

  const myAddress = address || okxAddress || '';

  useEffect(() => {
    if (wallet) {
      recconectWallet();
    }
  }, [wallet])

  const onCloseConnectModal = () => {
    setIsConnectModal(false);
  }

  const onCloseDisconnectModal = () => {
    setIsDisconectModal(false);
  }

  const openConnectModal = () => {
    if (myAddress) {
      setIsDisconectModal(true);
    } else {
      setIsConnectModal(true);
    }
  }

  return (
    <>
      <button className={styles['connect-btn']} onClick={openConnectModal}>
        {myAddress ? `...${myAddress.slice(-4)}` : t('dashboard.add')}
      </button>
      {isConnectModal && <ConnectModal
        isOpen={isConnectModal}
        onClose={onCloseConnectModal}
      />}
      <DisconnectWalletModal isOpen={isDisconectModal} onClose={onCloseDisconnectModal} />
    </>
  )
}

export { WalletConnect };