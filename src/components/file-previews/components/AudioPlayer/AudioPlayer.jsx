import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef
} from 'react';
import Controls from './Controls/Controls';
import ProgressBar from './ProgressBar/ProgressBar';
import styles from './AudioPlayer.module.scss';

const AudioPlayer = forwardRef(
  ({ fileContentType, fileContent, filePreviewImage }, ref) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [radius, setRadius] = useState(0);
    const [url, setUrl] = useState();

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
        const newRadius = (window.innerWidth - 40) / 2;
        setRadius(newRadius);
      };

      updateRadius();

      window.addEventListener('resize', updateRadius);
      return () => window.removeEventListener('resize', updateRadius);
    }, []);

    useEffect(() => {
      const updateProgress = () => {
        const progressValue = audioRef.current
          ? (audioRef.current.currentTime / audioRef.current.duration) * 100
          : 0;
        setProgress(progressValue);
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);

      return () => {
        audioRef?.current?.removeEventListener('timeupdate', updateProgress);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      runPreview: () => {
        setIsPlaying(true);
        setProgress(0);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((error) => handleError(error));
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

    const handlePlayPause = useCallback(() => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => handleError(error));
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

    const onFinish = useCallback(() => {
      setIsPlaying(false);
      setProgress(0);
    }, []);

    const handleError = (error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
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
            src={url}
          />

          <ProgressBar
            progress={progress}
            radius={radius}
            handleProgressClick={handleProgressClick}
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
      </div>
    );
  }
);

export default AudioPlayer;
