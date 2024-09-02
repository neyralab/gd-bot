import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import { toast } from 'react-toastify';
import CN from 'classnames';

import { ReactComponent as ForwardIcon } from './assets/forward.svg';
import { ReactComponent as RewindIcon } from './assets/rewind.svg';
import { ReactComponent as PLayIcon } from './assets/play.svg';
import { ReactComponent as PauseIcon } from './assets/pause.svg';
import { createStreamEffect } from '../../../../effects/filesEffects';

import styles from './styles.module.css';

const CircleAudioPlayer = ({ file, wrapper }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ipfsAudio, setIpfsAudio] = useState('');
  const radius = useMemo(() => (window.innerWidth - 40) / 2, []); // Радіус прогрес-бару
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]); // Довжина окружності

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audioRef]);

  const handleRewind = useCallback(() => {
    audioRef.current.currentTime -= 10;
  }, [audioRef]);

  const handleForward = useCallback(() => {
    audioRef.current.currentTime += 10;
  }, [audioRef]);

  const handleProgressClick = useCallback(
    (event) => {
      const boundingRect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - boundingRect.left - boundingRect.width / 2;
      const y = event.clientY - boundingRect.top - boundingRect.height / 2;
      const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      const adjustedAngle = angle < 0 ? angle + 360 : angle;
      const newTime = (adjustedAngle / 360) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    },
    [audioRef]
  );

  useEffect(() => {
    const updateProgress = () => {
      const progressValue =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progressValue);
    };

    audioRef.current.addEventListener('timeupdate', updateProgress);

    return () => {
      audioRef?.current?.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  useEffect(() => {
    createStreamEffect(file.slug)
      .then((data) => {
        setIpfsAudio(data);
      })
      .catch(() => {
        toast.error('Sorry, something went wrong. Please try again later');
      });
  }, []);

  useEffect(() => {
    if (wrapper.current) {
      wrapper.current.className = styles['player-ackground'];
    }
  }, [wrapper]);

  const onFinish = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
  }, []);
  return (
    <div className={styles['player-container']}>
      <div className={styles['circle-audio-player']}>
        <audio
          ref={audioRef}
          onEnded={onFinish}
          src={ipfsAudio ? ipfsAudio : undefined}
        />
        <div
          className={styles['controls']}
          style={{
            width: `${radius * 2 - 40}px`,
            height: `${radius * 2 - 40}px`
          }}>
          <button
            className={styles['circle-audio-button']}
            onClick={handleRewind}>
            <RewindIcon />
          </button>
          <button
            className={CN(
              styles['circle-audio-button'],
              styles['circle-audio-play-button']
            )}
            onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PLayIcon />}
          </button>
          <button
            className={styles['circle-audio-button']}
            onClick={handleForward}>
            <ForwardIcon />
          </button>
        </div>
        <div
          style={{ height: `${radius * 2}px` }}
          className={styles['progress-container']}
          onClick={handleProgressClick}>
          <svg
            className={styles['circle-audio-svg']}
            width={`${radius * 2}px`}
            height={`${radius * 2}px`}>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  style={{ stopColor: '#00F2FE', stopOpacity: 0.3 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: '#00F2FE', stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <circle
              className={styles['progress-background']}
              cx={radius}
              cy={radius}
              r={radius}
              strokeWidth="4"
            />
            <circle
              className={styles['progress']}
              cx={radius}
              cy={radius}
              r={radius}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference - (progress / 100) * circumference
              }
            />
          </svg>
          <div
            className={styles['indicator']}
            style={{
              transform: `rotate(${(progress / 100) * 360}deg) translate(0, -${radius}px)`
            }}>
            <div className={styles['indicator-dot']}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleAudioPlayer;
