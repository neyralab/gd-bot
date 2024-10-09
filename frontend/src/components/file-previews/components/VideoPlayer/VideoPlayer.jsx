import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef
} from 'react';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import Controls from './Controls/Controls';
import ProgressBar from './ProgressBar/ProgressBar';
import styles from './VideoPlayer.module.scss';

const VideoPlayer = forwardRef(
  (
    {
      fileContent,
      fileContentType = 'blob',
      disableSwipeEvents,
      onFileReadError,
      hideControlUtils,
      playerProps = {},
    },
    ref
  ) => {
    const { t } = useTranslation('drive');
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [seeking, setSeeking] = useState(false);
    const [played, setPlayed] = useState(0);
    const [url, setUrl] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
      if (fileContentType === 'blob') {
        const blobUrl = URL.createObjectURL(fileContent);
        setUrl(blobUrl);
      }

      if (fileContentType === 'url') {
        setUrl(fileContent);
      }
    }, [fileContentType]);

    useEffect(() => {
      if (seeking) {
        disableSwipeEvents?.(true);
      } else {
        disableSwipeEvents?.(false);
      }

      return () => {
        disableSwipeEvents?.(false);
      };
    }, [seeking]);

    useImperativeHandle(ref, () => ({
      runPreview: () => {
        setPlaying(true);
        setShowControls(false);
        setPlayed(0);
        if (playerRef.current) {
          playerRef.current.seekTo(0);
        }
      },
      stopPreview: () => {
        setPlaying(false);
        setShowControls(false);
        setPlayed(0);
        if (playerRef.current) {
          playerRef.current.seekTo(0);
        }
      },
      playerRef: playerRef.current,
    }));

    const handleFastForward = () => {
      const player = playerRef.current;
      if (player) {
        player.seekTo(player.getCurrentTime() + 10);
      }
    };

    const handleRewind = () => {
      const player = playerRef.current;
      if (player) {
        player.seekTo(player.getCurrentTime() - 10);
      }
    };

    const handlePlayPause = () => {
      setPlaying(!playing);
      if (!playing) {
        setShowControls(false);
      }
    };

    const handleProgress = (state) => {
      if (!seeking) {
        setPlayed(state.played);
      }
    };

    const handleEnded = () => {
      setPlaying(false);
      setShowControls(true);
    };

    const toggleControlsVisibility = () => {
      if (playing) {
        setPlaying(false);
      }

      setShowControls(!showControls);
    };

    const handleSeekMouseDown = () => setSeeking(true);

    const handleSeekChange = (e) => {
      const value = parseFloat(e.target.value);
      setPlayed(value);
      playerRef.current.seekTo(value, 'fraction');
    };

    const handleSeekMouseUp = () => setSeeking(false);

    const handlePlay = () => {
      setPlaying(true);
    };

    const handlePause = () => {
      setPlaying(false);
    };

    const handleError = (error) => {
      console.error('Error playing video:', error);
      setPlaying(false);
      setShowControls(true);

      const errorStr = error.toString().trim().toLowerCase();
      if (errorStr.includes('notsupportederror')) {
        onFileReadError?.(error);
      }
    };

    return (
      <div className={styles.container}>
        {url && (
          <div
            className={styles['video-wrapper']}
            onClick={toggleControlsVisibility}>
            <ReactPlayer
              ref={playerRef}
              url={url}
              playing={playing}
              playsinline={true}
              controls={false}
              className={styles.player}
              width={'100%'}
              height={'100%'}
              onProgress={handleProgress}
              onEnded={handleEnded}
              onPlay={handlePlay}
              onPause={handlePause}
              onError={handleError}
              key={url}
              forceload={'true'}
              {...playerProps}
            />
            <div className={styles['no-interaction-overlay']}></div>
          </div>
        )}

        {(showControls && !hideControlUtils) && (
          <Controls
            playing={playing}
            handlePlayPause={handlePlayPause}
            handleFastForward={handleFastForward}
            handleRewind={handleRewind}
          />
        )}

        {error && <div className={styles.error}>{t('error.readFile')}</div>}

        {!hideControlUtils && (
          <ProgressBar
            played={played}
            handleSeekMouseDown={handleSeekMouseDown}
            handleSeekChange={handleSeekChange}
            handleSeekMouseUp={handleSeekMouseUp}
          />
        )}
      </div>
    );
  }
);

export default VideoPlayer;
