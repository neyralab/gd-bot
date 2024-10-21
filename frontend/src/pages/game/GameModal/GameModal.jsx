import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setGameModal } from '../../../store/reducers/game/game.slice';
import styles from './GameModal.module.css';

export default function GameModal() {
  const dispatch = useDispatch();
  const { t } = useTranslation('game');
  const gameModalType = useSelector((state) => state.game.gameModal);
  const [gameModalInfo, setGameModalInfo] = useState();

  useEffect(() => {
    if (!gameModalType) {
      setGameModalInfo(null);
      return;
    }

    let title = null;
    let description = null;
    let img = null;

    switch (gameModalType) {
      case 'TIME_FOR_TRANSACTION':
        title = t('message.someTimeForTransaction');
        description = t('message.checkYourPointsLater');
        img = '/assets/hands-heart.png';
        break;
    }

    setGameModalInfo({ title, description, img });
  }, [gameModalType]);

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
