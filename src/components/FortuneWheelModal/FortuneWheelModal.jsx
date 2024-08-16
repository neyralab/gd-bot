import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect
} from 'react';
import { Sheet } from 'react-modal-sheet';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import useButtonVibration from '../../hooks/useButtonVibration';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import FortuneTimer from './FortuneTimer/FortuneTimer';
import styles from './FortuneWheelModal.module.scss';
import {
  getLastPlayedFreeSpin,
  getPendingSpins
} from '../../effects/fortuneWheelEffect';
import Loader2 from '../Loader2/Loader2';

const FortuneWheelModal = forwardRef((_, ref) => {
  const modalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true); // 'free', pendingGame, false
  const [freeSpinTimestamp, setFreeSpinTimestamp] = useState(null);
  const [lastPlayedFreeSpin, setLastPlayedFreeSpin] = useState(null);
  const [pendingSpins, setPendingSpins] = useState([]);
  const handleVibrationClick = useButtonVibration();

  useEffect(() => {
    if (isOpen) {
      getInitialData();
    }
  }, [isOpen]);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const getInitialData = async () => {
    try {
      setIsInitialized(false);
      const [lastPlayedFreeSpinRes, pendingSpinsRes] = await Promise.all([
        getLastPlayedFreeSpin(),
        getPendingSpins()
      ]);
      console.log({ lastPlayedFreeSpinRes });
      console.log({ pendingSpinsRes });
      setLastPlayedFreeSpin(lastPlayedFreeSpinRes);
      setPendingSpins(pendingSpinsRes);
      setIsInitialized(true);

      checkAvailable();
    } catch (error) {
      console.log('Error', error);
    }
  };

  const checkAvailable = () => {
    let spinIsAvailable = false;

    if (lastPlayedFreeSpin && lastPlayedFreeSpin.expired_at) {
      const expiredAt = new Date(lastPlayedFreeSpin.expired_at).getTime();
      const currentTimestamp = Date.now();

      if (expiredAt > currentTimestamp) {
        setFreeSpinTimestamp(expiredAt);
      } else {
        spinIsAvailable = 'free';
      }
    }

    if (pendingSpins) {
      setPendingSpins(pendingSpins || []);
      if (pendingSpins.length) {
        spinIsAvailable = pendingSpins[0];
      }
    }

    setIsAvailable(spinIsAvailable);
  };

  const onFortuneWheelSpinned = () => {
    getInitialData();
  };

  const onTimerCompleted = () => {
    getInitialData();
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
                <h2>
                  {isInitialized && isAvailable && 'Earn GhostDrive Points'}
                </h2>

                <div
                  className={styles.close}
                  onClick={handleVibrationClick(close)}>
                  <CloseIcon />
                </div>
              </div>

              {isInitialized && isAvailable && (
                <strong className={styles.description}>Free Spin</strong>
              )}

              <div className={styles.content}>
                {!isInitialized && (
                  <div className={styles['loader-container']}>
                    <Loader2 />
                  </div>
                )}

                {isInitialized && isAvailable !== false && (
                  <FortuneWheel onSpinned={onFortuneWheelSpinned} />
                )}

                {isInitialized && isAvailable === false && (
                  <FortuneTimer
                    timestamp={freeSpinTimestamp}
                    onComplete={onTimerCompleted}
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
