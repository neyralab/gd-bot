import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

import { ReactComponent as ForwardIcon } from './assets/forward_10.svg';
import { ReactComponent as RewindIcon } from './assets/replay_10.svg';
import { ReactComponent as PauseIcon } from './assets/pause.svg';
import { ReactComponent as PlayIcon } from './assets/play.svg';

import s from './style.module.scss';

function VideoPreview({ fileContent }) {
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [dimension, setDimensions] = useState({ width: 0, height: 0 });
  const [seeking, setSeeking] = useState(false);
  const [played, setPlayed] = useState(0);

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
    <div className={s.container} onClick={toggleControlsVisibility}>
      <ReactPlayer
        ref={playerRef}
        url={fileContent}
        playing={playing}
        controls={false}
        className={s.player}
        width={videoSize.width}
        height={videoSize.height}
        onProgress={handleProgress}
        onReady={handleReady}
      />
      {showControls && (
        <div className={s.controls}>
          <button onClick={handleRewind}>
            <RewindIcon />
          </button>
          <button onClick={handlePlayPause} className={s.pauseBtn}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button onClick={handleFastForward}>
            <ForwardIcon />
          </button>
        </div>
      )}
      <div ref={progressRef} className={s.progressWrapper} onClick={handleSeek}>
        <input
          className={s.bar}
          type="range"
          min={0}
          max={1}
          step="any"
          value={played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
        />
      </div>
    </div>
  );
}

export default VideoPreview;
