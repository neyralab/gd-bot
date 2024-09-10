import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import { gsap } from 'gsap';
import {
  assignFilesQueryData,
  getDriveFiles,
  setMediaSliderCurrentFile
} from '../../../../../store/reducers/driveSlice';
import Slide from '../Slide/Slide';
import styles from './SlidesController.module.scss';
import { useMediaSliderCache } from '../MediaSliderCache';

/**----------------------------
 * How this shit works
 * ----------------------------
 * ----------------------------
 * ----------------------------
 * We ALWAYS have 3 slides and NO MORE.
 * These slides take information from mediaSlider store data.
 * The top one and the bottom one can be null.
 * If the top one is null -> you are not able to slide to top.
 * If the bottom one is null -> system will check and try lazy loading -> block sliding or show loader (then update current and next slides).
 * If we have the next/prev slide, the animation will move the slider to the next/prev and then it SWAP the slides and move them at the center.
 * The current slide is always index 1, UNLESS it is not lazy loading loader slide.
 * The information about next and previous files is taken from files data,
 * THE SAME that FilesList uses. They are combined for the good.
 * React.memo on Slide component and keys ARE CRUSIAL. If you remove them, you will always reload the same component every time you swipe, causing rerender and refetching
 * */

export default function SlidesController() {
  const dispatch = useDispatch();
  const mediaSlider = useSelector((state) => state.drive.mediaSlider);
  const files = useSelector((state) => state.drive.files);
  const totalPages = useSelector((state) => state.drive.totalPages);
  const queryData = useSelector((state) => state.drive.filesQueryData);
  const areFilesLazyLoading = useSelector(
    (state) => state.drive.areFilesLazyLoading
  );
  const { clearCache } = useMediaSliderCache();
  const [slides, setSlides] = useState([]);
  const slidesRef = useRef(null);

  useEffect(() => {
    /** Yeah, it's better to be in the parent component (MediaSlider),
     * But you can't normally set a provider and consumer in the same component
     */
    return () => {
      clearCache();
    };
  }, []);

  useEffect(() => {
    setSlides([
      {
        key: mediaSlider.previousFile?.id || 'top-null',
        file: mediaSlider.previousFile
      },
      {
        key: mediaSlider.currentFile?.id || 'middle-null',
        file: mediaSlider.currentFile
      },
      {
        key: mediaSlider.nextFile?.id || 'bottom-null',
        file: mediaSlider.nextFile
      }
    ]);
  }, [mediaSlider.currentFile, mediaSlider.previousFile, mediaSlider.nextFile]);

  useEffect(() => {
    if (files.length && mediaSlider.currentFile && !mediaSlider.nextFile) {
      const currentFileIndex = files.findIndex(
        (el) => el.id === mediaSlider.currentFile.id
      );
      if (currentFileIndex > -1 && currentFileIndex + 1 < files.length) {
        dispatch(setMediaSliderCurrentFile(files[currentFileIndex + 1]));
      }
    }
  }, [files]);

  useEffect(() => {
    gsap.set(slidesRef.current, { y: '-100vh' });
  }, [slides]);

  const handlers = useSwipeable({
    onSwipedUp: () => {
      animateSlidesDown();
    },
    onSwipedDown: () => {
      animateSlidesUp();
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const animateSlidesDown = () => {
    if (mediaSlider.nextFile) {
      gsap.to(slidesRef.current, {
        y: '-200vh',
        duration: 0.2,
        onComplete: () => {
          dispatch(setMediaSliderCurrentFile(mediaSlider.nextFile));
        }
      });
    }

    if (!mediaSlider.nextFile) {
      gsap.to(slidesRef.current, {
        y: '-120vh',
        duration: 0.1,
        onComplete: () => {
          gsap.to(slidesRef.current, {
            y: '-100vh',
            duration: 0.1
          });
        }
      });

      if (queryData.page < totalPages && !areFilesLazyLoading) {
        let newPage = queryData.page + 1;
        dispatch(getDriveFiles({ mode: 'lazy-add', page: newPage }));
        dispatch(assignFilesQueryData({ filesQueryData: { page: newPage } }));
      }
    }
  };

  const animateSlidesUp = () => {
    if (mediaSlider.previousFile) {
      gsap.to(slidesRef.current, {
        y: '0vh',
        duration: 0.2,
        onComplete: () => {
          dispatch(setMediaSliderCurrentFile(mediaSlider.previousFile));
        }
      });
    }

    if (!mediaSlider.previousFile) {
      gsap.to(slidesRef.current, {
        y: '-80vh',
        duration: 0.1,
        onComplete: () => {
          gsap.to(slidesRef.current, {
            y: '-100vh',
            duration: 0.1
          });
        }
      });
    }
  };

  return (
    <div className={styles.container} {...handlers}>
      <div className={styles['slide-list']} ref={slidesRef}>
        {slides.map((el) => (
          <Slide key={el.key} file={el.file} id={el.key} />
        ))}
      </div>
    </div>
  );
}
