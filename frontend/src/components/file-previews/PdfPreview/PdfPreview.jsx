import React from 'react';
import DefaultModeFileUI from '../components/DefaultModeFileUI/DefaultModeFileUI';
import PdfSliderReader from '../components/PdfSliderReader/PdfSliderReader';
import styles from './PdfPreview.module.scss';

const PdfPreview = ({
  mode = 'default',
  file,
  fileContent,
  onFavoriteClick,
  onInfoClick,
  onFileReadError
}) => {
  return (
    <div className={styles.container}>
      <PdfSliderReader
        fileContent={fileContent}
        onFileReadError={onFileReadError}
      />

      {mode === 'default' && (
        <DefaultModeFileUI
          file={file}
          onFavoriteClick={onFavoriteClick}
          onInfoClick={onInfoClick}
        />
      )}
    </div>
  );
};

export default PdfPreview;
