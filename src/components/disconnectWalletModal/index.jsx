import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

import { useWallet } from '../../store/context/WalletProvider';
import useButtonVibration from '../../hooks/useButtonVibration';

import style from './style.module.scss';

export const DisconnectWalletModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('system');
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const handleVibrationClick = useButtonVibration();
  const { disconnectWallet } = useWallet();


  const disconnectOKX = async () => {
    disconnectWallet();
    onClose();
  };

  const disconnectTon = async () => {
    await tonConnectUI.disconnect();
    onClose();
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
        <button className={style.noBtn} onClick={handleVibrationClick(onClose)}>
          {t('wallet.no')}
        </button>
        <button
          className={style.yesBtn}
          onClick={handleVibrationClick(handleDisconnect)}>
          {t('wallet.yes')}
        </button>
      </div>
    </Modal>
  );
};
