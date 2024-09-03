import React, { useState, useEffect, useMemo } from "react";

import { ImagePreview } from './imagePreview';
import { AudioPreview } from './audioPreview';
import { VideoPreview } from './videoPreview';

import { getPreviewFileType } from '../../../../utils/preview';

export const Preview = ({ file, fileContent, allowPreview, fullscreen, onFullscreen }) => {
  const previewFileType = useMemo(() => getPreviewFileType(file, fileContent), [file, fileContent]);

  const renderPreview = () => {
    switch (previewFileType) {
      case 'img':
        return (
          <ImagePreview
            allowPreview={allowPreview}
            file={file}
            fileContent={fileContent}
            fullscreen={fullscreen}
            onFullscreen={onFullscreen}
          />
        );
      case 'audio':
        return <AudioPreview file={file} allowPreview={allowPreview} />;
      case 'video':
        return (
          <VideoPreview
            file={file}
            fileContent={fileContent}
            allowPreview={allowPreview}
          />
        );
      default:
        return null;
    }
  };

  return renderPreview();
};
