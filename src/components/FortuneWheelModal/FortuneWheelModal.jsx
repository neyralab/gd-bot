import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from 'react';
import { Sheet } from 'react-modal-sheet';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import useButtonVibration from '../../hooks/useButtonVibration';
import styles from './FortuneWheelModal.module.scss';
import FortuneWheel from './FortuneWheel/FortuneWheel';

const FortuneWheelModal = forwardRef((_, ref) => {
  const modalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleVibrationClick = useButtonVibration();

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  useImperativeHandle(ref, () => ({
    open: open
  }));

  return (
    <Sheet
      ref={modalRef}
      isOpen={isOpen}
      onClose={close}
      detent="content-height">
      <Sheet.Container className="react-modal-sheet-container">
        <Sheet.Header className="react-modal-sheet-header" />
        <Sheet.Content>
          <Sheet.Scroller>
            <div className={styles.container}>
              <div className={styles.header}>
                <h2>Earn GhostDrive Points</h2>

                <div
                  className={styles.close}
                  onClick={handleVibrationClick(close)}>
                  <CloseIcon />
                </div>
              </div>
              <strong className={styles.description}>Free Spin</strong>

              <div className={styles.content}>
                <FortuneWheel />
              </div>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
});

export default FortuneWheelModal;
