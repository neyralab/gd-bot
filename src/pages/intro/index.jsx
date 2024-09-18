import Wave from 'react-wavify';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ReactComponent as LogoIcon } from '../../assets/intro/logo.svg';
import { ReactComponent as UploadIcon } from '../../assets/intro/upload.svg';
import { ReactComponent as PlayIcon } from '../../assets/intro/play.svg';
import { ReactComponent as AirdropIcon } from '../../assets/intro/airdrop.svg';

import s from './styles.module.css';
import { vibrate } from '../../utils/vibration';

const info = [
  {
    icon: <UploadIcon />,
    title: 'Upload for Airdrop',
    text: 'Upload files directly to Filecoin, share content with friends, and earn rewards!',
    opacity: 0
  },
  {
    icon: <PlayIcon />,
    title: 'Play for Airdrop',
    text: 'Earn points by playing the tap game and get free storage.',
    opacity: 0
  },
  {
    icon: <AirdropIcon />,
    title: 'Mega Bonus',
    text: 'Participate in tapping games will receive in exchange GD Tokens',
    opacity: 0
  }
];

const DEFAULT_NAME = 'intro';

export const IntroPage = () => {
  const logoRef = useRef(null);
  const infoRef = useRef(null);
  const [list, setList] = useState(info);
  const [isInfoShown, setIsInfoShown] = useState(false);
  const [paused, setPaused] = useState(false);
  const [realPaused, setRealPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoadedBefore = localStorage.getItem(DEFAULT_NAME);
    if (isLoadedBefore) {
      navigate('/start');
    }
  }, [navigate]);

  useEffect(() => {
    if (infoRef.current) {
      infoRef.current?.addEventListener('transitionend', () =>
        setIsInfoShown(true)
      );
    }

    // Cleanup event listener on component unmount
    return () => {
      if (infoRef.current) {
        infoRef.current?.removeEventListener('transitionend');
      }
    };
  }, []);

  const onLogoShown = useCallback(() => {
    setPaused(true);
    setTimeout(() => {
      setRealPaused(true);
    }, 1500);

    list.forEach(
      (item, index) =>
        setTimeout(() => {
          setList((prevItems) =>
            prevItems.map((prevItem, prevIndex) =>
              prevIndex === index ? { ...prevItem, opacity: 1 } : prevItem
            )
          );
        }, index * 1000) // Stagger the animation by 100ms for each item
    );
  }, [list]);

  const onStart = () => {
    vibrate();
    localStorage.setItem(DEFAULT_NAME, true.toString());
    navigate('/start');
  };

  return (
    <div className={s.background}>
      <div className={s.max}>
        <div onAnimationEnd={onLogoShown} ref={logoRef} className={s.slide_up}>
          <div className={s.logo}>
            <LogoIcon />
            <Wave
              fill="#007DE9"
              paused={realPaused}
              className={s.wave}
              options={{
                height: 1,
                amplitude: paused ? 5 : 50,
                speed: paused ? 1 : 0.25,
                points: 2
              }}
            />
            <Wave
              fill="#1A5EA2"
              paused={realPaused}
              className={s.wave}
              style={{ zIndex: -3 }}
              options={{
                height: 15,
                amplitude: 15,
                speed: 0.25,
                points: 1
              }}
            />
          </div>
          <h2 className={s.title}>
            <span className={s.title_ghost}>Ghost Drive</span>
            <p className={s.title_desc}>
              The Unlimited Drive for the Ton Ecosystem
            </p>
          </h2>
        </div>
        <div className={s.info}>
          {list.map((el, index) => (
            <div
              ref={infoRef}
              key={index}
              className={s.info_block}
              style={{ opacity: el.opacity }}>
              <div className={s.info_icon}>{el.icon}</div>
              <div>
                <h3 className={s.info_title}>{el.title}</h3>
                <p className={s.info_text}>{el.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={s.bottom}>
          {/*<p*/}
          {/*  onTransitionEnd={onJoinShown}*/}
          {/*  style={{ opacity: isInfoShown ? 1 : 0 }}*/}
          {/*  className={s.join}>*/}
          {/*  $6M Airdrop Giveaway*/}
          {/*</p>*/}
          <button
            style={{
              fontSize: isInfoShown ? 18 : 0,
              opacity: isInfoShown ? 1 : 0.25,
              visibility: isInfoShown ? 'visible' : 'hidden',
              width: isInfoShown ? '100%' : 0 /* Expand to full width */
            }}
            onClick={onStart}
            className={s.start_button}>
            Start now
          </button>
        </div>
      </div>
    </div>
  );
};
