/* global BigInt */
import React, { useEffect, useId, useRef, useState } from 'react';
import classNames from 'classnames';
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
  addExperience
} from '../../store/reducers/gameSlice';
import { Header } from '../../components/header_v2';
import MainButton from './MainButton/MainButton';
import Background from './Background/Background';
import BuyButton from './BuyButton/BuyButton';
import PointsGrowArea from './PointsGrowArea/PointsGrowArea';
import Timer from './Timer/Timer';
import Menu from './Menu/Menu';
import ProgressBar from './ProgressBar/ProgressBar';
import Congratulations from './Congratulations/Congratulations';
import themes from './themes';
import styles from './styles.module.css';

import { Address } from '@ton/core';
import { TonClient } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { GDTapBooster } from '../../effects/contracts/tact_GDTapBooster';
import { nullValueCheck } from '../../effects/contracts/helper';
import { getGameContractAddress, getGamePlans } from '../../effects/gameEffect';
import { useQueryId } from '../../effects/contracts/useQueryId';
import TonWeb from 'tonweb';

export function GamePage() {
  const clickSoundRef = useRef(new Audio('/assets/game-page/2blick.wav'));

  const backgroundRef = useRef();
  const pointsAreaRef = useRef();
  const mainButtonRef = useRef();

  const dispatch = useDispatch();
  const soundIsActive = useSelector(selectSoundIsActive);
  const theme = useSelector(selectTheme);
  const themeAccess = useSelector(selectThemeAccess);
  const status = useSelector(selectStatus);
  const balance = useSelector(selectBalance);
  const lockTimerTimestamp = useSelector(selectLockTimerTimestamp);
  const [themeIndex, setThemeIndex] = useState([0]);
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [gamePlans, setGamePlans] = useState();
  const [currentGamePlan, setCurrentGamePlan] = useState();
  const [contractAddress, setContractAddress] = useState();
  const { queryId } = useQueryId();
  // console.log({ gamePlans, queryId, currentGamePlan, contractAddress });

  useEffect(() => {
    (async () => {
      const cAddress = await getGameContractAddress();
      const { address } = Address.parseFriendly(cAddress);
      setContractAddress(address);

      const games = await getGamePlans();
      setGamePlans(games);
      setCurrentGamePlan(games?.at(0));
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
    e.preventDefault();
    e.stopPropagation();

    let newThemeIndex;

    if (direction === 'next') {
      newThemeIndex = (themeIndex + 1) % themes.length;
    } else if (direction === 'prev') {
      newThemeIndex = (themeIndex - 1 + themes.length) % themes.length;
    }

    dispatch(setTheme(themes[newThemeIndex]));
    dispatch(setStatus('waiting'));
  };

  const onBuy = async () => {
    if (!contractAddress) {
      return;
    }
    const endpoint = await getHttpEndpoint();
    // const addressString = 'EQBDaILjUTPYEE2ibO8Lg-8X1f6jH0H1lHUAdzPRNXgs24iL';
    // const { address } = Address.parseFriendly(addressString);
    const adr = new Address(
      -1,
      Buffer.from([
        67, 104, 130, 227, 81, 51, 216, 16, 77, 162, 108, 239, 11, 131, 239, 23,
        213, 254, 163, 31, 65, 245, 148, 117, 0, 119, 51, 209, 53, 120, 44, 219
      ])
    );
    const closedContract = new GDTapBooster(adr);
    console.log({ endpoint, closedContract, contractAddress });
    // const { TonClient } = t;
    console.log({ TonClient });
    const client = new TonClient({ endpoint });
    console.log({
      client,
      iss: Address.isAddress(closedContract.address),
      '!Address.isAddress(src.address)': !Address.isAddress(
        closedContract.address
      )
    });

    const contract = client.open(closedContract);
    console.log({ contract });
    const p2 = 2n;

    const tierPrice = await contract.getTierPrice(currentGamePlan?.tierId);
    // const np = await contract.getNextPurchaseId();
    console.log({
      tierPrice,
      // np,
      wallet
    });
    // return;
    const userAddress = Address.parseRaw(wallet.account.address);
    console.log({ userAddress });

    const res = await contract.send(
      {
        send: async (args) => {
          console.log({ args });

          const data = await tonConnectUI.sendTransaction({
            messages: [
              {
                address: args.to.toString(),
                amount: args.value.toString(),
                payload: args.body?.toBoc().toString('base64')
              }
            ],
            validUntil: Date.now() + 5 * 60 * 1000 // 5 minutes for user to approve
          });
          console.log({ data });
          return data;
        }
      },
      { value: currentGamePlan?.ton_price },
      {
        $$type: 'Boost',
        queryId,
        tierId: currentGamePlan?.tierId
      }
    );
    console.log({ res });
    const pur = await nullValueCheck(() => {
      return contract.getLatestPurchase(userAddress);
    });
    console.log({ PPPPP: pur });
  };

  const clickHandler = (e) => {
    onBuy();
    return;
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

  const buyCompletedHandler = () => {
    dispatch(setStatus('waiting'));
    dispatch(setThemeAccess({ themeId: theme.id, status: true }));

    if (theme.id === 'hawk') {
      dispatch(setLockTimerTimestamp(null));
      dispatch(setLockTimeoutId(null));
    }
  };

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
            onClick={clickHandler}
            className={styles['main-button-container']}>
            <div className={styles['points-grow-area-container']}>
              <PointsGrowArea ref={pointsAreaRef} theme={theme} />
            </div>

            <MainButton ref={mainButtonRef} theme={theme} />

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

          {status !== 'played' && !themeAccess[theme.id] && (
            <div className={styles['actions-container']}>
              <div className={styles['actions-flex']}>
                <BuyButton theme={theme} onCompleted={buyCompletedHandler} />
                <span className={styles['actions-description']}>
                  recharge & play
                </span>
              </div>
            </div>
          )}

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
