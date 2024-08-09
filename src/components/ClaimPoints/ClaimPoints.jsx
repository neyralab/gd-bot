import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import classNames from 'classnames';
import CountUp from 'react-countup';
import { gsap } from 'gsap';
import Wave from './Wave/Wave';
import Token from './Token/Token';
import { runFunctionNTimesWithDelay } from '../../utils/functions';
import styles from './ClaimPoints.module.scss';

const ClaimPoints = forwardRef((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [countUpIsFinished, setCountUpIsFinished] = useState(false);
  const [waves, setWaves] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [points, setPoints] = useState(0);
  const imgContainerRef = useRef(null);
  const timeout1Ref = useRef(null);
  const timeout2Ref = useRef(null);

  useImperativeHandle(ref, () => ({
    open(points) {
      setPoints(points);
      setIsOpen(true);
    },
    close() {
      runCloseAnimation();
    }
  }));

  useEffect(() => {
    if (!isOpen) {
      setWaves([]);
      setTokens([]);

      if (timeout1Ref.current) {
        clearTimeout(timeout1Ref.current);
      }
      if (timeout2Ref.current) {
        clearTimeout(timeout2Ref.current);
      }
    } else {
      setTimeout(() => {
        runFunctionNTimesWithDelay(runTokenAnimation, 10, 150);
      }, 500);
      setIsClosing(false);
      setCountUpIsFinished(false);
    }
  }, [isOpen]);

  const runPushAnimation = () => {
    gsap.fromTo(
      `.${styles['img-animation']}`,
      { scale: 1 },
      {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
      }
    );
  };

  const runWaveAnimation = () => {
    const waveId = Date.now();
    setWaves((prevWaves) => [...prevWaves, waveId]);
  };

  const removeWave = (id) => {
    setWaves((prevWaves) => prevWaves.filter((el) => el !== id));
  };

  const runTokenAnimation = () => {
    if (!imgContainerRef.current) return;
    window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');

    const tokenId = Date.now();

    const imgContainerRect = imgContainerRef.current.getBoundingClientRect();
    const targetPosition = {
      x: imgContainerRect.left + imgContainerRect.width / 2 - 15,
      y: imgContainerRect.top + imgContainerRect.height / 2 - 15
    };

    setTokens((prevTokens) => [...prevTokens, { id: tokenId, targetPosition }]);
  };

  const onTokenAnimationCompleted = (tokenId) => {
    runPushAnimation();
    runWaveAnimation();

    setTokens((prevTokens) => prevTokens.filter((el) => el.id !== tokenId));
  };

  const runCloseAnimation = () => {
    setIsClosing(true);
    timeout1Ref.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 500);
  };

  const countFinishedHandler = () => {
    setCountUpIsFinished(true);
    timeout2Ref.current = setTimeout(() => {
      runCloseAnimation();
    }, 3000);
  };

  if (!isOpen) return;

  return (
    <div
      onClick={runCloseAnimation}
      className={classNames(
        styles.container,
        isClosing ? styles.close : styles.appear,
        countUpIsFinished && styles['count-is-finished']
      )}>
      <div className={styles.backdrop}></div>

      <div className={styles['tokens-container']}>
        {tokens.map((token) => (
          <Token
            key={token.id}
            targetPosition={token.targetPosition}
            onComplete={() => onTokenAnimationCompleted(token.id)}
          />
        ))}
      </div>

      <div className={styles.modal}>
        <div className={styles['waves-container']}>
          {waves.map((waveId) => (
            <Wave key={waveId} onComplete={() => removeWave(waveId)} />
          ))}
        </div>

        <div className={styles['text-container']}>
          <strong>
            +
            <CountUp
              delay={0.5}
              end={points}
              duration={2.4}
              onEnd={countFinishedHandler}
            />
          </strong>
          <p>Points claimed</p>
        </div>

        <div className={styles['img-container']} ref={imgContainerRef}>
          <div className={styles['img-animation']}>
            <img src="/assets/token.png" alt="points" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ClaimPoints;
