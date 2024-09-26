import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useSwipeable } from 'react-swipeable';
import gsap from 'gsap';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Loader2 from '../../../Loader2/Loader2';
import SliderDots from '../SliderDots/SliderDots';
import styles from './PdfSliderReader.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function PdfSliderReader({ fileContent, onFileReadError }) {
  const pdfRef = useRef(null);
  const pagesRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState([
    null,
    { pageNumber: 1, dimensions: null },
    null
  ]);
  const [animating, setAnimating] = useState(false);

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
    if (animating) {
      animatePageChange();
    }
  }, [animating]);

  useEffect(() => {
    if (pagesRef.current) {
      gsap.set(pagesRef.current, { x: '-100vw' });
    }
  }, [pages]);

  const handleSwipe = (deltaX) => {
    if (animating) return;

    if (deltaX > 0 && pages[1].pageNumber > 1) {
      setAnimating('left');
    } else if (deltaX < 0 && pages[1].pageNumber < totalPages) {
      setAnimating('right');
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(-1),
    onSwipedRight: () => handleSwipe(1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

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

    setPages((prevPages) =>
      prevPages.map((page) =>
        page ? { ...page, dimensions: { width, height } } : page
      )
    );
  };

  const onPageLoadSuccess = () => {
    updateDimensions();
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
  };

  const clickHandler = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
  };

  const animatePageChange = () => {
    const containerElement = pagesRef.current;

    gsap.to(containerElement, {
      x: animating === 'right' ? '-200vw' : '0vw',
      duration: 0.2,
      onComplete: () => {
        if (animating === 'right') {
          setPages([
            pages[1],
            pages[2]
              ? pages[2]
              : { pageNumber: pages[1].pageNumber + 1, dimensions: null },
            pages[1].pageNumber < totalPages - 1
              ? { pageNumber: pages[1].pageNumber + 2, dimensions: null }
              : null
          ]);
        }

        if (animating === 'left') {
          setPages([
            pages[1].pageNumber > 2
              ? { pageNumber: pages[1].pageNumber - 2, dimensions: null }
              : null,
            pages[0]
              ? pages[0]
              : { pageNumber: pages[1].pageNumber - 1, dimensions: null },
            pages[1]
          ]);
        }

        setAnimating(null);
      }
    });
  };

  return (
    <>
      <div className={styles['pdf-container']} ref={pdfRef} {...handlers}>
        <Document
          file={fileContent}
          renderMode="canvas"
          inputRef={pdfRef}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onFileReadError}
          onItemClick={clickHandler}
          loading={
            <div className={styles['initial-loader-container']}>
              <Loader2 />
            </div>
          }>
          <div ref={pagesRef} className={styles.pages}>
            {pages.map((page, index) =>
              page ? (
                <div
                  data-page={page.pageNumber}
                  key={`pdf-page-number-${page.pageNumber}`}
                  className={styles['page-wrapper']}>
                  <Page
                    pageNumber={page.pageNumber}
                    key={`pdf-page-number-${page.pageNumber}`}
                    renderTextLayer={false}
                    width={page.dimensions?.width}
                    height={page.dimensions?.height}
                    className={styles.page}
                    onLoadSuccess={onPageLoadSuccess}
                    loading={<Loader2 />}
                  />
                </div>
              ) : (
                <div
                  data-page={null}
                  key={`pdf-page-number-${index}-${null}`}
                  className={styles['page-wrapper']}></div>
              )
            )}
          </div>
        </Document>
      </div>

      <SliderDots totalPages={totalPages} currentPage={pages[1]?.pageNumber} />
    </>
  );
}
