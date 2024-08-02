import React, { useState, useRef, useEffect } from 'react';

import CN from 'classnames';

import { ReactComponent as CopyIcon } from './assets/copy-button.svg';
import { ReactComponent as SuccessCycleIcon } from './assets/success-cycle.svg';

import s from './style.module.scss';

const CopyButton = ({
  className,
  copyIcon,
  onClick,
  timeDelay = 2000,
  ...restProps
}) => {
  const [isCopy, setCopy] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const onCopy = () => {
    setCopy(true);
    onClick();

    setTimeout(() => {
      setCopy(false);
    }, timeDelay);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={CN(s.copyButton, className)}
      {...restProps}>
      {isCopy ? <SuccessCycleIcon /> : copyIcon ? copyIcon : <CopyIcon />}
    </button>
  );
};

export default CopyButton;
