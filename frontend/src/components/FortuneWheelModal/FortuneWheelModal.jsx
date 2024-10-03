import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect
} from 'react';
import { Sheet } from 'react-modal-sheet';
import { useTranslation } from 'react-i18next';
import { getLastPlayedFreeSpin, getBonusSpins } from '../../effects/fortuneWheelEffect';
import { ReactComponent as CloseIcon } from '../../assets/close.svg';
import { vibrate } from '../../utils/vibration';
import { isDevEnv } from '../../utils/isDevEnv';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import FortuneTimer from './FortuneTimer/FortuneTimer';
import Loader2 from '../Loader2/Loader2';
import SystemModal from '../SystemModal/SystemModal';
import styles from './FortuneWheelModal.module.scss';

const INITIAL_BONUS_STATE = { usage: [], data: [] };

const FortuneWheelModal = forwardRef((_, ref) => {
  const isDev = isDevEnv();
  const modalRef = useRef(null);
  const systemModalRef = useRef(null);
  const ts = useTranslation('system');
  const tg = useTranslation('game');
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [startBonusSpins, setStartBonusSpins] = useState(false);
  const [available, setAvailable] = useState(true); // 'free', pendingGame, false
  const [freeSpinTimestamp, setFreeSpinTimestamp] = useState(null);
  const [lastPlayedFreeSpin, setLastPlayedFreeSpin] = useState(null);
  const [bonusSpins, setBonusSpins] = useState(INITIAL_BONUS_STATE);

  useEffect(() => {
    if (isOpen) {
      getInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    checkAvailable();
  }, [freeSpinTimestamp, lastPlayedFreeSpin, startBonusSpins]);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    vibrate()
    setIsOpen(false);
    setStartBonusSpins(false);
  };

  const getInitialData = async () => {
    try {
      setIsInitialized(false);
      const [lastPlayedFreeSpinRes, bonusSpinsRes] = await Promise.all([
        getLastPlayedFreeSpin(),
        getBonusSpins()
      ]);
      console.log({ lastPlayedFreeSpinRes });
      console.log({ bonusSpinsRes });
      setLastPlayedFreeSpin(lastPlayedFreeSpinRes);
      setBonusSpins(bonusSpinsRes);
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

    if (startBonusSpins && bonusSpins.data.length && isDev) {
      spinAvailable = bonusSpins.data[0];
    }

    setAvailable(spinAvailable);
  };

  const onFortuneWheelSpinned = () => {
    getInitialData();
  };

  const onTimerCompleted = async () => {
    await getInitialData();
    setFreeSpinTimestamp(null);
  };

  useImperativeHandle(ref, () => ({
    open: open
  }));

  const startBunusGame = () => {
    if (bonusSpins.data.length) {
      setStartBonusSpins(true);
    }
  }

  return (
    <>
      <Sheet
        ref={modalRef}
        isOpen={isOpen}
        onClose={close}
        detent="content-height">
        <Sheet.Container className={styles['sheet-container']}>
          <Sheet.Header className="react-modal-sheet-header" />
          <Sheet.Content>
            <Sheet.Scroller>
              <div className={styles.container}>
                <div className={styles.header}>
                  {!!bonusSpins.data.length &&
                    !startBonusSpins && available !== 'free' ? (
                    <button
                      className={styles['spin-btn']}
                      onClick={startBunusGame}
                    >{`${bonusSpins.data.length} ${tg.t('earn.spinWheel')?.toLowerCase?.()}`}
                  </button>
                  ) : (
                    <h2>
                      {isInitialized && available && tg.t('earn.earnGPoints')}
                    </h2>
                  )}
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
                    (!freeSpinTimestamp || startBonusSpins) &&
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
                        bonusSpins={bonusSpins.data}
                        invites={bonusSpins.usage}
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
