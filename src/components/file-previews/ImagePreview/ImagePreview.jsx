import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import ImageReader from '../components/ImageReader/ImageReader';
import styles from './ImagePreview.module.scss';

const ImagePreview = ({
  mode = 'default',
  fileContentType = 'blob',
  file,
  fileContent,
  onFavoriteClick,
  onInfoClick
}) => {
  return (
    <div className={styles.container}>
      <ImageReader
        fileContentType={fileContentType}
        fileContent={fileContent}
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
};

export default ImagePreview;
