import React, { useEffect, useRef, useMemo } from "react";
import CN from 'classnames';

import { FullscreenBtn } from '../../fullscreenBtn';
import { removeExtension } from '../../../../../utils/string';

import styles from './styles.module.css';

export const ImagePreview = ({ file, fileContent, allowPreview, fullscreen, onFullscreen }) => {
  const canvasRef = useRef(null);

  const isSVG = useMemo(() => fileContent.endsWith('</svg>'), [fileContent]);

  useEffect(() => {
    if (!fileContent || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.src = isSVG
      ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fileContent)}`
      : fileContent;

    img.onload = () => {
      const containerWidth = fullscreen ? window.innerWidth : canvas.parentElement.offsetWidth;
      const containerHeight = fullscreen ? (window.innerHeight - 150) : canvas.parentElement.offsetHeight;
      const imgRatio = img.width / img.height;
      const containerRatio = containerWidth / containerHeight;

      const [drawWidth, drawHeight] = imgRatio > containerRatio
        ? [containerWidth, containerWidth / imgRatio]
        : [containerHeight * imgRatio, containerHeight];

      canvas.width = containerWidth;
      canvas.height = containerHeight;
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;

      if (!allowPreview) {
        ctx.filter = 'blur(15px)';
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };
  }, [fileContent, isSVG, allowPreview, fullscreen, canvasRef]);

  return (
    <div className={CN(styles.preview, fullscreen && styles.fullPreview)}>
      <canvas
        ref={canvasRef}
        className={styles.image}
        style={{ width: '100%', height: '100%' }}
      />
      <FullscreenBtn onFullscreen={onFullscreen} />
      <h3 className={styles.title}>{removeExtension(file.name)}</h3>
    </div>
  );
};
