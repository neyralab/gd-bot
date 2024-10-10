import { useCallback, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setMediaSliderCurrentFile,
  setMediaSliderOpen
} from '../../../../store/reducers/driveSlice';
import SlidesController from './SlidesController/SlidesController';
import { vibrate } from '../../../../utils/vibration';
import { isMobilePlatform } from '../../../../utils/client';
import { tg } from '../../../../App';
import styles from './MediaSlider.module.scss';

Modal.setAppElement('#root');

export default function MediaSlider() {
  const { t } = useTranslation('system');
  const isOpen = useSelector((state) => state.drive.mediaSlider.isOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && isMobilePlatform) {
      tg.BackButton.offClick(() => {
        dispatch(setMediaSliderOpen(false));
        dispatch(setMediaSliderCurrentFile(null));
        tg.BackButton.offClick(() => { navigate(-1) });
      });
    }
  }, [isOpen])

  const onClose = useCallback(() => {
    vibrate();
    dispatch(setMediaSliderOpen(false));
    dispatch(setMediaSliderCurrentFile(null));
  }, []);

  const onExpand = useCallback((status) => {
    setIsExpanded(status);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      className={styles.modal}>
      <div className={styles.wrapper}>
        {isOpen && <SlidesController onExpand={onExpand} />}

        {!isExpanded && (
          <div className={styles.header}>
            {!isMobilePlatform && (
              <button className={styles.back} onClick={onClose}>
                {t('dashboard.back')}
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
