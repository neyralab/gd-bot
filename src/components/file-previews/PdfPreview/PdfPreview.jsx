import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useSwipeable } from 'react-swipeable';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import DefaultFileTitle from '../components/DefaultFileTitle/DefaultFileTitle';
import DefaultFileActions from '../components/DefaultFileActions/DefaultFileActions';
import styles from './PdfPreview.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PdfPreview = ({ file, fileContent }) => {
  const pdfRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: undefined,
    height: undefined
  });
  const [pageDimensions, setPageDimensions] = useState({
    width: 0,
    height: 0
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (pageDimensions.width && pageDimensions.height) {
      updateDimensions();
    }
  }, [pageDimensions]);

  const updateDimensions = () => {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    let width;
    let height;

    if (containerWidth > containerHeight) {
      // Horizontal view
      height = containerHeight;
      width = undefined;
    } else if (containerWidth < containerHeight) {
      // Vertical view
      width = containerWidth;
      height = undefined;
    } else {
      // Square view
      width = containerWidth;
      height = undefined;
    }

    setDimensions({ width, height });
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (page) => {
    const { width, height } = page.originalWidth
      ? page
      : page.getViewport({ scale: 1 });
    setPageDimensions({ width, height });
  };

  const clickHandler = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
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
      <div onClick={clickHandler} className={styles['pdf-container']}>
        <Document
          file={fileContent}
          renderMode="canvas"
          inputRef={pdfRef}
          onLoadSuccess={onDocumentLoadSuccess}
          onItemClick={clickHandler}>
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            width={dimensions.width}
            height={dimensions.height}
            onLoadSuccess={onPageLoadSuccess}
          />
        </Document>
      </div>

      <div className={styles['non-action-overlay']}></div>

      <DefaultFileTitle file={file} />
      <DefaultFileActions file={file} />
    </div>
  );
};

export default PdfPreview;
