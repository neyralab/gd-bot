import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameModal } from '../../../store/reducers/gameSlice';
import styles from './GameModal.module.css';

export default function GameModal() {
  const dispatch = useDispatch();
  const gameModalInfo = useSelector((state) => state.game.gameModal);

  const clickHandler = () => {
    gameModalInfo.onClose?.();
    dispatch(setGameModal(null));
  };

  if (!gameModalInfo) return null;

  return (
    <div className={styles.backdrop} onClick={clickHandler}>
      <div
        className={styles.container}
        style={{
          backgroundImage: `url('/assets/game-page/game-modal.png')`
        }}>
        {gameModalInfo.img && (
          <div
            className={styles.icon}
            style={{
              backgroundImage: `url('${gameModalInfo.img}')`
            }}></div>
        )}

        {gameModalInfo.title && (
          <div className={styles.title}>{gameModalInfo.title}</div>
        )}

        {gameModalInfo.description && (
          <div className={styles.description}>{gameModalInfo.description}</div>
        )}
      </div>
    </div>
  );
}
