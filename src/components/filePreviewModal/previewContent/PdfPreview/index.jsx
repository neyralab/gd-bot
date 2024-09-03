import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import s from './style.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PDF_PAGE_OFFSET = 140;

const PdfPreview = ({ fileContent }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageWidth, setPageWidth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfPageHeight, setPdfPageHeight] = useState(null);
  const fileContentRef = useRef(null);
  const pdfRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
    setLoading(false);
  }

  useEffect(() => {
    if (fileContent && !loading) {
      setTimeout(() => {
        const pdfPage = document.getElementsByClassName(
          'react-pdf__Page__canvas'
        );
        const additional = totalPages === 2 ? 300 : 0;
        setPdfPageHeight(pdfPage[0]?.offsetHeight - additional);
      }, 500);
    }
  }, [fileContent, loading]);

  const handleScroll = useCallback(
    (event) => {
      if (fileContent && pdfPageHeight) {
        const scrollTop = event.target.scrollTop;
        const nextPage = Math.round(
          (scrollTop - PDF_PAGE_OFFSET + pdfPageHeight) / pdfPageHeight
        );
        if (nextPage !== pageNumber && nextPage <= totalPages) {
          setPageNumber(nextPage);
        }
      }
    },
    [fileContent, pdfPageHeight, pageNumber, totalPages]
  );

  useEffect(() => {
    const updatePageWidth = () => {
      if (fileContentRef.current) {
        setPageWidth(window.innerWidth);
      }
    };

    window.addEventListener('resize', updatePageWidth);
    updatePageWidth();

    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  return (
    <div ref={fileContentRef} className={s.wrapper} onScroll={handleScroll}>
      <Document
        file={fileContent}
        onLoadSuccess={onDocumentLoadSuccess}
        renderMode="canvas"
        inputRef={pdfRef}>
        {Array.from(Array(totalPages).keys()).map((item) => (
          <Page
            pageNumber={item + 1}
            key={`pdf-page-number-${item}`}
            width={pageWidth}
            renderTextLayer={false}
            className={s.sheet}
          />
        ))}
      </Document>
      <div className={s.page}>
        Page {pageNumber} of {totalPages}
      </div>
    </div>
  );
};

export default PdfPreview;
