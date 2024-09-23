import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';

import { ReactComponent as ForwardIcon } from '../../../../../components/filePreviewModal/previewContent/VideoPreview/assets/forward_10.svg';
import { ReactComponent as RewindIcon } from '../../../../../components/filePreviewModal/previewContent/VideoPreview/assets/replay_10.svg';
import { ReactComponent as PauseIcon } from '../../../../../components/filePreviewModal/previewContent/VideoPreview/assets/pause.svg';
import { ReactComponent as PlayIcon } from '../../../../../components/filePreviewModal/previewContent/VideoPreview/assets/play.svg';
import { removeExtension, formatDuration } from '../../../../../utils/string';

import styles from './styles.module.css';

const PAUSE_THRESHOLD_SECONDS = 10;

export const VideoPreview = ({ file, fileContent, allowPreview }) => {
  const { t } = useTranslation('drive');
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  
  const [playing, setPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [dimension, setDimensions] = useState({ width: 0, height: 0 });
  const [seeking, setSeeking] = useState(false);
  const [played, setPlayed] = useState(0);

  const handleFastForward = () => {
    const player = playerRef.current;
    if (player && allowPreview) {
      player.seekTo(player.getCurrentTime() + 10);
    }
  };

  const handleRewind = () => {
    const player = playerRef.current;
    if (player && allowPreview) {
      player.seekTo(player.getCurrentTime() - 10);
    }
  };

  const handlePlayPause = () => {
    if (allowPreview) {
      setPlaying(!playing);
      if (!playing) {
        setShowControls(false);
      }
    } else {
      const time = playerRef.current.getCurrentTime();
      if (time >= PAUSE_THRESHOLD_SECONDS) {
        playerRef.current.seekTo(0);
        setPlaying(!playing);
        setShowControls(false);
      } else {
        setPlaying(!playing);
        if (!playing) {
          setShowControls(false);
        }
      }
    }
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      const currentTime = state.playedSeconds;
      
      if (currentTime >= PAUSE_THRESHOLD_SECONDS && !allowPreview) {
        setShowControls(true);
        setPlaying(false);
      }
    }
  };

  const toggleControlsVisibility = () => {
    if (playing) {
      setPlaying(false);
      setShowControls(true);
    }
  };

  const handleSeek = useCallback((e) => {
    const bounds = progressRef.current.getBoundingClientRect();
    const seekPosition = (e.clientX - bounds.left) / bounds.width;
    playerRef.current.seekTo(seekPosition);
  }, []);

  const handleSeekMouseDown = () => setSeeking(true);

  const handleSeekChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    playerRef.current.seekTo(value, 'fraction');
  };

  const handleSeekMouseUp = () => setSeeking(false);

  const handleReady = () => {
    const player = playerRef.current.getInternalPlayer();
    if (player) {
      setDimensions({
        width: player.videoWidth,
        height: player.videoHeight
      });
    }
  };

  const videoSize = useMemo(() => {
    if (dimension.width < dimension.height) {
      return { width: 'auto', height: '100%' };
    } else {
      return { width: '100%', height: 'auto' };
    }
  }, [dimension.width, dimension.height]);

  return (
    <>
      <div className={styles.container} onClick={toggleControlsVisibility}>
        <ReactPlayer
          ref={playerRef}
          url={fileContent}
          playing={playing}
          controls={false}
          className={styles.player}
          width={videoSize.width}
          height={videoSize.height}
          onProgress={handleProgress}
          onReady={handleReady}
        />
        {showControls && (
          <div className={styles.controls}>
            <button onClick={handleRewind}>
              <RewindIcon />
            </button>
            <button onClick={handlePlayPause} className={styles.pauseBtn}>
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={handleFastForward}>
              <ForwardIcon />
            </button>
          </div>
        )}
        <div ref={progressRef} className={styles.progressWrapper} onClick={handleSeek}>
          <input
            className={styles.bar}
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            disabled={!allowPreview}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{removeExtension(file.name)}</h3>
        {!allowPreview && (
          <p className={styles.progress}>
            <span>{t('ppv.freeWatch')}</span>
            {`0:10 | ${formatDuration(playerRef.current?.getDuration())}`}
          </p>
        )}
      </div>
    </>
  );
}
