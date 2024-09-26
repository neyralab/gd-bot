import DefaultModeFileUI from '../components/DefaultModeFileUI/DefaultModeFileUI';
import ImageReader from '../components/ImageReader/ImageReader';
import styles from './ImagePreview.module.scss';

const ImagePreview = ({
  mode = 'default',
  fileContentType = 'blob',
  file,
  fileContent,
  onFavoriteClick,
  onInfoClick,
  onFileReadError
}) => {
  return (
    <div className={styles.container}>
      <ImageReader
        file={file}
        fileContentType={fileContentType}
        fileContent={fileContent}
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
};

export default ImagePreview;
