import React, { useEffect, useState } from "react";

import { ReactComponent as GhostLogoLoader } from "./svg/ghost-logo-loader.svg";

import classNames from "classnames";
import s from "./ghostLoader.module.css";

export default function GhostLoader({ texts = [], flashing = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className={s.wrapper} key={texts[currentIndex]}>
      <GhostLogoLoader />
      {texts.length > 0 && (
        <div className={s.textWrapper}>
          <p
            className={classNames(s.textContent, {
              [s.textContent_isOnePhrase]: texts.length === 1,
            })}>
            {texts[currentIndex]}
          </p>
          {flashing && <span className={s.blinkingPipe}>|</span>}
        </div>
      )}
    </div>
  );
}
