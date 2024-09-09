import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import { gsap } from 'gsap';
import {
  setMediaSliderCurrentFile,
  setMediaSliderOpen
} from '../../../../../store/reducers/driveSlice';
import styles from './SlidesController.module.scss';

const Slide = React.memo(({ file, isLoading, id }) => {
  useEffect(() => {
    console.log('rerender', id);
  }, [id]);

  return (
    <div className={styles.slide}>
      {!isLoading && <p>{file?.name || 'none'}</p>}
      {isLoading && <div className={styles.loader}>Loading...</div>}
    </div>
  );
});

export default function SlidesController() {
  const dispatch = useDispatch();
  const mediaSlider = useSelector((state) => state.drive.mediaSlider);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const slidesRef = useRef(null);

  useEffect(() => {
    // Initialize slides with current, previous, and next files
    setSlides([
      {
        key: mediaSlider.previousFile?.id || 'top-null',
        file: mediaSlider.previousFile,
        isLoading: false
      },
      {
        key: mediaSlider.currentFile?.id || 'middle-null',
        file: mediaSlider.currentFile,
        isLoading: false
      },
      {
        key: mediaSlider.nextFile?.id || 'bottom-null',
        file: mediaSlider.nextFile,
        isLoading: false
      }
    ]);
  }, [mediaSlider.currentFile, mediaSlider.previousFile, mediaSlider.nextFile]);

  const fetchNextFile = async () => {
    setLoading(true);
    try {
      // Simulate an API request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Simulate a failed request
      throw new Error('Failed to fetch next file');
    } catch (error) {
      console.error(error);
      dispatch(setMediaSliderOpen(false));
      dispatch(setMediaSliderCurrentFile(null));
    } finally {
      setLoading(false);
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (mediaSlider.nextFile) {
        animateSlides('up');
      } else {
        fetchNextFile();
      }
    },
    onSwipedDown: () => {
      if (mediaSlider.previousFile) {
        animateSlides('down');
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const animateSlides = (direction) => {
    const container = slidesRef.current;

    if (direction === 'up') {
      gsap.to(container, {
        y: '-100vh',
        duration: 0.2,
        onComplete: () => {
          dispatch(setMediaSliderCurrentFile(mediaSlider.nextFile));
          gsap.set(container, { y: '0%' });
        }
      });
    } else if (direction === 'down') {
      gsap.to(container, {
        y: '100vh',
        duration: 0.2,
        onComplete: () => {
          dispatch(setMediaSliderCurrentFile(mediaSlider.previousFile));
          gsap.set(container, { y: '0%' });
        }
      });
    }
  };

  return (
    <div className={styles.container} {...handlers}>
      <div className={styles['slide-list']} ref={slidesRef}>
        {slides.map((el) => (
          <Slide
            key={el.key}
            file={el.file}
            isLoading={el.isLoading}
            id={el.key}
          />
        ))}
      </div>
    </div>
  );
}
