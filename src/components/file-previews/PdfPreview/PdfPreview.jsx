import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import PdfSnapshotReader from '../components/PdfSnapshotReader/PdfSnapshotReader';
import styles from './PdfPreview.module.scss';

const PdfPreview = ({ file, fileContent }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSwipe = (deltaX) => {
    if (deltaX > 0 && pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    } else if (deltaX < 0 && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
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
        pageNumber={pageNumber}
      />

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
};

export default PdfPreview;
