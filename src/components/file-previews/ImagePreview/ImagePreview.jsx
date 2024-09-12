import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import ImageReader from '../components/ImageReader/ImageReader';
import styles from './ImagePreview.module.scss';

const ImagePreview = ({ file, fileContent }) => {
  return (
    <div className={styles.container}>
      <ImageReader fileContent={fileContent} />

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
};

export default ImagePreview;
