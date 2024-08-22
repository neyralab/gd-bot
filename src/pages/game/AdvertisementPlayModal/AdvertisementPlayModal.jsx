import React, { useRef, useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useDispatch, useSelector } from 'react-redux';
import { refreshFreeGame } from '../../../store/reducers/gameSlice';
import styles from './AdvertisementPlayModal.module.scss';
import Loader2 from '../../../components/Loader2/Loader2';

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
      fetchVideo();
    } else {
      setIsProcessing(false);
      setVideoLoaded(false);
    }
  }, [advertisementModal]);

  useEffect(() => {
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      const duration = video.duration;
      const time = new Date();
      time.setSeconds(time.getSeconds() + duration);
      restart(time);
      setVideoLoaded(true);
    };

    const updateProgress = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      const progress = (currentTime / duration) * 100;
      setProgress(progress);
    };

    if (video) {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, [advertisementModal]);

  const fetchVideo = async () => {
    const videoUrl = advertisementModal.videoUrl;
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
    }
  };

  const sendWatchFinished = () => {
    setIsProcessing(true);

    setTimeout(() => {
      dispatch(refreshFreeGame());
    }, 2000);
  };

  if (!advertisementModal) return;

  return (
    <div className={styles.container}>
      <div className={styles['video-wrapper']}>
        <video ref={videoRef} className={styles.video} autoPlay />
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
