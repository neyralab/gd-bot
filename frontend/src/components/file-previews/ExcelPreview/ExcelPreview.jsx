import { useState } from 'react';
import DefaultModeFileUI from '../components/DefaultModeFileUI/DefaultModeFileUI';
import ExcelReader from '../components/ExcelReader/ExceReader';
import ExpandFileButton from '../components/ExpandFileButton/ExpandFileButton';
import ExpandedFileHeader from '../components/ExpandedFileHeader/ExpandedFileHeader';
import styles from './ExcelPreview.module.scss';

const ExcelPreview = ({
  mode = 'default',
  file,
  fileContent,
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
      <ExcelReader
        mode={isExpanded ? 'default' : 'simplified'}
        fileContent={fileContent}
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

export default ExcelPreview;
