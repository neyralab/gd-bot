import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Loader2 from '../../../Loader2/Loader2';
import styles from './PdfSnapshotReader.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function PdfSnapshotReader({
  fileContent,
  pageNumber,
  onDocumentLoadSuccess
}) {
  const pdfRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: undefined,
    height: undefined
  });
  const [pageDimensions, setPageDimensions] = useState({
    width: 0,
    height: 0
  });

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

  return (
    <>
      <div onClick={clickHandler} className={styles['pdf-container']}>
        <Document
          file={fileContent}
          renderMode="canvas"
          inputRef={pdfRef}
          onLoadSuccess={onDocumentLoadSuccess}
          onItemClick={clickHandler}
          loading={<Loader2 />}>
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            width={dimensions.width}
            height={dimensions.height}
            className={styles.page}
            onLoadSuccess={onPageLoadSuccess}
            loading={<Loader2 />}
          />
        </Document>
      </div>

      <div className={styles['no-action-overlay']}></div>
    </>
  );
}
