/* global BigInt */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useSwipeable } from 'react-swipeable';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBalance,
  selectSoundIsActive,
  selectStatus,
  selectTheme,
  setBalance,
  startRound,
  setStatus,
  setTheme,
  selectLockTimerTimestamp,
  setLockTimerTimestamp,
  setLockTimeoutId,
  setThemeAccess,
  selectThemeAccess,
  addExperience,
  setNextTheme,
  selectNextTheme
} from '../../store/reducers/gameSlice';
import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import Background from './Background/Background';
import BuyButton from './BuyButton/BuyButton';
import PointsGrowArea from './PointsGrowArea/PointsGrowArea';
import Timer from './Timer/Timer';
import Menu from '../../components/Menu/Menu';
import ProgressBar from './ProgressBar/ProgressBar';
import Congratulations from './Congratulations/Congratulations';
import themes from './themes';
import styles from './styles.module.css';

import { Address } from '@ton/core';
import { TonClient } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import {
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';
import { GDTapBooster } from '../../effects/contracts/tact_GDTapBooster';
import { nullValueCheck } from '../../effects/contracts/helper';
import {
  endGame,
  getGameContractAddress,
  getGamePlans,
  startGame
} from '../../effects/gameEffect';
import { useQueryId } from '../../effects/contracts/useQueryId';

export function GamePage() {
  const clickSoundRef = useRef(new Audio('/assets/game-page/2blick.wav'));

  const backgroundRef = useRef(null);
  const pointsAreaRef = useRef(null);
  const mainButtonRef = useRef(null);
  const currentThemeRef = useRef(null);
  const nextThemeRef = useRef(null);

  const dispatch = useDispatch();
  const soundIsActive = useSelector(selectSoundIsActive);
  const theme = useSelector(selectTheme);
  const themeAccess = useSelector(selectThemeAccess);
  const status = useSelector(selectStatus);
  const balance = useSelector(selectBalance);
  const lockTimerTimestamp = useSelector(selectLockTimerTimestamp);
  const nextTheme = useSelector(selectNextTheme);
  const [themeIndex, setThemeIndex] = useState([0]);
  const { open } = useTonConnectModal();
  const { queryId } = useQueryId();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [gamePlans, setGamePlans] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [gameId, setGameId] = useState();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (e) => {
      switchTheme(e, 'next');
    },
    onSwipedRight: (e) => {
      switchTheme(e, 'prev');
    }
  });

  useEffect(() => {
    (async () => {
      const cAddress = await getGameContractAddress();
      const { address } = Address.parseFriendly(cAddress);
      setContractAddress(address);

      const games = await getGamePlans();
      setGamePlans(games);
    })();
    return () => {
      clickSoundRef.current.pause();
      clickSoundRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    setThemeIndex(themes.findIndex((t) => t.id === theme.id) || 0);
  }, [theme]);

  const switchTheme = (e, direction) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (status === 'playing') return;

    let newThemeIndex;

    if (direction === 'next') {
      newThemeIndex = (themeIndex + 1) % themes.length;
      if (newThemeIndex >= themes.length || newThemeIndex <= 0) return;
    } else if (direction === 'prev') {
      newThemeIndex = (themeIndex - 1 + themes.length) % themes.length;
      if (newThemeIndex >= themes.length - 1 || newThemeIndex < 0) return;
    }

    const nextThemeStyle =
      direction === 'next'
        ? styles['next-theme-appear-right']
        : styles['next-theme-appear-left'];

    dispatch(setNextTheme(themes[newThemeIndex]));
    dispatch(setStatus('waiting'));

    currentThemeRef.current.classList.add(styles['current-theme-dissapear']);
    nextThemeRef.current.classList.add(nextThemeStyle);

    setTimeout(() => {
      dispatch(setTheme(themes[newThemeIndex]));
      dispatch(setNextTheme(null));

      currentThemeRef.current.classList.remove(
        styles['current-theme-dissapear']
      );
      nextThemeRef.current.classList.remove(nextThemeStyle);
    }, 500);
  };

  const onBuy = async (plan) => {
    try {
      if (!wallet) {
        return open();
      }
      if (!contractAddress && !plan) {
        return;
      }
      const endpoint = await getHttpEndpoint();
      const closedContract = new GDTapBooster(contractAddress);
      const client = new TonClient({ endpoint });
      const contract = client.open(closedContract);
      await contract.send(
        {
          send: async (args) => {
            const data = await tonConnectUI.sendTransaction({
              messages: [
                {
                  address: args.to.toString(),
                  amount: args.value.toString(),
                  payload: args.body?.toBoc().toString('base64')
                }
              ],
              validUntil: Date.now() + 60 * 1000 // 5 minutes for user to approve
            });
            console.log({ data });
            return data;
          }
        },
        { value: plan?.ton_price },
        {
          $$type: 'Boost',
          queryId,
          tierId: plan?.tierId
        }
      );

      const userAddress = Address.parseRaw(wallet.account.address);
      const purchaseId = await nullValueCheck(() => {
        return contract.getLatestPurchase(userAddress);
      });
      const game = await startGame(Number(purchaseId));
      setGameId(game?.id);
      console.log({ PPPPP: purchaseId, game });
      return true;
    } catch (e) {
      console.log({ onBuyError: e });
      return false;
    }
  };

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!themeAccess[theme.id]) {
      return;
    }

    if (status === 'waiting') {
      dispatch(startRound());
    }

    if (status === 'finished') {
      return;
    }

    // Run animations
    mainButtonRef.current.runAnimation();
    backgroundRef.current.runAnimation();
    pointsAreaRef.current.runAnimation();

    // Run sounds
    if (clickSoundRef.current && !clickSoundRef.current.ended) {
      clickSoundRef.current.pause();
      clickSoundRef.current.currentTime = 0;
    }

    if (soundIsActive) {
      setTimeout(() => {
        const playPromise = clickSoundRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn('Autoplay was prevented:', e);
          });
        }
      }, 0);
    }

    // Update state and timers
    dispatch(addExperience());
    dispatch(setBalance(balance + theme.multiplier));
  };

  const buyCompletedHandler = async () => {
    const plan = gamePlans?.find((el) => el.multiplier === theme.multiplier);
    console.log({ theme, plan, gamePlans });
    const bought = await onBuy(plan);
    dispatch(setStatus('waiting'));
    dispatch(setThemeAccess({ themeId: theme.id, status: true }));

    if (theme.id === 'hawk') {
      dispatch(setLockTimerTimestamp(null));
      dispatch(setLockTimeoutId(null));
    }
  };

  const conditionalSwipeHandlers = status !== 'playing' ? swipeHandlers : {}; // just in case we swipe will affect click.

  useEffect(() => {
    if (gameId && status === 'finished') {
      (async () => {
        await endGame({ id: gameId, taps: balance });
      })();
    }
  }, [gameId, status, balance]);

  return (
    <div className={classNames(styles.container, theme && styles[theme.id])}>
      <Background ref={backgroundRef} theme={theme} />
      <Header />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <div className={styles.balance}>
              {balance.toLocaleString('en-US')}
            </div>
          </div>

          <div
            {...conditionalSwipeHandlers}
            onClick={clickHandler}
            className={styles['main-button-container']}>
            <div className={styles['points-grow-area-container']}>
              <PointsGrowArea ref={pointsAreaRef} theme={theme} />
            </div>

            <div className={styles['main-button-inner-container']}>
              <div ref={currentThemeRef} className={styles['current-theme']}>
                <MainButton ref={mainButtonRef} theme={theme} />
              </div>

              <div ref={nextThemeRef} className={styles['next-theme']}>
                {nextTheme && <MainButton theme={nextTheme} />}
              </div>
            </div>

            <div className={styles['timer-container']}>
              <Timer />

              {(status === 'finished' || status === 'waiting') &&
                lockTimerTimestamp &&
                theme.id === 'hawk' && (
                  <span className={styles['timer-description']}>
                    Next free play
                  </span>
                )}
            </div>

            <div className={styles.description}>
              <strong>{theme.name}</strong>
              <span>X{theme.multiplier}</span>
            </div>

            {status !== 'playing' && (
              <div className={styles.arrows}>
                {themeIndex !== 0 && (
                  <div
                    className={styles.prev}
                    onClick={(e) => switchTheme(e, 'prev')}>
                    {'<'}
                  </div>
                )}

                {themeIndex !== themes.length - 1 && (
                  <div
                    className={styles.next}
                    onClick={(e) => switchTheme(e, 'next')}>
                    {'>'}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles['actions-container']}>
            {status !== 'played' && !themeAccess[theme.id] && (
              <div className={styles['actions-flex']}>
                <BuyButton theme={theme} onCompleted={buyCompletedHandler} />
                <span className={styles['actions-description']}>
                  recharge & play
                </span>
              </div>
            )}
          </div>

          <div className={styles['experience-container']}>
            <ProgressBar />
          </div>
        </div>
      </div>

      <Menu />

      <Congratulations />
    </div>
  );
}
