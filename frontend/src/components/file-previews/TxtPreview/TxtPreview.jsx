import React, { useState } from 'react';
import DefaultModeFileUI from '../components/DefaultModeFileUI/DefaultModeFileUI';
import TxtReader from '../components/TxtReader/TxtReader';
import ExpandFileButton from '../components/ExpandFileButton/ExpandFileButton';
import ExpandedFileHeader from '../components/ExpandedFileHeader/ExpandedFileHeader';
import styles from './TxtPreview.module.scss';

const TxtPreview = ({
  mode = 'default',
  fileContent,
  file,
  onFavoriteClick,
  onInfoClick,
  onExpand,
  onFileReadError
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onExpandClick = () => {
    setIsExpanded(true);
    onExpand?.(true);
  };

  const onExpandedFileClose = () => {
    setIsExpanded(false);
    onExpand?.(false);
  };

  return (
    <div className={styles.container}>
      <TxtReader
        mode={isExpanded ? 'default' : 'simplified'}
        fileContent={fileContent}
        onFileReadError={onFileReadError}
      />

      {isExpanded ? (
        <ExpandedFileHeader onClose={onExpandedFileClose} />
      ) : (
        <ExpandFileButton onExpandClick={onExpandClick} />
      )}

      {mode === 'default' && !isExpanded && (
        <DefaultModeFileUI
          file={file}
          onFavoriteClick={onFavoriteClick}
          onInfoClick={onInfoClick}
        />
      )}
    </div>
  );
};

export default TxtPreview;
