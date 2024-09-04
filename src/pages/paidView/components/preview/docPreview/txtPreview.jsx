import React from 'react';
import CN from 'classnames';

import TxtPreview from '../../../../../components/filePreviewModal/previewContent/TxtPreview';
import { FullscreenBtn } from '../../fullscreenBtn';
import { removeExtension } from '../../../../../utils/string';

import styles from './styles.module.css';

export const TxtPreviewer = ({ fileContent, file, allowPreview, fullscreen, onFullscreen }) => {

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  const onChangeFullScreen = () => {
    if (allowPreview)
      onFullscreen(!fullscreen);
  }

  return (
    <div className={CN(styles.previewerWrapper, fullscreen && styles.fullPreview )}>
      <div
        className={CN(styles.previewerContent, !allowPreview && styles.blurContent )}
        onScroll={onClick}
      >
        <TxtPreview
          file={file}
          fileContent={fileContent}
          className={styles.txtDocument}
        />
        <FullscreenBtn
          className={styles.fullscreenBtn}
          onFullscreen={onChangeFullScreen}
        />
      </div>
     {!fullscreen && <h3 className={styles.title}>{removeExtension(file.name)}</h3>}
    </div>
  );
}
