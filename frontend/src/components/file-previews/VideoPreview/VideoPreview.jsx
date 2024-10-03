import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import DefaultModeFileUI from '../components/DefaultModeFileUI/DefaultModeFileUI';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import styles from './VideoPreview.module.scss';

const VideoPreview = forwardRef(
  (
    {
      mode = 'default',
      fileContentType = 'blob',
      fileContent,
      file,
      onFavoriteClick,
      onInfoClick,
      disableSwipeEvents,
      onFileReadError
    },
    ref
  ) => {
    const playerRef = useRef(null);

    useImperativeHandle(ref, () => ({
      runPreview: () => {
        if (playerRef.current) {
          playerRef.current.runPreview();
        }
      },
      stopPreview: () => {
        if (playerRef.current) {
          playerRef.current.stopPreview();
        }
      }
    }));

    return (
      <div className={styles.container}>
        <VideoPlayer
          fileContentType={fileContentType}
          ref={playerRef}
          fileContent={fileContent}
          disableSwipeEvents={disableSwipeEvents}
          onFileReadError={onFileReadError}
        />

        {mode === 'default' && (
          <DefaultModeFileUI
            file={file}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
          />
        )}
      </div>
    );
  }
);

export default VideoPreview;
