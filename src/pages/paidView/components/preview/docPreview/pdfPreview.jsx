import React from 'react';
import CN from 'classnames';

import PdfPreview from '../../../../../components/filePreviewModal/previewContent/PdfPreview';
import { FullscreenBtn } from '../../fullscreenBtn';
import { removeExtension } from '../../../../../utils/string';

import styles from './styles.module.css';

export const PdfPreviewer = ({ fileContent, file, allowPreview, fullscreen, onFullscreen }) => {

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
    <div className={CN(styles.previewerWrapper, fullscreen && styles.fullPreview )} >
      <div
        className={CN(styles.previewerContent, !allowPreview && styles.blurContent )}
        onScroll={onClick}
      >
        <PdfPreview
          file={file}
          fileContent={fileContent}
          pageWidthProp={window.innerWidth - 32}
          disableScroll
        />
        <FullscreenBtn
          className={styles.document}
          onFullscreen={onChangeFullScreen}
        />
      </div>
     {!fullscreen && <h3 className={styles.title}>{removeExtension(file.name)}</h3>}
    </div>
  );
}
