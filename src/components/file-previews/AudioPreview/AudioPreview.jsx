import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import styles from './AudioPreview.module.scss';

const AudioPreview = forwardRef(
  (
    {
      mode = 'default',
      file,
      fileContent,
      fileContentType,
      onFavoriteClick,
      onInfoClick
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
        />

        {mode === 'default' && (
          <>
            <DefaultFileTitle file={file} />
            <DefaultFileActions
              file={file}
              onFavoriteClick={onFavoriteClick}
              onInfoClick={onInfoClick}
            />
          </>
        )}
      </div>
    );
  }
);

export default AudioPreview;
