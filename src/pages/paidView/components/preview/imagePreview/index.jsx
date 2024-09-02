import React, { useEffect, useRef, useMemo } from "react";
import CN from 'classnames';

import { FullscreenBtn } from '../../fullscreenBtn';
import { removeExtension } from '../../../../../utils/string';

import styles from './styles.module.css';

export const ImagePreview = ({ file, fileContent, allowPreview, fullscreen, onFullscreen }) => {
  const canvasRef = useRef(null);
  const isSVG = useMemo(() => fileContent.endsWith('</svg>'));

  useEffect(() => {
    if (fileContent && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = isSVG
        ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fileContent)
        : fileContent;

      img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const containerWidth = fullscreen ? window.innerWidth : canvas.parentElement.offsetWidth;
        const containerHeight = fullscreen ? (window.innerHeight - 150) : canvas.parentElement.offsetHeight;
        const imgRatio = img.width / img.height;
        const containerRatio = containerWidth / containerHeight;

        let drawWidth, drawHeight;

        if (imgRatio > containerRatio) {
          drawWidth = containerWidth;
          drawHeight = containerWidth / imgRatio;
        } else {
          drawHeight = containerHeight;
          drawWidth = containerHeight * imgRatio;
        }

        canvas.width = containerWidth;
        canvas.height = containerHeight;
        const offsetX = (canvas.width - drawWidth) / 2;
        const offsetY = (canvas.height - drawHeight) / 2;

        if (!allowPreview) {
          ctx.filter = 'blur(15px)';
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      };
    }
  }, [fileContent, isSVG, allowPreview, canvasRef, fullscreen]);

  return (
    <div className={CN(styles.preview, fullscreen && styles.fullPreview)}>
      <canvas
        ref={canvasRef}
        className={styles.image}
        style={{ width: '100%', height: '100%' }} // Адаптивність canvas
      />
      <FullscreenBtn onFullscreen={onFullscreen} />
      <h3 className={styles.title}>{removeExtension(file.name)}</h3>
    </div>
  );
};
