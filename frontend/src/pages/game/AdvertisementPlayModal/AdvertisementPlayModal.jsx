import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import {
  refreshFreeGame,
  setAdvertisementModal,
  setSystemModal
} from '../../../store/reducers/gameSlice';
import Loader2 from '../../../components/Loader2/Loader2';
import { ReactComponent as PlayIcon } from '../../../assets/play_media.svg';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [startWatchingIsLoading, setStartWatchingIsLoading] = useState(false);

  useEffect(() => {
    if (advertisementModal && advertisementModal.videoUrl) {
      startWatching();
    } else {
      resetState();
    }
  }, [advertisementModal]);

  const resetState = () => {
    setProgress(0);
    setTimeLeft(0);
    setIsProcessing(false);
    setIsReady(false);
    setDuration(0);
    setIsPlaying(false);
    setStartWatchingIsLoading(false);
  };

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
    setStartWatchingIsLoading(true);

    try {
      await startWatchingAdvertisementVideo(advertisementModal.videoId);
      setStartWatchingIsLoading(false);
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

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleError = (error) => {
    console.error('Error playing video:', error);
    setIsPlaying(false);
    setIsReady(false);
  };

  if (!advertisementModal) return null;

  /** these url params are only valid for youtube videos.
   * If we decide to play videos hosted by other services - remove these params */
  const videoUrl = `${advertisementModal.videoUrl}?controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1`;

  return (
    <div className={styles.container}>
      <div className={styles['video-wrapper']}>
        <ReactPlayer
          url={videoUrl}
          playing={isPlaying}
          controls={false}
          playsinline={true}
          onReady={onReady}
          onDuration={onDuration}
          onProgress={onProgress}
          onEnded={sendWatchFinished}
          onPlay={handlePlay}
          onPause={handlePause}
          onError={handleError}
          width="100%"
          height="100%"
          style={{ objectFit: 'contain' }}
          config={{ youtube: { playerVars: { disablekb: 1 } } }}
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

      {(isProcessing || !isReady || startWatchingIsLoading) && (
        <div className={styles['loader-container']}>
          <Loader2 />
        </div>
      )}

      {isPlaying && <div className={styles['no-interaction-overlay']}></div>}

      {/* Android browsers may not allow to play advertisement automatically.
      Check for canPlay doesn't work. */}
      {/* UNCOMMENT THIS IF
      we decided to show advertisement hosted somewhere else but not youtube
      The custom play button won't work with Youtube's iframe on Android devices.
      That's why it's hidden for now */}
      {/* {!isPlaying && isReady && !startWatchingIsLoading && (
        <div
          className={styles['play-button-overlay']}
          onClick={handlePlay}>
          <button className={styles['play-button']}>
            <PlayIcon />
          </button>
        </div>
      )} */}
    </div>
  );
}
