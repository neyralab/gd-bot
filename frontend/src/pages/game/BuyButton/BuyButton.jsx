import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Address, toNano } from '@ton/core';
import { TonClient } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import ReactGA from 'react-ga4';
import {
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';

import { GDTapBooster } from '../../../effects/contracts/tact_GDTapBooster';
import { getHexByBoc } from '../../../effects/contracts/helper';
import { selectPaymenttByKey } from '../../../store/reducers/paymentSlice';
import { SlidingModal } from '../../../components/slidingModal';
import PaymentMenu from '../../../components/paymentMenu/Menu';

import {
  selectContractAddress,
  selectIsGameDisabled,
  selectStatus,
  selectTheme,
  selectThemeAccess,
  selectThemes,
  setGameId,
  setGameInfo,
  setIsTransactionLoading,
  setLockIntervalId,
  setLockTimerTimestamp,
  setStatus,
  setThemeAccess,
  startCountdown
} from '../../../store/reducers/gameSlice';
import {
  handlePaymentSelectModal,
  selectPaymentSelectModal
} from '../../../store/reducers/modalSlice';
import { INVOICE_TYPE } from '../../../utils/createStarInvoice';
import { makeInvoice } from '../../../effects/paymentEffect';
import { useQueryId } from '../../../effects/contracts/useQueryId';
import { ReactComponent as StarIcon } from '../../../assets/star.svg';
import { ReactComponent as TonIcon } from '../../../assets/TON.svg';
import {
  beforeGame,
  startGame,
  getActivePayedGame
} from '../../../effects/gameEffect';
import { useOnConnect } from '../../../utils/useOnConnect';
import {
  isAnyPaymentEnabled,
  isTonPaymentEnabled,
  isStarsPaymentEnabled,
} from '../../../utils/paymentChecker';
import { isDevEnv } from '../../../utils/isDevEnv';
import { sleep } from '../../../utils/sleep';
import styles from './BuyButton.module.css';

export default function BuyButton() {
  useOnConnect();
  const { open } = useTonConnectModal();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { queryId } = useQueryId();
  const dispatch = useDispatch();

  const status = useSelector(selectStatus);
  const theme = useSelector(selectTheme);
  const themes = useSelector(selectThemes);
  const themeAccess = useSelector(selectThemeAccess);
  const isPaymentModalOpen = useSelector(selectPaymentSelectModal);
  const isGameDisabled = useSelector(selectIsGameDisabled);
  const gamePayment = useSelector(selectPaymenttByKey('tap_game'));

  const user = useSelector((state) => state?.user?.data);
  const contractAddress = useSelector(selectContractAddress);
  const isDev = isDevEnv();
  const [isDisabled, setIsDisabled] = useState(false);
  const isStarPaymentAllow = useMemo(() => isStarsPaymentEnabled && theme.stars, [isStarsPaymentEnabled, theme]);
  const isTonPaymentAllow = useMemo(() => isTonPaymentEnabled && theme.ton_price, [isTonPaymentEnabled, theme]);

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
      dispatch(setLockIntervalId(null));
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
      dispatch(setGameInfo(pendingGame));

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
            const tx = getHexByBoc(data.boc);
            console.log({ tx });
            // return;
            const game = await startGame(
              pendingGame.uuid || pendingGame.id,
              tx
            );
            dispatch(setGameId(game.uuid || game?.id));
            dispatch(setGameInfo(game));
            console.log({ PPPPP: tx, game });
            dispatch(setIsTransactionLoading(false));
            afterBought();
            return;
            // const userAddress = Address.parseRaw(wallet.account.address);
            //
            // const lastTxValue = await waitTonTx(() =>
            //   nullValueCheck(() => {
            //     return contract.getLatestPurchase(userAddress);
            //   })
            // );
            // console.log({ lastTxValue });
            // const game = await startGame(
            //   pendingGame.uuid || pendingGame.id,
            //   Number(lastTxValue)
            // );
            // dispatch(setGameId(game.uuid || game?.id));
            // dispatch(setGameInfo(game));
            // console.log({ PPPPP: lastTxValue, game });
            // dispatch(setIsTransactionLoading(false));
            // afterBought();
            // return data;
          }
        },
        { value: toNano(plan?.ton_price) },
        {
          $$type: 'Boost',
          queryId,
          tierId: plan?.tierId,
          gameId: pendingGame.uuid
        }
      );
      return true;
    } catch (e) {
      dispatch(setIsTransactionLoading(false));
      toast.error(
        'Something went wrong during payment. Please try again later!',
        {
          theme: 'colored',
          position: 'bottom-center',
          autoClose: 2000
        }
      );
      ReactGA.event({
        category: 'Error',
        action: 'Payment',
        label: e.message
      });
      console.log({ onBuyError: e });
      return false;
    }
  };

  const invoiceCallback = async (result) => {
    try {
      if (result === 'paid') {
        await sleep(1000);
        dispatch(setStatus('waiting'));
        const pendingGame = await getActivePayedGame();
        dispatch(setGameId(pendingGame?.uuid || pendingGame.id));
        dispatch(setGameInfo(pendingGame));
        afterBought();
      } else {
        console.warn(`error: The payment was not completed. ${result}`)
      }
    } catch (error) {
      console.warn('error: ', error);
    }
  };

  const onClosePaymentModal = () => {
    dispatch(handlePaymentSelectModal(false));
  };

  const handleSelect = () => {
    dispatch(handlePaymentSelectModal(true));
  };

  const handleStartStarsPayment = () => {
    const input = isDev ?
      `${gamePayment.Type};${0};${theme.tierId};${user.id};${0}`:
      `${0};${theme.tierId};${user.id}`;

    makeInvoice({
      input,
      dispatch,
      callback: invoiceCallback,
      type: INVOICE_TYPE.game,
      theme,
      isDev
    }); 
  }

  const handleStartPayment = (el) => {
    if (el.action === 'ton') {
      clickHandler();
    } else {
      handleStartStarsPayment();
    }
    onClosePaymentModal();
  };

  const hanldePyamentBtnClick = () => {
    toast.error(
      'Boost Mode is temporarily unavailable; we expect to restore it shortly. Thank you for your patience.',
      {
        theme: 'colored',
        position: 'top-center',
      }
    );
    // if (isStarPaymentAllow && isTonPaymentAllow) {
    //   handleSelect();
    // } else if (isStarPaymentAllow) {
    //   handleStartStarsPayment();
    // } else {
    //   clickHandler();
    // }
  }

  if (status !== 'playing' && !themeAccess[theme.id] &&  theme?.id !== 'hawk' && isAnyPaymentEnabled) {
    return (
      <div className={styles['actions-flex']}>
        <button
          type="button"
          className={classNames(styles.button, styles[theme.id])}
          disabled={isGameDisabled}
          onClick={hanldePyamentBtnClick}
        >
          {isStarPaymentAllow ? (
            <StarIcon className={styles['star-icon']} viewBox="0 0 21 21" />
            ) : (
            <TonIcon className={styles['star-icon']} viewBox="0 0 24 24" />
          )}
          <span className={styles.cost}>
            {isStarPaymentAllow ? theme.stars : theme.cost || 'FREE'}
          </span>
          <span
            className={styles.multiplier}
            style={{ color: theme.colors.buttonText }}>
            X{theme.multiplier}
          </span>
        </button>
        <SlidingModal
          onClose={onClosePaymentModal}
          isOpen={isPaymentModalOpen}
          snapPoints={[190, 190, 50, 0]}>
          <PaymentMenu payload={theme} onClick={handleStartPayment} />
        </SlidingModal>
      </div>
    );
  }

  return null;
}
