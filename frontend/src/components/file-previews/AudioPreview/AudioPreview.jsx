import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import DefaultModeFileUI from '../components/DefaultModeFileUI/DefaultModeFileUI';
import styles from './AudioPreview.module.scss';

const AudioPreview = forwardRef(
  (
    {
      mode = 'default',
      file,
      fileContent,
      fileContentType,
      filePreviewImage,
      onFavoriteClick,
      onInfoClick,
      disableSwipeEvents
    },
    ref
  ) => {
    const audioRef = useRef(null);

    useImperativeHandle(ref, () => ({
      runPreview: () => {
        if (audioRef.current) {
          audioRef.current.runPreview();
        }
      },
      stopPreview: () => {
        if (audioRef.current) {
          audioRef.current.stopPreview();
        }
      }
    }));

    return (
      <div className={styles.container}>
        <AudioPlayer
          ref={audioRef}
          file={file}
          fileContent={fileContent}
          fileContentType={fileContentType}
          filePreviewImage={filePreviewImage}
          disableSwipeEvents={disableSwipeEvents}
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

export default AudioPreview;
