import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useDispatch, useSelector } from 'react-redux';
import useButtonVibration from '../../../hooks/useButtonVibration';
import { ReactComponent as CloseIcon } from '../../../assets/close.svg';
import {
  confirmNewLevel,
  selectReachNewLevel,
  selectStatus
} from '../../../store/reducers/gameSlice';
import styles from './GoldPlayModal.module.css';

export default function GoldPlayModal() {
  const dispatch = useDispatch();
  const reachedNewLevel = useSelector(selectReachNewLevel);
  const status = useSelector(selectStatus);
  const modalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleVibrationClick = useButtonVibration();

  useEffect(() => {
    setIsOpen(reachedNewLevel && status !== 'playing');
  }, [reachedNewLevel, status]);

  const confirmGoldGame = () => {
    dispatch(confirmNewLevel());
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
                <div
                  className={styles.close}
                  onClick={handleVibrationClick(close)}>
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
