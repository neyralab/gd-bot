import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect
} from 'react';
import { Sheet } from 'react-modal-sheet';
import { useTranslation } from 'react-i18next';
import {
  getLastPlayedFreeSpin,
  getPendingSpins
} from '../../effects/fortuneWheelEffect';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import { vibrate } from '../../utils/vibration';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import FortuneTimer from './FortuneTimer/FortuneTimer';
import Loader2 from '../Loader2/Loader2';
import SystemModal from '../SystemModal/SystemModal';
import styles from './FortuneWheelModal.module.scss';

const FortuneWheelModal = forwardRef((_, ref) => {
  const modalRef = useRef(null);
  const systemModalRef = useRef(null);
  const ts = useTranslation('system');
  const tg = useTranslation('game');
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [available, setAvailable] = useState(true); // 'free', pendingGame, false
  const [freeSpinTimestamp, setFreeSpinTimestamp] = useState(null);
  const [lastPlayedFreeSpin, setLastPlayedFreeSpin] = useState(null);
  const [pendingSpins, setPendingSpins] = useState([]);

  useEffect(() => {
    if (isOpen) {
      getInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    checkAvailable();
  }, [freeSpinTimestamp, lastPlayedFreeSpin]);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    vibrate()
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
    } catch (error) {
      systemModalRef.current.open({
        title: ts.t('message.error'),
        text: error.response?.data?.errors || ts.t('message.serverError'),
        actions: [
          {
            type: 'default',
            text: ts.t('message.ok'),
            onClick: () => {
              systemModalRef.current.close();
            }
          }
        ]
      });
    }
  };

  const checkAvailable = () => {
    let spinAvailable = false;

    if (lastPlayedFreeSpin && lastPlayedFreeSpin.expired_at) {
      const expiredAt = new Date(lastPlayedFreeSpin.expired_at).getTime();
      const currentTimestamp = Date.now();

      if (expiredAt > currentTimestamp) {
        setFreeSpinTimestamp(expiredAt);
      } else {
        spinAvailable = 'free';
      }
    } else {
      spinAvailable = 'free';
    }

    if (pendingSpins) {
      setPendingSpins(pendingSpins || []);
      if (pendingSpins.length) {
        spinAvailable = pendingSpins[0];
      }
    }

    setAvailable(spinAvailable);
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
    <>
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
                    {isInitialized && available && tg.t('earn.earnGPoints')}
                  </h2>

                  <div
                    className={styles.close}
                    onClick={close}>
                    <CloseIcon />
                  </div>
                </div>

                {isInitialized && available && (
                  <strong className={styles.description}>
                    {tg.t('earn.freeSpin')}
                  </strong>
                )}

                <div className={styles.content}>
                  {!isInitialized && (
                    <div className={styles['loader-container']}>
                      <Loader2 />
                    </div>
                  )}

                  {isInitialized &&
                    !freeSpinTimestamp &&
                    available !== false && (
                      <FortuneWheel
                        spinId={available.id || null}
                        onSpinned={onFortuneWheelSpinned}
                      />
                    )}

                  {isInitialized &&
                    freeSpinTimestamp &&
                    available === false && (
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

      <SystemModal ref={systemModalRef} />
    </>
  );
});

export default FortuneWheelModal;
