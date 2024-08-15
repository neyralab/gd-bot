import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from 'react';
import { Sheet } from 'react-modal-sheet';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import useButtonVibration from '../../hooks/useButtonVibration';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import FortuneTimer from './FortuneTimer/FortuneTimer';
import styles from './FortuneWheelModal.module.scss';

const FortuneWheelModal = forwardRef((_, ref) => {
  const modalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availableTimestamp, setAvailableTimestamp] = useState(null);
  const handleVibrationClick = useButtonVibration();

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const onFortuneWheelSpinned = () => {
    const currentTimestamp = Date.now();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const nextAvailableSpinTimestamp = currentTimestamp + oneDayInMilliseconds;
    setAvailableTimestamp(nextAvailableSpinTimestamp);
    setIsAvailable(false);
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
                <h2>{isAvailable && 'Earn GhostDrive Points'}</h2>

                <div
                  className={styles.close}
                  onClick={handleVibrationClick(close)}>
                  <CloseIcon />
                </div>
              </div>
              
              {isAvailable && (
                <strong className={styles.description}>Free Spin</strong>
              )}

              <div className={styles.content}>
                {isAvailable && (
                  <FortuneWheel onSpinned={onFortuneWheelSpinned} />
                )}

                {!isAvailable && (
                  <FortuneTimer
                    timestamp={availableTimestamp}
                    onComplete={() => setIsAvailable(true)}
                  />
                )}
              </div>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
});

export default FortuneWheelModal;
