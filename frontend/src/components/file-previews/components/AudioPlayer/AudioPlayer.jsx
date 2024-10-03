import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef
} from 'react';
import { useTranslation } from 'react-i18next';
import Controls from './Controls/Controls';
import ProgressBar from './ProgressBar/ProgressBar';
import styles from './AudioPlayer.module.scss';

const AudioPlayer = forwardRef(
  (
    {
      fileContentType,
      fileContent,
      filePreviewImage,
      disableSwipeEvents,
      onFileReadError
    },
    ref
  ) => {
    const { t } = useTranslation('drive');
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [radius, setRadius] = useState(0);
    const [url, setUrl] = useState();
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState(false);

    useEffect(() => {
      if (fileContentType === 'blob') {
        setUrl(URL.createObjectURL(fileContent));
      }
      if (fileContentType === 'url') {
        setUrl(fileContent);
      }
    }, [fileContent]);

    useEffect(() => {
      const updateRadius = () => {
        const newRadius =
          (Math.min(window.innerWidth, window.innerHeight) - 40) / 2;
        setRadius(newRadius);
      };

      updateRadius();

      window.addEventListener('resize', updateRadius);
      return () => window.removeEventListener('resize', updateRadius);
    }, []);

    useImperativeHandle(ref, () => ({
      runPreview: () => {
        setIsPlaying(true);
        setProgress(0);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(handleError);
        }
      },
      stopPreview: () => {
        setIsPlaying(false);
        setProgress(0);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.pause();
        }
      }
    }));

    const handleTimeUpdate = () => {
      const progressValue = audioRef.current
        ? (audioRef.current.currentTime / audioRef.current.duration) * 100
        : 0;
      setProgress(progressValue);
    };

    const handleLoad = () => {
      setDuration(audioRef.current.duration);
    };

    const handlePlayPause = useCallback(() => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(handleError);
      }
      setIsPlaying(!isPlaying);
    }, [isPlaying, audioRef]);

    const handleRewind = useCallback(() => {
      audioRef.current.currentTime -= 10;
    }, [audioRef]);

    const handleForward = useCallback(() => {
      audioRef.current.currentTime += 10;
    }, [audioRef]);

    const handleProgressChange = ({ newTime }) => {
      audioRef.current.currentTime = newTime;
    };

    const onFinish = useCallback(() => {
      setIsPlaying(false);
      setProgress(0);
    }, []);

    const handleError = (error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);

      const errorStr = error.toString().trim().toLowerCase();
      if (errorStr.includes('notsupportederror')) {
        onFileReadError?.(error);
      }
    };

    return (
      <div className={styles['player-container']}>
        <div
          className={styles['player-background']}
          style={{
            backgroundImage: filePreviewImage
              ? `url(${filePreviewImage})`
              : null
          }}></div>

        <div className={styles['circle-audio-player']}>
          <audio
            ref={audioRef}
            onEnded={onFinish}
            onError={handleError}
            onLoadedMetadata={handleLoad}
            onTimeUpdate={handleTimeUpdate}
            src={url}
          />

          <ProgressBar
            progress={progress}
            radius={radius}
            duration={duration}
            handleProgressChange={handleProgressChange}
            disableSwipeEvents={disableSwipeEvents}
          />

          <Controls
            radius={radius}
            isPlaying={isPlaying}
            filePreviewImage={filePreviewImage}
            handlePlayPause={handlePlayPause}
            handleRewind={handleRewind}
            handleForward={handleForward}
          />
        </div>

        {error && <div className={styles.error}>{t('error.readFile')}</div>}
      </div>
    );
  }
);

export default AudioPlayer;
