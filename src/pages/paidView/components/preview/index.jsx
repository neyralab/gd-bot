import React, { useState, useEffect } from "react";

import { ImagePreview } from './imagePreview';
import { AudioPreview } from './audioPreview';
import { VideoPreview } from './videoPreview';

import { getPreviewFileType } from '../../../../utils/preview';

export const Preview = ({ file, fileContent, allowPreview, fullscreen, onFullscreen }) => {
  const [previewFileType, setPreviewFileType] = useState('');

  useEffect(() => {
    setPreviewFileType(getPreviewFileType(file, fileContent));
  }, [fileContent, file])

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
      return (
        <AudioPreview
          file={file}
          allowPreview={allowPreview}
        />
      );
    case 'video':
      return (
        <VideoPreview
          file={file}
          fileContent={fileContent}
          allowPreview={allowPreview}
        />
      );
    // default:
      // return <DefaultPreview file={file} />;
      default:
        return true
  }
}