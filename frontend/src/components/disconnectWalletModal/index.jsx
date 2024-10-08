import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

import { useWallet } from '../../store/context/WalletProvider';

import style from './style.module.scss';

export const DisconnectWalletModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('system');
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { disconnectWallet } = useWallet();


  const disconnectOKX = () => {
    disconnectWallet();
    onClose();
  };

  const disconnectTon = () => {
    tonConnectUI.disconnect();
    onClose()
  };

  const handleDisconnect = () => {
    if (address) {
      disconnectTon()
    } else {
      disconnectOKX()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      overlayClassName={style.overlay}
      className={style.modal}>
      <p className={style.text}>{t('wallet.disconnect')}</p>
      <div className={style.buttons}>
        <button className={style.noBtn} onClick={onClose}>
          {t('wallet.no')}
        </button>
        <button
          className={style.yesBtn}
          onClick={handleDisconnect}>
          {t('wallet.yes')}
        </button>
      </div>
    </Modal>
  );
};
