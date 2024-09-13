import React, { useState } from 'react';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
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
  onExpand
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
      />

      {!isExpanded && <ExpandFileButton onExpandClick={onExpandClick} />}
      {isExpanded && <ExpandedFileHeader onClose={onExpandedFileClose} />}

      {mode === 'default' && !isExpanded && (
        <>
          <DefaultFileTitle file={file} />
          <DefaultFileActions
            file={file}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
          />
        </>
      )}
    </div>
  );
};

export default TxtPreview;
