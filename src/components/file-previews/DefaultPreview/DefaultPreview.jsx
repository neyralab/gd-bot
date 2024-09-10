import { useMemo } from 'react';
import CustomFileIcon from '../../customFileIcon';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import styles from './DefaultPreview.module.scss';

const DefaultPreview = ({ file, text = '' }) => {
  const color = useMemo(() => {
    return file.color?.length > 0
      ? file.color[file.color.length - 1].hex
      : 'transparent';
  }, [file.color]);

  return (
    <>
      <div className={styles['default-preview']}>
        <CustomFileIcon
          extension={file.extension}
          color={color}
          dateCreated={file.created_at}
        />
        <div>{text || 'Preview is unavailable'}</div>
      </div>

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </>
  );
};

export default DefaultPreview;
