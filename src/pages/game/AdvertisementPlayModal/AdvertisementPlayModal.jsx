import React, { useRef, useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => {
      if (videoLoaded) {
        sendWatchFinished();
      }
    }
  });

  useEffect(() => {
    if (advertisementModal) {
      startWatching();
    } else {
      setIsProcessing(false);
      setVideoLoaded(false);
    }
  }, [advertisementModal]);

  const handleLoadedMetadata = () => {
    const duration = videoRef.current.duration;
    const time = new Date();
    time.setSeconds(time.getSeconds() + duration);
    restart(time);
    setVideoLoaded(true);
  };

  const updateProgress = () => {
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    const progress = (currentTime / duration) * 100;
    setProgress(progress);
  };

  const startWatching = async () => {
    const videoUrl = advertisementModal.videoUrl;

    if (!videoRef.current) return;
    videoRef.current.src = videoUrl;

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

  if (!advertisementModal) return;

  return (
    <div className={styles.container}>
      <div className={styles['video-wrapper']}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={updateProgress}
        />
        {videoLoaded && (
          <>
            <div
              className={
                styles.timer
              }>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</div>
            <div className={styles['progress-bar']}>
              <div
                className={styles.progress}
                style={{ width: `${progress}%` }}></div>
            </div>
          </>
        )}
      </div>

      {!videoLoaded ||
        (isProcessing && (
          <div className={styles['loader-container']}>
            <Loader2 />
          </div>
        ))}
    </div>
  );
}
