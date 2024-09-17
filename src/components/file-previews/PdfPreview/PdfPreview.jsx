import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import PdfSnapshotReader from '../components/PdfSnapshotReader/PdfSnapshotReader';
import SliderDots from '../components/SliderDots/SliderDots';
import styles from './PdfPreview.module.scss';

const PdfPreview = ({
  mode = 'default',
  file,
  fileContent,
  onFavoriteClick,
  onInfoClick
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
  };

  const handleSwipe = (deltaX) => {
    if (deltaX > 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (deltaX < 0 && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(-1),
    onSwipedRight: () => handleSwipe(1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className={styles.container} {...handlers}>
      <PdfSnapshotReader
        fileContent={fileContent}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        pageNumber={currentPage}
      />

      {mode === 'default' && (
        <>
          <DefaultFileTitle file={file} />
          <DefaultFileActions
            file={file}
            onFavoriteClick={onFavoriteClick}
            onInfoClick={onInfoClick}
          />
        </>
      )}

      <SliderDots totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
};

export default PdfPreview;
