import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { useTonConnectUI } from '@tonconnect/ui-react';

import useButtonVibration from '../../hooks/useButtonVibration';

import style from './style.module.scss';

export const DisconnectWalletModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('system');

  const [tonConnectUI] = useTonConnectUI();
  const handleVibrationClick = useButtonVibration();

  const onAccept = async () => {
    await tonConnectUI.disconnect();
    onClose();
  };

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
          onClick={handleVibrationClick(onAccept)}>
          {t('wallet.yes')}
        </button>
      </div>
    </Modal>
  );
};
