import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ConnectModal } from './selectModal';
import { useTonAddress } from '@tonconnect/ui-react';
import { DisconnectWalletModal } from '../disconnectWalletModal';
import { useWallet } from '../../store/context/WalletProvider';

import styles from './styles.module.css';

const WalletConnect = () => {
  const { t } = useTranslation('system');
  const { wallet, useOKXAddress, reconnectWallet } = useWallet();
  const address = useTonAddress();
  const okxAddress = useOKXAddress();
  const [isConnectModal, setIsConnectModal] = useState(false);
  const [isDisconectModal, setIsDisconectModal] = useState(false);

  const myAddress = useMemo(() =>(address || okxAddress || ''), [address, okxAddress]);

  useEffect(() => {
    if (wallet) {
      reconnectWallet?.();
    }
  }, [wallet, reconnectWallet]);

  const onCloseConnectModal = () => {
    setIsConnectModal(false);
  };

  const onCloseDisconnectModal = () => {
    setIsDisconectModal(false);
  };

  const openConnectModal = () => {
    if (myAddress) {
      setIsDisconectModal(true);
    } else {
      setIsConnectModal(true);
    }
  };

  return (
    <>
      <button className={styles['connect-btn']} onClick={openConnectModal}>
        {myAddress ? `...${myAddress.slice(-4)}` : t('dashboard.add')}
      </button>
      <ConnectModal isOpen={isConnectModal} onClose={onCloseConnectModal} />
      <DisconnectWalletModal
        isOpen={isDisconectModal}
        onClose={onCloseDisconnectModal}
      />
    </>
  );
};

export { WalletConnect };
