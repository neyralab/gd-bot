import React, { useMemo } from "react";

import { ImagePreview } from './imagePreview';
import { AudioPreview } from './audioPreview';
import { VideoPreview } from './videoPreview';
import PdfPreview from '../../../../components/filePreviewModal/previewContent/PdfPreview';
import TxtPreview from '../../../../components/filePreviewModal/previewContent/TxtPreview';
import ExcelPreview from '../../../../components/filePreviewModal/previewContent/ExcelPreview';
import { DocPreview } from './docPreview';
import { getPreviewFileType } from '../../../../utils/preview';

import styles from './styles.module.css';

export const Preview = ({ file, fileContent, allowPreview, fullscreen, onFullscreen }) => {
  const previewFileType = useMemo(() => getPreviewFileType(file, fileContent), [file, fileContent]);

  const renderPreview = () => {
    switch (previewFileType) {
      case 'img':
        return (
          <ImagePreview
            file={file}
            fileContent={fileContent}
            fullscreen={fullscreen}
            allowPreview={allowPreview}
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
      case 'pdf':
        return (
          <DocPreview
            file={file}
            fileContent={fileContent}
            allowPreview={allowPreview}
            fullscreen={fullscreen}
            onFullscreen={onFullscreen}
          >
            <PdfPreview
              file={file}
              fileContent={fileContent}
              pageWidthProp={window.innerWidth - 32}
            />
          </DocPreview>
        );
      case 'txt':
        return (
          <DocPreview
            file={file}
            fileContent={fileContent}
            allowPreview={allowPreview}
            fullscreen={fullscreen}
            onFullscreen={onFullscreen}
          >
            <TxtPreview
              file={file}
              fileContent={fileContent}
              className={styles.txtDocument}
            />
          </DocPreview>
        );
      case 'xlsx':
        return (
          <DocPreview
            file={file}
            fileContent={fileContent}
            allowPreview={allowPreview}
            fullscreen={fullscreen}
            onFullscreen={onFullscreen}
          >
            <ExcelPreview
              file={file}
              fileContent={fileContent}
              className={styles.txtDocument}
            />
          </DocPreview>
        );

      default:
        return null;
    }
  };

  return renderPreview();
};
