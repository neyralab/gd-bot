import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useSwipeable } from 'react-swipeable';
import { gsap } from 'gsap';
import { startSpin } from '../../../effects/fortuneWheelEffect';
import BackgroundSvg from './BackgroundSvg';
import Confetti from '../../Confetti/Confetti';
import SystemModal from '../../SystemModal/SystemModal';
import styles from './FortuneWheel.module.scss';

const wheelDivisions = [
  { id: 1, points: 500 },
  { id: 2, points: 1000 },
  { id: 3, points: 500 },
  { id: 4, points: 5000 },
  { id: 5, points: 1000 },
  { id: 6, points: 2000 },
  { id: 7, points: 500 },
  { id: 8, points: 1000 }
];

export default function FortuneWheel({ spinId, onSpinned }) {
  const ts = useTranslation('system');
  const tg = useTranslation('game');

  const systemModalRef = useRef(null);
  const wheelRef = useRef(null);
  const spinIntervalId = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameIsFinished, setGameIsFinished] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  /** I need both useState and useRef
   * useState for classes/states update in the render view
   * but useRef is the only thing setInterval understands
   * otherwise it takes the value of reward that was defined on interval creation
   */
  const rewardRef = useRef(null);
  const [reward, setReward] = useState(null);

  const swipeHandlers = useSwipeable({
    onSwiped: () => {
      if (!isSpinning && !gameIsFinished) {
        startSpinHandler();
      }
    }
  });

  useEffect(() => {
    return () => {
      if (spinIntervalId.current) {
        clearInterval(spinIntervalId.current);
      }
    };
  }, []);

  const startSpinHandler = () => {
    window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');
    setIsSpinning(true);
    setGameIsFinished(false);
    setReward(null);
    rewardRef.current = null;
    runSpinAnimation1();

    startSpin(spinId)
      .then((res) => {
        setTimeout(() => getReward(res.points), 3000); // wait for the server response and run reward function
      })
      .catch((error) => {
        systemModalRef.current.open({
          title: ts.t('message.error'),
          text: error.response?.data?.errors || ts.t('message.serverError'),
          actions: [
            {
              type: 'default',
              text: ts.t('message.ok'),
              onClick: () => {
                systemModalRef.current.close();
              }
            }
          ]
        });
      });
  };

  const runSpinAnimation1 = () => {
    /** Animation that turns the wheel slightly back */
    gsap.to(wheelRef.current, {
      rotation: '-40',
      duration: 0.6,
      ease: 'power1.inOut',
      onComplete: runSpinAnimation2
    });
  };

  const runSpinAnimation2 = () => {
    /** Animation that increases speed of the wheel up to 1 turn */
    gsap.to(wheelRef.current, {
      rotation: '360',
      duration: 1.6,
      ease: 'power1.in',
      onComplete: runContinueSpinAnimation
    });
  };

  const runContinueSpinAnimation = () => {
    /** Linear animation that supposed to be repeated until we get a backend result */
    clearInterval(spinIntervalId.current);

    const rotate = () => {
      gsap.to(wheelRef.current, {
        rotation: '+=360',
        duration: 1,
        ease: 'none'
      });
    };

    spinIntervalId.current = setInterval(() => {
      if (rewardRef.current) {
        clearInterval(spinIntervalId.current);
        runStopAnimation();
      } else {
        rotate();
      }
    }, 1000);

    rotate();
  };

  const runStopAnimation = () => {
    /** Animation, that starts from 0 relative rotation point
     * goes some turns + additional degrees up to the division
     * that backend chose
     */
    if (!rewardRef.current) return;

    const rewardIndex = wheelDivisions.findIndex(
      (el) => el.id === rewardRef.current.id
    );
    const anglePerDivision = 360 / wheelDivisions.length;
    const finalAngle = 360 - rewardIndex * anglePerDivision;
    const turns = 1;
    const turnsInDeg = turns * 360;
    const totalRotation = turnsInDeg + finalAngle; // 2 full turns + additional rotation

    gsap.to(wheelRef.current, {
      rotation: `+=${totalRotation}`,
      duration: 4 * turns + 0.2 * rewardIndex,
      ease: 'back.out(0.5)',
      onComplete: () => {
        setIsSpinning(false);
        setGameIsFinished(true);
        setShowCongratulations(true);
        window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');
        setTimeout(() => {
          closeCongratulations();
        }, 4500);
      }
    });
  };

  const getReward = (points) => {
    // Filter the wheelDivisions array to get all entries with the matching points
    const matchingEntries = wheelDivisions.filter(
      (entry) => entry.points === points
    );
    // Randomly select one of the matching entries
    const randomIndex = Math.floor(Math.random() * matchingEntries.length);

    setReward(matchingEntries[randomIndex]);
    rewardRef.current = matchingEntries[randomIndex];
    console.log(matchingEntries[randomIndex]);
  };

  const closeCongratulations = () => {
    setShowCongratulations(false);
    onSpinned?.();
  };

  return (
    <>
      <div className={styles.container}>
        <div {...swipeHandlers} className={styles['inner-container']}>
          <div className={styles.wheel} ref={wheelRef}>
            <div className={styles['wheel-rotation-container']}>
              {wheelDivisions.map((el, i) => {
                const angle = i * (360 / wheelDivisions.length);
                return (
                  <div
                    key={el.id}
                    className={classNames(
                      styles.division,
                      gameIsFinished &&
                        reward &&
                        reward.id === el.id &&
                        styles.active
                    )}
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`
                    }}>
                    <div className={styles['division-inner-container']}>
                      <div className={styles.background}>
                        <BackgroundSvg
                          active={
                            gameIsFinished && reward && reward.id === el.id
                          }
                        />
                      </div>
                      <div className={styles.title}>
                        <img src="/assets/token.png" alt="Token" />
                        <span>{el.points}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className={styles['start-button']}
            onClick={startSpinHandler}
            disabled={isSpinning || gameIsFinished}>
            {tg.t('earn.spinWheel')}
          </button>
        </div>

        {showCongratulations && <Confetti onClick={closeCongratulations} />}
      </div>

      <SystemModal ref={systemModalRef} />
    </>
  );
}
