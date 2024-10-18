import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { vibrate } from '../../../utils/vibration';
import { ReactComponent as CloseIcon } from '../../../assets/close.svg';
import {
  confirmGoldPlay,
  declineGoldPlay
} from '../../../store/reducers/game/game.thunks';
import {
  selectReachNewLevel,
  selectStatus
} from '../../../store/reducers/game/game.selectors';
import styles from './GoldPlayModal.module.css';

export default function GoldPlayModal() {
  const dispatch = useDispatch();
  const reachedNewLevel = useSelector(selectReachNewLevel);
  const status = useSelector(selectStatus);
  const modalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (reachedNewLevel && status !== 'playing') {
      setIsOpen(true);
    }
  }, [reachedNewLevel, status]);

  const confirmGoldGame = () => {
    vibrate();
    setIsOpen(false);
    dispatch(confirmGoldPlay());
  };

  const close = () => {
    vibrate();
    setIsOpen(false);
    dispatch(declineGoldPlay());
  };

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
                <div className={styles.close} onClick={close}>
                  <CloseIcon />
                </div>
              </div>

              <div className={styles.content}>
                <img
                  src="assets/game-page/ship-phoenix.png"
                  alt={'You have earned the Gold game'}
                />
                <h3>Congratulations!</h3>
              </div>

              <div className={styles.actions}>
                <button onClick={confirmGoldGame}>Play x10</button>
              </div>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
