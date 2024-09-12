import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import styles from './VideoPreview.module.scss';

const VideoPreview = forwardRef(({ fileContent, file }, ref) => {
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
      <VideoPlayer ref={playerRef} fileContent={fileContent} />

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
});

export default VideoPreview;
