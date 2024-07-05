/* global BigInt */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
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
  selectNextTheme,
  setExperiencePoints,
  setLevels,
  selectExperienceLevel
} from '../../store/reducers/gameSlice';
import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import Background from './Background/Background';
import BuyButton from './BuyButton/BuyButton';
import TempUpdate from './TempUpdate/TempUpdate';
import PointsGrowArea from './PointsGrowArea/PointsGrowArea';
import Timer from './Timer/Timer';
import Menu from '../../components/Menu/Menu';
import ProgressBar from './ProgressBar/ProgressBar';
import Congratulations from './Congratulations/Congratulations';
import GhostLoader from '../../components/ghostLoader';
import defaultThemes from './themes';
import styles from './styles.module.css';
import { Address, toNano } from '@ton/core';
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
  gameLevels,
  getGameContractAddress,
  getGameInfo,
  getGamePlans,
  startGame
} from '../../effects/gameEffect';
import { useQueryId } from '../../effects/contracts/useQueryId';
import { setUser } from '../../store/reducers/userSlice';
import Counter from './Counter/Counter';

export function GamePage() {
  const clickSoundRef = useRef(new Audio('/assets/game-page/2blick.wav'));

  const backgroundRef = useRef(null);
  const pointsAreaRef = useRef(null);
  const mainButtonRef = useRef(null);
  const currentThemeRef = useRef(null);
  const nextThemeRef = useRef(null);
  const counterRef = useRef(null);

  const dispatch = useDispatch();
  const soundIsActive = useSelector(selectSoundIsActive);
  const theme = useSelector(selectTheme);
  const level = useSelector(selectExperienceLevel);
  const themeAccess = useSelector(selectThemeAccess);
  const status = useSelector(selectStatus, (prev, next) => prev === next);
  const balance = useSelector(selectBalance);
  const lockTimerTimestamp = useSelector(selectLockTimerTimestamp);
  const nextTheme = useSelector(selectNextTheme);
  const user = useSelector((state) => state?.user?.data);
  const [themeIndex, setThemeIndex] = useState([0]);
  const { open } = useTonConnectModal();
  const { queryId } = useQueryId();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [gamePlans, setGamePlans] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [gameId, setGameId] = useState();
  const [loading, setLoading] = useState(true);
  const [themes, setThemes] = useState([]);
  const [counterIsFinished, setCounterIsFinished] = useState(true);
  const [tempPreview, setTempPreview] = useState(0);

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
      const levels = await gameLevels();
      dispatch(setLevels(levels));
      const gameInfo = await getGameInfo();
      dispatch(setBalance({ label: gameInfo.points, value: 0 }));
      dispatch(setExperiencePoints(gameInfo.points));
      const now = Date.now();
      if (now <= gameInfo.game_ends_at) {
        dispatch(setLockTimerTimestamp(gameInfo.game_ends_at));
        dispatch(setStatus('finished'));
      } else {
        dispatch(setStatus('waiting'));
      }
      console.log({ gameInfo });

      const cAddress = await getGameContractAddress();
      const { address } = Address.parseFriendly(cAddress);
      setContractAddress(address);

      const games = await getGamePlans();
      setGamePlans(games);
      const newThemes = defaultThemes.map((theme) => {
        const { ton_price, tierIdBN, tierId, ...findGame } = games.find(
          (game) => game.multiplier === theme.multiplier
        );
        return findGame ? { ...findGame, ...theme } : theme;
      });
      setThemes(newThemes);
      dispatch(setTheme(newThemes.at(0)));
      console.log({ newThemes });
      setLoading(false);
    })();
    return () => {
      clickSoundRef.current.pause();
      clickSoundRef.current.currentTime = 0;
    };
  }, [dispatch]);

  useEffect(() => {
    setThemeIndex(themes.findIndex((t) => t.id === theme.id) || 0);
  }, [theme, themes]);

  const switchTheme = useCallback(
    (e, direction) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();

      if (status === 'playing') return;
      if (!counterIsFinished) return;

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
      // dispatch(setStatus('waiting'));

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
    },
    [dispatch, status, themeIndex, themes, counterIsFinished]
  );

  const onBuy = useCallback(
    async (plan) => {
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
          { value: plan?.ton_price || toNano(0.01) },
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
    },
    [contractAddress, open, queryId, tonConnectUI, wallet]
  );

  const clickHandler = useCallback(
    async (e) => {
      e?.preventDefault();
      e?.stopPropagation();

      if (!counterIsFinished) {
        return;
      }

      if (!themeAccess[theme.id]) {
        return;
      }

      if (status === 'waiting') {
        dispatch(startRound());
        if (theme.multiplier === 1) {
          const game = await startGame(null);
          setGameId(game?.id);
        }
      }

      if (status === 'finished') {
        return;
      }
      window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');

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
      dispatch(
        setBalance({
          label: balance.label + 1,
          value: balance.value + 1
        })
      );
    },
    [
      balance.label,
      balance.value,
      dispatch,
      soundIsActive,
      status,
      theme.id,
      theme.multiplier,
      themeAccess,
      counterIsFinished
    ]
  );

  const handleEvent = useCallback(
    async (event) => {
      if (event.type.startsWith('touch')) {
        const touches = event.changedTouches;
        for (let i = 0; i < touches.length; i++) {
          await clickHandler(event);
        }
      } else {
        await clickHandler(event);
      }
    },
    [clickHandler]
  );

  const onCloseTempPreview = useCallback(() => {
    setTempPreview(0)
  }, [])

  const buyCompletedHandler = useCallback(async () => {
    const plan = gamePlans?.find((el) => el.multiplier === theme.multiplier);
    console.log({ theme, plan, gamePlans });
    const bought = await onBuy(plan);
    if (!bought) {
      return;
    }
    dispatch(setStatus('waiting'));
    dispatch(setThemeAccess({ themeId: theme.id, status: true }));

    if (theme.id === 'hawk') {
      dispatch(setLockTimerTimestamp(null));
      dispatch(setLockTimeoutId(null));
    }

    setCounterIsFinished(false);
    counterRef.current.start(5);
  }, [dispatch, gamePlans, onBuy, theme]);

  const counterFinishedHandler = async () => {
    setCounterIsFinished(true);
    dispatch(startRound());
    if (theme.multiplier === 1) {
      const game = await startGame(null);
      setGameId(game?.id);
    }
  };

  const conditionalSwipeHandlers = useMemo(() => {
    return status !== 'playing' ? swipeHandlers : {}; // just in case we swipe will affect click.
  }, [status, swipeHandlers]);

  const saveGame = useCallback(() => {
    setGameId(undefined);
    endGame({ id: gameId, taps: balance.value })
      .then((data) => {
        setTempPreview(balance.value);
        dispatch(setUser({ ...user, points: data?.data || 0 }));
        dispatch(setBalance({ value: 0, label: balance.label }));
      })
      .catch((err) => {
        alert(JSON.stringify(err?.response.data) || 'Something went wrong!');
        console.log({ endGameErr: err, m: err?.response.data });
      });
  }, [balance.label, balance.value, dispatch, gameId, user]);

  useEffect(() => {
    if (gameId && status === 'finished') {
      saveGame();
    }
  }, [gameId, status, saveGame]);

  // useOnLocationChange(() => {
  //   if (gameId && status === 'playing') {
  //     saveGame();
  //   }
  // });

  const drawTimerDescription = useMemo(() => {
    if (
      (status === 'finished' || status === 'waiting') &&
      lockTimerTimestamp &&
      theme.id === 'hawk'
    ) {
      return (
        <span className={styles['timer-description']}>Next free play</span>
      );
    } else if (themeAccess[theme.id] && !lockTimerTimestamp) {
      return <span className={styles['timer-description']}>Play now</span>;
    } else {
      return null;
    }
  }, [status, lockTimerTimestamp, theme.id, themeAccess]);

  if (loading) {
    return <GhostLoader texts={[]} />;
  }

  return (
    <div className={classNames(styles.container, theme && styles[theme.id])}>
      <Background ref={backgroundRef} theme={theme} />
      <Header />

      <div className={styles.content}>
        <div className={styles['content-inner-container']}>
          <div className={styles['balance-container']}>
            <div className={styles.balance}>
              {balance?.label?.toLocaleString('en-US')}
            </div>
          </div>

          <div className={styles['timer-container']}>
            <Timer />
            {drawTimerDescription}
            {theme.id !== 'hawk' && (
              <span className={styles['actions-description']}>Boost mode</span>
            )}
          </div>

          <div className={styles['main-button-container']}>
            <div
              className={styles['main-button-touch-area']}
              {...conditionalSwipeHandlers}
              // onClick={clickHandler}
              onTouchEnd={handleEvent}
              onMouseUp={handleEvent}>
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
                <TempUpdate
                  isActive={!!tempPreview}
                  counter={tempPreview}
                  onClose={onCloseTempPreview}
                />
              </div>

              <div className={styles.description}>
                {level - 1 ? <span>X{level - 1}</span> : null}
              </div>

              <div className={styles.counter}>
                <Counter
                  ref={counterRef}
                  seconds={5}
                  onFinish={counterFinishedHandler}
                />
              </div>
            </div>

            {status !== 'playing' && counterIsFinished && (
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
            {status !== 'played' &&
              !themeAccess[theme.id] &&
              theme.id !== 'hawk' && (
                <div className={styles['actions-flex']}>
                  <BuyButton theme={theme} onCompleted={buyCompletedHandler} />
                  {/*<span className={styles['actions-description']}>*/}
                  {/*  recharge & play*/}
                  {/*</span>*/}
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
