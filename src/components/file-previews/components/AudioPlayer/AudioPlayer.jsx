import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef
} from 'react';
import { toast } from 'react-toastify';
import { createStreamEffect } from '../../../../effects/filesEffects';
import Controls from './Controls/Controls';
import ProgressBar from './ProgressBar/ProgressBar';
import styles from './AudioPlayer.module.scss';

const AudioPlayer = forwardRef(
  ({ fileContentType = 'stream', fileContent }, ref) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [ipfsAudio, setIpfsAudio] = useState('');
    const [radius, setRadius] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (fileContentType === 'stream' && !isLoading) {
        setIsLoading(true);
        createStreamEffect(fileContent.slug)
          .then((data) => {
            setIpfsAudio(data);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast.error('Sorry, something went wrong. Please try again later');
          });
      }
    }, [fileContentType, fileContent.slug]);

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
          audioRef.current.play();
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

    const onFinish = useCallback(() => {
      setIsPlaying(false);
      setProgress(0);
    }, []);

    return (
      <div className={styles['player-container']}>
        <div className={styles['player-background']}></div>

        <div className={styles['circle-audio-player']}>
          <audio
            ref={audioRef}
            onEnded={onFinish}
            src={ipfsAudio ? ipfsAudio : undefined}
          />

          <Controls
            radius={radius}
            isPlaying={isPlaying}
            isLoading={isLoading}
            handlePlayPause={handlePlayPause}
            handleRewind={handleRewind}
            handleForward={handleForward}
          />

          <ProgressBar
            progress={progress}
            radius={radius}
            handleProgressClick={handleProgressClick}
          />
        </div>
      </div>
    );
  }
);

export default AudioPlayer;
