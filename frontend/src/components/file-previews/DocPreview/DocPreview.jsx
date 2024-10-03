import { useState } from 'react';
import DefaultModeFileUI from '../components/DefaultModeFileUI/DefaultModeFileUI';
import DocReader from '../components/DocReader/DocReader';
import ExpandFileButton from '../components/ExpandFileButton/ExpandFileButton';
import ExpandedFileHeader from '../components/ExpandedFileHeader/ExpandedFileHeader';
import styles from './DocPreview.module.scss';

const DocPreview = ({
  mode = 'default',
  file,
  fileContent,
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
      <DocReader
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

export default DocPreview;
