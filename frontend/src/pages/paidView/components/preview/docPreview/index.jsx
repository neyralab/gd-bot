import React from 'react';
import CN from 'classnames';

import { FullscreenBtn } from '../../fullscreenBtn';
import { removeExtension } from '../../../../../utils/string';

import styles from './styles.module.css';

export const DocPreview = ({ file, allowPreview, fullscreen, onFullscreen, children }) => {

  const onChangeFullScreen = () => {
    if (allowPreview)
      onFullscreen(!fullscreen);
  }

  return (
    <div className={CN(styles.previewerWrapper, fullscreen && styles.fullPreview)}>
      <div className={CN(styles.previewerContent, !allowPreview && styles.blurContent)}>
        { children }
        <FullscreenBtn
          className={styles.fullscreenBtn}
          onFullscreen={onChangeFullScreen}
        />
      </div>
     {!fullscreen && <h3 className={styles.title}>{removeExtension(file.name)}</h3>}
    </div>
  );
}
