import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import CN from 'classnames';

import { ReactComponent as ForwardIcon } from '../../../../../components/filePreviewModal/components/AudioPreview/assets/forward.svg';
import { ReactComponent as RewindIcon } from '../../../../../components/filePreviewModal/components/AudioPreview/assets/rewind.svg';
import { ReactComponent as PLayIcon } from '../../../../../components/filePreviewModal/components/AudioPreview/assets/play.svg';
import { ReactComponent as PauseIcon } from '../../../../../components/filePreviewModal/components/AudioPreview/assets/pause.svg';
import { removeExtension, formatDuration } from '../../../../../utils/string';
import { createStreamEffect } from '../../../../../effects/filesEffects';

import styles from './styles.module.css';

const PAUSE_THRESHOLD_SECONDS = 10;

export const AudioPreview = ({ file, allowPreview }) => {
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const { t } = useTranslation('drive');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ipfsAudio, setIpfsAudio] = useState('');
  const radius = useMemo(() => (containerRef?.current?.clientWidth/2), [containerRef.current]);
  const circumference = useMemo(() => (2 * Math.PI * radius), [radius]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!allowPreview && audioRef.current.currentTime >= PAUSE_THRESHOLD_SECONDS) {
        setProgress(0);
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audioRef, allowPreview]);

  const handleRewind = useCallback(() => {
    if (allowPreview)
      audioRef.current.currentTime -= 10;
  }, [audioRef, allowPreview]);

  const handleForward = useCallback(() => {
    if (allowPreview)
      audioRef.current.currentTime += 10;
  }, [audioRef, allowPreview]);

  const handleProgressClick = useCallback((event) => {
    if (allowPreview) {
      const boundingRect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - boundingRect.left - boundingRect.width / 2;
      const y = event.clientY - boundingRect.top - boundingRect.height / 2;
      const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      const adjustedAngle = angle < 0 ? angle + 360 : angle;
      const newTime = (adjustedAngle / 360) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  }, [audioRef, allowPreview]);

  useEffect(() => {
    createStreamEffect(file.slug)
      .then((data) => {setIpfsAudio(data)})
      .catch(() => {
        toast.error('Sorry, something went wrong. Please try again later');
      })
  }, [file.slug]);

  const onFinish = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const updateProgress = () => {
    const progressValue = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progressValue);

    if (!allowPreview && audioRef.current.currentTime >= PAUSE_THRESHOLD_SECONDS) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <div className={styles["player-container"]}>
        <div ref={containerRef} className={styles["circle-audio-player"]}>
          <audio
            ref={audioRef}
            onEnded={onFinish}
            src={ipfsAudio ? ipfsAudio  : undefined}
            onTimeUpdate={updateProgress}
          />
          <div
            className={styles["controls"]}
            style={{ width: `${radius*2 - 40}px`, height: `${radius*2 - 40}px` }}
          >
            <button className={styles["circle-audio-button"]} onClick={handleRewind}>
              <RewindIcon />
            </button>
            <button
              className={CN(styles["circle-audio-button"], styles["circle-audio-play-button"])}
              onClick={handlePlayPause}
            >
              {isPlaying ? <PauseIcon /> : <PLayIcon />}
            </button>
            <button className={styles["circle-audio-button"]} onClick={handleForward}>
              <ForwardIcon />
            </button>
          </div>
          <div
            style={{ height: `${radius*2}px` }}
            className={styles["progress-container"]}
            onClick={handleProgressClick}
          >
            <svg
              className={styles["circle-audio-svg"]}
              width={`${radius*2}px`}
              height={`${radius*2}px`}
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00F2FE', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#00F2FE', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle
                className={styles["progress-background"]}
                cx={radius}
                cy={radius}
                r={radius}
                strokeWidth="4"
              />
              <circle
                className={styles["progress"]}
                cx={radius}
                cy={radius}
                r={radius}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progress / 100) * circumference}
              />
            </svg>
            <div
              className={styles["indicator"]}
              style={{
                transform: `rotate(${(progress / 100) * 360}deg) translate(10px, -${(radius)}px)`,
              }}
            >
              <div className={styles["indicator-dot"]}></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{removeExtension(file.name)}</h3>
        {!allowPreview && (
          <p className={styles.progress}>
            <span>{t('ppv.preview')}</span>
            {`0:10 | ${formatDuration(audioRef.current?.duration)}`}
          </p>
        )}
      </div>
    </>
  );
};
