import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { useTonConnectUI } from '@tonconnect/ui-react';

import useButtonVibration from '../../hooks/useButtonVibration';

import style from './style.module.scss';

export const DisconnectWalletModal = ({ isOpen, onClose }) => {

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
      <p className={style.text}>Are you sure you want to disconnect?</p>
      <div className={style.buttons}>
        <button className={style.noBtn} onClick={handleVibrationClick(onClose)}>
          No
        </button>
        <button
          className={style.yesBtn}
          onClick={handleVibrationClick(onAccept)}>
          Yes
        </button>
      </div>
    </Modal>
  );
};
