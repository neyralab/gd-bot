import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import {
  refreshFreeGame,
  setAdvertisementModal,
  setSystemModal
} from '../../../store/reducers/gameSlice';
import Loader2 from '../../../components/Loader2/Loader2';
import {
  endWatchingAdvertisementVideo,
  startWatchingAdvertisementVideo
} from '../../../effects/advertisementEffect';
import styles from './AdvertisementPlayModal.module.scss';

export default function AdvertisementPlayModal() {
  const dispatch = useDispatch();
  const advertisementModal = useSelector(
    (state) => state.game.advertisementModal
  );
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (advertisementModal) {
      startWatching();
    } else {
      setIsProcessing(false);
    }
  }, [advertisementModal]);

  const onReady = () => {
    setIsReady(true);
  };

  const onDuration = (duration) => {
    setDuration(duration);
    setTimeLeft(duration);
  };

  const onProgress = (state) => {
    const { playedSeconds } = state;
    const progress = (playedSeconds / duration) * 100;
    setProgress(progress);
    setTimeLeft(duration - playedSeconds);
  };

  const startWatching = async () => {
    try {
      await startWatchingAdvertisementVideo(advertisementModal.videoId);
    } catch (err) {
      dispatch(
        setSystemModal({
          type: 'START_ADVERTASEMENT_WATCH_ERROR',
          message: err?.response?.data?.errors || 'Unexpected Error'
        })
      );
      dispatch(setAdvertisementModal(null));
    }
  };

  const sendWatchFinished = () => {
    setIsProcessing(true);

    endWatchingAdvertisementVideo(advertisementModal.videoId)
      .then(() => {
        dispatch(refreshFreeGame());
        setIsProcessing(false);
        dispatch(setAdvertisementModal(null));
      })
      .catch((err) => {
        dispatch(
          setSystemModal({
            type: 'END_ADVERTASEMENT_WATCH_ERROR',
            message: err?.response?.data?.errors || 'Unexpected Error'
          })
        );
        dispatch(setAdvertisementModal(null));
      });
  };

  if (!advertisementModal) return null;

  return (
    <div className={styles.container}>
      <div className={styles['video-wrapper']}>
        <ReactPlayer
          url={advertisementModal.videoUrl}
          playing={isReady}
          controls={false}
          playsinline={true}
          onReady={onReady}
          onDuration={onDuration}
          onProgress={onProgress}
          onEnded={sendWatchFinished}
          width="100%"
          height="100%"
          style={{ objectFit: 'contain' }}
        />

        {duration ? (
          <div className={styles.timer}>
            {`${Math.floor(timeLeft / 60)}:${Math.floor(timeLeft % 60)
              .toString()
              .padStart(2, '0')}`}
          </div>
        ) : (
          <></>
        )}

        <div className={styles['progress-bar']}>
          <div
            className={styles.progress}
            style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {(isProcessing || !isReady) && (
        <div className={styles['loader-container']}>
          <Loader2 />
        </div>
      )}

      <div className={styles['no-interaction-overlay']}></div>
    </div>
  );
}
