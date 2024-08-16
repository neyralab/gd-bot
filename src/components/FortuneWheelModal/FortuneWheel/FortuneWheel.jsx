import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useSwipeable } from 'react-swipeable';
import { gsap } from 'gsap';
import { startSpin } from '../../../effects/fortuneWheelEffect';
import BackgroundSvg from './BackgroundSvg';
import Congratulations from '../Congratulations/Congratulations';
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
  const { t } = useTranslation('system');

  const systemModalRef = useRef(null);
  const wheelRef = useRef(null);
  const speedRef = useRef(0);
  const angleRef = useRef(0);
  const spinEffectAnimationFrameId = useRef(null);
  const checkAngleAnimationFrameId = useRef(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [reward, setReward] = useState(null);
  const [gameIsFinished, setGameIsFinished] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwiped: () => {
      if (!isSpinning && !gameIsFinished) {
        startSpinHandler();
      }
    }
  });

  useEffect(() => {
    /** This is a Spin Effect
     * ---------------------
     * It checks the current speed and rotate the wheel based on the speed.
     * Turn this effect off if you need to change the wheel's position based on time/data, not speed
     */
    const rotateWheel = () => {
      const speedAngleMultiplier = 4;
      if (angleRef.current !== null) {
        angleRef.current += speedRef.current * speedAngleMultiplier;
      }
      if (wheelRef.current !== null) {
        wheelRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }
      spinEffectAnimationFrameId.current = requestAnimationFrame(rotateWheel);
    };

    rotateWheel();

    return () => {
      if (spinEffectAnimationFrameId.current) {
        cancelAnimationFrame(spinEffectAnimationFrameId.current);
      }
      if (checkAngleAnimationFrameId.current) {
        cancelAnimationFrame(checkAngleAnimationFrameId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (reward) {
      checkAngleAndStop();
    }
  }, [reward]);

  const startSpinHandler = () => {
    window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');
    setIsSpinning(true);
    setGameIsFinished(false);
    setReward(null);
    runSpinAnimation1();
    
    startSpin(spinId)
      .then((res) => {
        setTimeout(() => getReward(res.points), 3000); // wait for the server response and run reward function
      })
      .catch((error) => {
        systemModalRef.current.open({
          title: t('message.error'),
          text: error.response?.data?.errors || t('message.serverError'),
          actions: [
            {
              type: 'default',
              text: t('message.ok'),
              onClick: () => {
                systemModalRef.current.close();
              }
            }
          ]
        });
      });
  };

  const runSpinAnimation1 = () => {
    gsap.to(speedRef, {
      current: -0.2,
      duration: 0.6,
      ease: 'power1.inOut',
      onUpdate: () => {
        speedRef.current = gsap.getProperty(speedRef, 'current');
      },
      onComplete: runSpinAnimation2
    });
  };

  const runSpinAnimation2 = () => {
    gsap.to(speedRef, {
      current: 1,
      duration: 0.4,
      ease: 'power1.in',
      onUpdate: () => {
        speedRef.current = gsap.getProperty(speedRef, 'current');
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

    setReward(wheelDivisions[randomIndex]);
    console.log(wheelDivisions[randomIndex]);
    checkAngleAndStop(randomIndex);
  };

  const checkAngleAndStop = () => {
    /** It's difficult, but let me explain.
     *
     * When we need to stop the wheel,
     * this function checks the angle of the wheel.
     * It will run the stop animation when the reward element hits the 0 point.
     *
     * So we get the reward. Let it be reward with id 4.
     * Then this function checks if id 4 hits the 0 degree,
     * then it runs the funtion that will decrease the speed for some time
     * aka stops the wheel
     */
    if (!reward) return;
    const rewardIndex = wheelDivisions.findIndex((el) => el.id === reward.id);
    const anglePerDivision = 360 / wheelDivisions.length;
    const finalAngle = 360 - rewardIndex * anglePerDivision;
    const targetAngle = finalAngle % 360;

    const checkAngle = () => {
      const currentRotation = angleRef.current % 360;
      const angleDifference = (targetAngle - currentRotation + 360) % 360;

      if (angleDifference < 5) {
        runStopAnimation();
      } else {
        checkAngleAnimationFrameId.current = requestAnimationFrame(checkAngle);
      }
    };

    checkAngle();
  };

  const runStopAnimation = () => {
    if (checkAngleAnimationFrameId.current) {
      cancelAnimationFrame(checkAngleAnimationFrameId.current);
    }

    gsap.to(speedRef, {
      current: 0,
      duration: 3.025, // One of Vadym's favourite magic numbers :D
      ease: 'back.out(0.5)',
      onUpdate: () => {
        speedRef.current = gsap.getProperty(speedRef, 'current');
      },
      onComplete: () => {
        setIsSpinning(false);
        setGameIsFinished(true);
        setShowCongratulations(true);
        window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');
        setTimeout(() => {
          closeCongratulations();
        }, 4000);
      }
    });
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
            Spin
          </button>
        </div>

        {showCongratulations && (
          <Congratulations onClick={closeCongratulations} />
        )}
      </div>

      <SystemModal ref={systemModalRef} />
    </>
  );
}
