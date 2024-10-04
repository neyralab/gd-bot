import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ReactComponent as GhostLogoLoader } from './svg/ghost-logo-loader.svg';
import s from './ghostLoader.module.css';

function GhostLoader({ texts = [], startup = false, uploadingFile, progress }) {
  const { t } = useTranslation('system');
  const [displayText, setDisplayText] = useState('');

  const currentTextRef = useRef('');
  const charIndexRef = useRef(0);
  const textIndexRef = useRef(0);
  const timeoutRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const throttledProgressRef = useRef(null);

  const uploadingProgress = useMemo(() => {
    if (uploadingFile) {
      const percentage = (progress / uploadingFile?.size) * 100;
      return `${t('loading.uploading')} ${Math.round(percentage)}%`;
    }
    return null;
  }, [progress, uploadingFile?.size, t]);

  // Throttle uploadingProgress updates
  useEffect(() => {
    const currentTime = Date.now();
    if (uploadingProgress && currentTime - lastUpdateTimeRef.current >= 2000) {
      throttledProgressRef.current = uploadingProgress;
      lastUpdateTimeRef.current = currentTime;
    }
  }, [uploadingProgress]);

  useEffect(() => {
    const allTexts = throttledProgressRef.current
      ? [throttledProgressRef.current]
      : texts;

    const animateText = () => {
      if (charIndexRef.current < currentTextRef.current.length) {
        setDisplayText(
          currentTextRef.current.slice(0, charIndexRef.current + 1)
        );
        charIndexRef.current++;
        timeoutRef.current = setTimeout(animateText, 50);
      } else {
        timeoutRef.current = setTimeout(() => {
          setDisplayText('');
          charIndexRef.current = 0;
          textIndexRef.current = (textIndexRef.current + 1) % allTexts.length;
          currentTextRef.current = allTexts[textIndexRef.current];
          animateText();
        }, 2000);
      }
    };

    if (allTexts.length > 0) {
      currentTextRef.current = allTexts[0];
      charIndexRef.current = 0;
      textIndexRef.current = 0;
      setDisplayText(currentTextRef.current[0] || '');
      animateText();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [texts, throttledProgressRef.current, t]);

  return (
    <div className={classNames(startup ? s.startupWrapper : s.wrapper)}>
      <GhostLogoLoader />
      {startup && (
        <p className={s.startup}>
          {t('loading.pleaseWait')}
          <br /> {t('loading.systemLoading')}
        </p>
      )}
      {(texts.length > 0 || throttledProgressRef.current) && (
        <div className={s.textWrapper}>
          <p className={classNames(s.textContent, s.typingText)}>
            {displayText}
            <span className={s.cursor}>|</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(GhostLoader);
