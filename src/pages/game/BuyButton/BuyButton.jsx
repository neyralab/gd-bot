import React, { useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Address, toNano } from '@ton/core';
import { TonClient } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import {
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';
import { GDTapBooster } from '../../../effects/contracts/tact_GDTapBooster';
import { nullValueCheck } from '../../../effects/contracts/helper';
import {
  selectContractAddress,
  selectStatus,
  selectTheme,
  selectThemeAccess,
  selectThemes,
  setGameId,
  setIsTransactionLoading,
  setLockTimeoutId,
  setLockTimerTimestamp,
  setStatus,
  setThemeAccess,
  startCountdown
} from '../../../store/reducers/gameSlice';
import { useQueryId } from '../../../effects/contracts/useQueryId';
import { ReactComponent as TonIcon } from '../../../assets/TON.svg';
import { beforeGame, startGame } from '../../../effects/gameEffect';
import styles from './BuyButton.module.css';

export default function BuyButton() {
  const { open } = useTonConnectModal();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { queryId } = useQueryId();
  const dispatch = useDispatch();

  const status = useSelector(selectStatus);
  const theme = useSelector(selectTheme);
  const themes = useSelector(selectThemes);
  const themeAccess = useSelector(selectThemeAccess);
  const contractAddress = useSelector(selectContractAddress);

  const [isDisabled, setIsDisabled] = useState(false);

  const clickHandler = async () => {
    if (isDisabled) return;

    setIsDisabled(true);

    const plan = themes?.find((el) => el.multiplier === theme.multiplier);
    const bought = await onBuy(plan);

    setIsDisabled(false);

    if (!bought) {
      return;
    }
  };

  const afterBought = () => {
    dispatch(setStatus('waiting'));
    dispatch(setThemeAccess({ themeId: theme.id, status: true }));

    if (theme.id === 'hawk') {
      dispatch(setLockTimerTimestamp(null));
      dispatch(setLockTimeoutId(null));
    }

    setTimeout(() => {
      dispatch(startCountdown({ seconds: 5, startNextRound: true }));
    }, 100);
  };

  const onBuy = async (plan) => {
    try {
      if (!wallet) {
        return open();
      }
      const res = Address.parseFriendly(contractAddress);
      const parsedContractAddress = res.address;

      if (!parsedContractAddress && !plan) {
        return;
      }
      dispatch(setStatus('waiting'));
      const endpoint = await getHttpEndpoint();
      const closedContract = new GDTapBooster(parsedContractAddress);
      const client = new TonClient({ endpoint });
      const contract = client.open(closedContract);
      console.log({ onBuyPlan: plan });
      dispatch(setIsTransactionLoading(true));

      const pendingGame = await beforeGame(null, Number(plan.tierId));
      console.log({ pendingGame });
      dispatch(setGameId(pendingGame?.uuid || pendingGame.id));

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
            // await sleep(2000);
            const userAddress = Address.parseRaw(wallet.account.address);
            let initialValue = await nullValueCheck(() => {
              return contract.getLatestPurchase(userAddress);
            });
            // Initial value

            // Function to get the value
            const getValue = async () => {
              // Replace this with your actual getter logic
              return await nullValueCheck(() => {
                return contract.getLatestPurchase(userAddress);
              });
            };

            // TODO: redo in redux, i have no idea what's happening

            // Set up the interval
            const intervalId = setInterval(async () => {
              const currentValue = await getValue();

              console.log({ currentValue, initialValue });
              // If this is the first run, set the initial value
              if (initialValue === null) {
                initialValue = currentValue;
                console.log('Initial value set:', initialValue);
                return;
              }

              // Check if the value has changed
              if (currentValue !== initialValue) {
                console.log(
                  'Value changed from',
                  initialValue,
                  'to',
                  currentValue
                );
                clearInterval(intervalId);
                console.log('Interval cleared');
                const game = await startGame(
                  pendingGame.uuid || pendingGame.id,
                  Number(currentValue)
                );
                dispatch(setGameId(game.uuid || game?.id));
                console.log({ PPPPP: currentValue, game });
                dispatch(setIsTransactionLoading(false));
                afterBought();
              }
            }, 1000); // Check every 1000 ms (1 second)

            return data;
          }
        },
        { value: plan?.ton_price || toNano(0.01) },
        {
          $$type: 'Boost',
          queryId,
          tierId: plan?.tierId,
          gameId: pendingGame.uuid
        }
      );
      return true;
    } catch (e) {
      console.log({ onBuyError: e });
      return false;
    }
  };

  if (status !== 'playing' && !themeAccess[theme.id] && theme.id !== 'hawk') {
    return (
      <div className={styles['actions-flex']}>
        <button
          type="button"
          className={classNames(styles.button, styles[theme.id])}
          onClick={clickHandler}>
          <TonIcon />
          <span className={styles.cost}>{theme.cost || 'FREE'}</span>
          <span className={styles.multiplier}>X{theme.multiplier}</span>
        </button>
      </div>
    );
  }

  return null;
}
