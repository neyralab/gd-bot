import { useMemo } from 'react';
import CustomFileIcon from '../../customFileIcon';
import DefaultModeFileUI from '../components/DefaultModeFileUI/DefaultModeFileUI';
import styles from './DefaultPreview.module.scss';

const DefaultPreview = ({
  mode = 'default',
  file,
  text = '',
  onFavoriteClick,
  onInfoClick
}) => {
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

      {mode === 'default' && (
        <DefaultModeFileUI
          file={file}
          onFavoriteClick={onFavoriteClick}
          onInfoClick={onInfoClick}
        />
      )}
    </>
  );
};

export default DefaultPreview;
