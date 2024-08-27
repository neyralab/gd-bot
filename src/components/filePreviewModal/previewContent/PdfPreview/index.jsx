import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  useLayoutEffect(() => {
    if (fileContent && pdfPageHeight) {
      const elem = fileContentRef?.current;
      const handleScroll = (event) => {
        const scrollTop = event.srcElement.scrollTop;
        const nextPage = Math.round(
          (scrollTop - PDF_PAGE_OFFSET + pdfPageHeight) / pdfPageHeight
        );
        if (nextPage !== pageNumber && nextPage <= totalPages) {
          setPageNumber(nextPage);
        }
      };
      if (elem) {
        elem.addEventListener('scroll', handleScroll);
      }

      return () => {
        if (elem) {
          elem.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [pageNumber, totalPages, fileContent, pdfPageHeight]);

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
    <div ref={fileContentRef} className={s.wrapper}>
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
