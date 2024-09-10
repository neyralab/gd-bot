import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setMediaSliderCurrentFile,
  setMediaSliderOpen
} from '../../../../store/reducers/driveSlice';
import { vibrate } from '../../../../utils/vibration';
import SlidesController from './SlidesController/SlidesController';
import styles from './MediaSlider.module.scss';

Modal.setAppElement('#root');

export default function MediaSlider() {
  const { t } = useTranslation('system');
  const isOpen = useSelector((state) => state.drive.mediaSlider.isOpen);
  const dispatch = useDispatch();

  const onClose = () => {
    vibrate();
    dispatch(setMediaSliderOpen(false));
    dispatch(setMediaSliderCurrentFile(null));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      className={styles.modal}>
      <div className={styles.wrapper}>
        {isOpen && <SlidesController />}

        <div className={styles.header}>
          <button className={styles.back} onClick={onClose}>
            {t('dashboard.back')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
