import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { removeExtension, formatDuration } from '../../../../../utils/string';
import VideoPlayer from '../../../../../components/file-previews/components/VideoPlayer/VideoPlayer';
import Controls from '../../../../../components/file-previews/components/VideoPlayer/Controls/Controls';
import ProgressBar from '../../../../../components/file-previews/components/VideoPlayer/ProgressBar/ProgressBar';

import styles from './styles.module.css';

const PAUSE_THRESHOLD_SECONDS = 10;

export const VideoPreview = ({ file, fileContent, allowPreview }) => {
  const [showControls, setShowControls] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const { t } = useTranslation('drive');
  const videoPlayerRef = useRef();

  const toggleControlsVisibility = () => {
    if (playing) {
      setPlaying(false);
    }
    setShowControls(!showControls);
  };

  const timeToPercent = (time) => {
    const timeDuration = videoPlayerRef.current?.playerRef?.getDuration();

    return time/timeDuration || 0;
  }

  const handleProgress = (state) => {
    if (!allowPreview && state.playedSeconds > PAUSE_THRESHOLD_SECONDS) {
      setPlaying(false);
      setShowControls(true);
    } else {
      setPlayed(state.played);
    }
  };

  const handlePlayPause = () => {
    const player = videoPlayerRef.current?.playerRef;
    const currentTime = player?.getCurrentTime();
    if (allowPreview || (!allowPreview && (currentTime <= PAUSE_THRESHOLD_SECONDS))) {
      setPlaying(!playing);
      if (!playing) {
        setShowControls(false);
      }
    } else {
      setPlaying(true);
      player.seekTo(0);
      setPlayed(0);
    }
  };

  const handleFastForward = (e) => {
    const player = videoPlayerRef.current?.playerRef;
    if (player && ((!allowPreview &&
      (player.getCurrentTime() + 10 <= PAUSE_THRESHOLD_SECONDS)) || allowPreview)
    ) {
      player.seekTo(player.getCurrentTime() + 10);
    }
  };

  const handleRewind = (e) => {
    const player = videoPlayerRef.current?.playerRef;
    if (player) {
      player.seekTo(played - timeToPercent(10));
    }
  };

  const handleSeekChange = (e) => {
    const player = videoPlayerRef.current?.playerRef;
    const value = parseFloat(e.target.value);
    const currentTime = player?.getCurrentTime();
    if (currentTime <= PAUSE_THRESHOLD_SECONDS || allowPreview) {
      setPlayed(value);
      player?.seekTo(value, 'fraction');
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    setShowControls(true);
  };

  return (
    <>
      <div
        className={styles['player-container']}
        onClick={toggleControlsVisibility}
      >
        <VideoPlayer
          file={file}
          fileContent={fileContent}
          fileContentType='url'
          ref={videoPlayerRef}
          hideControlUtils
          playerProps={{
            playing: playing,
            onProgress: handleProgress,
            onEnded: handleEnded
          }}
        />
        {showControls && (
          <Controls
            playing={playing}
            handlePlayPause={handlePlayPause}
            handleFastForward={handleFastForward}
            handleRewind={handleRewind}
          />
        )}
        <ProgressBar
          played={played}
          handleSeekMouseDown={() => {}}
          handleSeekChange={handleSeekChange}
          handleSeekMouseUp={() => {}}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{removeExtension(file.name)}</h3>
        {!allowPreview && (
          <p className={styles.progress}>
            <span>{t('ppv.freeWatch')}</span>
            {`0:10 | ${formatDuration(videoPlayerRef.current?.playerRef?.getDuration?.())}`}
          </p>
        )}
      </div>
    </>
  );
}
