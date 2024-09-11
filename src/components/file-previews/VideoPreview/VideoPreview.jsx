import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef
} from 'react';
import ReactPlayer from 'react-player';
import Controls from './Controls/Controls';
import ProgressBar from './ProgressBar/ProgressBar';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import styles from './VideoPreview.module.scss';

const VideoPreview = forwardRef(({ fileContent, file }, ref) => {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [played, setPlayed] = useState(0);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const blobUrl = URL.createObjectURL(fileContent);
    setUrl(blobUrl);

    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [fileContent]);

  useImperativeHandle(ref, () => ({
    runPreview: () => {
      setPlaying(true);
      setShowControls(false);
      setPlayed(0);
      playerRef?.current?.seekTo(0);
    },
    stopPreview: () => {
      setPlaying(false);
      setShowControls(false);
      setPlayed(0);
      playerRef?.current?.seekTo(0);
    }
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
            controls={false}
            className={styles.player}
            width={'100%'}
            height={'100%'}
            onProgress={handleProgress}
            onEnded={handleEnded}
          />
        </div>
      )}

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
        handleSeek={handleSeek}
        handleSeekMouseDown={handleSeekMouseDown}
        handleSeekChange={handleSeekChange}
        handleSeekMouseUp={handleSeekMouseUp}
      />

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
});

export default VideoPreview;
