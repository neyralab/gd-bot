import { useMemo } from 'react';
import CustomFileIcon from '../../customFileIcon';

import style from './styles.module.scss';

const DefaultPreview = ({ file, text = '' }) => {
  const color = useMemo(() => {
    return file.color?.length > 0
      ? file.color[file.color.length - 1].hex
      : 'transparent';
  }, [file.color]);

  return (
    <div className={style.defaultPreview}>
      <CustomFileIcon
        extension={file.extension}
        color={color}
        dateCreated={file.created_at}
      />
      <div>{text || 'Preview is unavailable'}</div>
    </div>
  );
};

export default DefaultPreview;
