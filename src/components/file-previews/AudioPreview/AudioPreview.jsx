import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
  useEffect
} from 'react';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import { getFilePreviewEffect } from '../../../effects/filesEffects';
import styles from './AudioPreview.module.scss';

const AudioPreview = forwardRef(
  (
    {
      mode = 'default',
      usePreviewImage = true,
      file,
      fileContent,
      fileContentType,
      onFavoriteClick,
      onInfoClick
    },
    ref
  ) => {
    const audioRef = useRef(null);
    const [filePreviewImage, setFilePreviewImage] = useState(null);

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

    useEffect(() => {
      if (usePreviewImage) {
        fetchPreview();
      }
    }, []);

    const fetchPreview = async () => {
      try {
        const preview = await getFilePreviewEffect(
          file.slug,
          null,
          file.extension
        );
        setFilePreviewImage(preview);
      } catch (e) {
        setFilePreviewImage(null);
      }
    };

    return (
      <div className={styles.container}>
        <AudioPlayer
          ref={audioRef}
          file={file}
          fileContent={fileContent}
          fileContentType={fileContentType}
          filePreviewImage={filePreviewImage}
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
