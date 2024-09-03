import React, { useRef, useState, useEffect } from 'react';
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
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoType = advertisementModal
    ? advertisementModal.videoUrl.endsWith('.mp4')
      ? 'video/mp4'
      : 'video/quicktime'
    : null;

  useEffect(() => {
    if (advertisementModal) {
      startWatching();
    } else {
      setIsProcessing(false);
    }
  }, [advertisementModal]);

  const onVideoPlay = () => {
    const duration = videoRef.current?.duration || 0;
    videoRef.current.play();
    setTimeLeft(duration);
  };

  const updateProgress = () => {
    const currentTime = videoRef.current?.currentTime || 0;
    const duration = videoRef.current?.duration || 0;
    const progress = (currentTime / duration) * 100;
    setProgress(progress);
    setTimeLeft(duration - currentTime);
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
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          onLoadedMetadata={onVideoPlay}
          onTimeUpdate={updateProgress}
          onEnded={sendWatchFinished}
          controls={false}
          playsInline={true}>
          <source src={advertisementModal.videoUrl} type={videoType} />
        </video>

        {timeLeft ? (
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

      {isProcessing && (
        <div className={styles['loader-container']}>
          <Loader2 />
        </div>
      )}

      <div className={styles['no-interaction-overlay']}></div>
    </div>
  );
}
