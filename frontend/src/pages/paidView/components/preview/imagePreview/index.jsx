import React from "react";
import CN from 'classnames';

import { FullscreenBtn } from '../../fullscreenBtn';
import { removeExtension } from '../../../../../utils/string';
import ImageReader from '../../../../../components/file-previews/components/ImageReader/ImageReader';

import styles from './styles.module.css';

export const ImagePreview = ({ file, fileContent, allowPreview, fullscreen, onFullscreen }) => {

  const onChangeFullScreen = () => {
    if (allowPreview)
      onFullscreen(!fullscreen);
  }

  return (
    <div className={CN(styles.preview, fullscreen && styles.fullPreview)}>
      <div className={CN(styles.content, !allowPreview && styles.blurContent)} >
        <ImageReader file={file} fileContent={fileContent} fileContentType="url" />
        <FullscreenBtn onFullscreen={onChangeFullScreen} />
      </div>
      {!fullscreen && <h3 className={styles.title}>{removeExtension(file.name)}</h3>}
    </div>
  );
};
