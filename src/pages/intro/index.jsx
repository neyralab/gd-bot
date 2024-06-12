import Wave from 'react-wavify';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ReactComponent as LogoIcon } from '../../assets/intro/logo.svg';
import { ReactComponent as UploadIcon } from '../../assets/intro/upload.svg';
import { ReactComponent as CoinIcon } from '../../assets/intro/coin.svg';
import { ReactComponent as AirdropIcon } from '../../assets/intro/airdrop.svg';

import s from './styles.module.css';

const info = [
  {
    icon: <UploadIcon />,
    title: 'Upload Files',
    text: 'Enjoy seamless integration with the Filecoin network.',
    opacity: 0
  },
  {
    icon: <CoinIcon />,
    title: 'Get Rewarded',
    text: 'Earn points and upgrade your account to boost your rewards.',
    opacity: 0
  },
  {
    icon: <AirdropIcon />,
    title: '$6 Million Airdrop',
    text: 'Open to all! Participate in tapping games and our referral program.',
    opacity: 0
  }
];

export const IntroPage = () => {
  const logoRef = useRef(null);
  const infoRef = useRef(null);
  const [list, setList] = useState(info);
  const [isInfoShown, setIsInfoShown] = useState(false);
  const [isJoinShown, setIsJoinShown] = useState(false);
  const [paused, setPaused] = useState(false);
  const [realPaused, setRealPaused] = useState(false);
  const navigate = useNavigate();

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

  const onJoinShown = useCallback(() => {
    setIsJoinShown(true);
  }, []);

  const onStart = useCallback(() => {
    navigate('/start');
  }, []);

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
            <span className={s.title_ghost}>Ghostdrive</span>
            <span className={s.number}> #1</span>
            <br /> Telegram Web3 Drive!
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
          <p
            onTransitionEnd={onJoinShown}
            style={{ opacity: isInfoShown ? 1 : 0 }}
            className={s.join}>
            Join community today and start earning!
          </p>
          <button
            style={{
              fontSize: isJoinShown ? 18 : 0,
              opacity: isJoinShown ? 1 : 0.25,
              visibility: isJoinShown ? 'visible' : 'hidden',
              width: isJoinShown ? '100%' : 0 /* Expand to full width */
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