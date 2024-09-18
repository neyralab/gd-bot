import React, { useMemo } from "react";
import CN from 'classnames';

import { FullscreenBtn } from '../../fullscreenBtn';
import { removeExtension } from '../../../../../utils/string';

import styles from './styles.module.css';

export const ImagePreview = ({ file, fileContent, allowPreview, fullscreen, onFullscreen }) => {

  const isSVG = useMemo(() => fileContent.endsWith('</svg>'), [fileContent]);

  const imageSrc = isSVG
  ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fileContent)}`
  : fileContent;

  const onChangeFullScreen = () => {
    if (allowPreview)
      onFullscreen(!fullscreen);
  }

  return (
    <div className={CN(styles.preview, fullscreen && styles.fullPreview)}>
      <div className={CN(styles.content, !allowPreview && styles.blurContent)} >
        <img
          src={imageSrc}
          className={styles.image}
        />
        <FullscreenBtn onFullscreen={onChangeFullScreen} />
      </div>
      {!fullscreen && <h3 className={styles.title}>{removeExtension(file.name)}</h3>}
    </div>
  );
};
