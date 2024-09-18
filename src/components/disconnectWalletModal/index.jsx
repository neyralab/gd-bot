import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { vibrate } from '../../utils/vibration';

import style from './style.module.scss';

export const DisconnectWalletModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('system');

  const [tonConnectUI] = useTonConnectUI();

  const onAccept = async () => {
    vibrate();
    await tonConnectUI.disconnect();
  };

  const handleOnClose = () => {
    vibrate();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleOnClose}
      shouldCloseOnOverlayClick={true}
      overlayClassName={style.overlay}
      className={style.modal}>
      <p className={style.text}>{t('wallet.disconnect')}</p>
      <div className={style.buttons}>
        <button className={style.noBtn} onClick={handleOnClose}>
          {t('wallet.no')}
        </button>
        <button
          className={style.yesBtn}
          onClick={onAccept}>
          {t('wallet.yes')}
        </button>
      </div>
    </Modal>
  );
};
