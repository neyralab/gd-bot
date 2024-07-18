import React, { memo, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectUploadingProgress } from '../../store/reducers/filesSlice';

import { ReactComponent as GhostLogoLoader } from './svg/ghost-logo-loader.svg';

import classNames from 'classnames';
import s from './ghostLoader.module.css';

function GhostLoader({ texts = [], flashing = true, startup = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { progress, file: uploadingFile } = useSelector(
    selectUploadingProgress
  );

  const uploadingProgress = useMemo(() => {
    if (uploadingFile) {
      const percentage = (progress / uploadingFile?.size) * 100;
      return `${Math.round(percentage)}%`;
    } else {
      return null;
    }
  }, [progress, uploadingFile?.size]);

  useEffect(() => {
    if (texts.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [texts]);

  return (
    <div
      className={classNames(startup ? s.startupWrapper : s.wrapper)}
      key={texts[currentIndex]}>
      <GhostLogoLoader />
      {startup && (
        <p className={s.startup}>
          Please wait
          <br /> the system is loading...
        </p>
      )}
      {texts.length > 0 && !uploadingProgress && (
        <div className={s.textWrapper}>
          <p className={s.textContent}>{texts[currentIndex]}</p>
        </div>
      )}
      {uploadingProgress && (
        <div className={s.textWrapper}>
          <p className={classNames(s.textContent, s.infiniteTyping)}>
            {`Uploading: ${uploadingProgress}`}
          </p>
          {flashing && <span className={s.blinkingPipe}>|</span>}
        </div>
      )}
    </div>
  );
}

export default memo(GhostLoader);
