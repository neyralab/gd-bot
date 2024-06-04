/* eslint-disable */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTonConnectUI,
  useTonWallet,
  TonConnectButton,
  useTonConnectModal
} from '@tonconnect/ui-react';

import {
  createStripeSorageSub,
  getTonWallet,
  updateWsStorage
} from '../../effects/paymentEffect';
import { sidebarSizeTransformer } from '../../utils/storage';
import {
  selectCurrentWorkspace,
  selectWorkspacePlan
} from '../../store/reducers/workspaceSlice';
import { SuccessPopup } from './SuccessPopup';
import BillingModal from './BillingModal';

// import { ReactComponent as CoinIcon } from '../../assets/coin.svg';

import s from './style.module.css';

export const DEFAULT_MULTIPLIER_NAMES = {
  '1GB': 1,
  '50GB': 3,
  '500GB': 5,
  '1TB': 10
};

export const DEFAULT_TARIFFS_NAMES = {
  1073741824: '1GB',
  107374182400: '100GB',
  137438953472: '128GB',
  274877906944: '256GB',
  549755813888: '512GB',
  1099511627776: '1TB',
  2199023255552: '2TB',
  5497558138880: '5TB',
  10995116277760: '10TB',
  109951162777600: '100TB'
};

const yearlyDiscount = {
  107374182400: '-50%',
  1099511627776: '-33%',
  2199023255552: '-15%'
};

export const UpgradeStoragePage = ({ tariffs }) => {
  const navigate = useNavigate();
  const ws = useSelector(selectCurrentWorkspace);
  const user = useSelector((state) => state.user.data);
  const currentPlan = useSelector(selectWorkspacePlan) || {};
  const [duration, setDuration] = useState(12);
  const [plan, setPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTonPaymentModal, setShowTonPaymentModal] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [availableTariffs, setAvailableTariffs] = useState(null);
  const [isTonCheckComplete, setIsTonCheckComplete] = useState(false);
  const [isTonPaymentSuccess, setIsTonPaymentSuccess] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const { open } = useTonConnectModal();
  const dispatch = useDispatch();

  useEffect(() => {
    if (tariffs) {
      setAvailableTariffs(tariffs);
    }
  }, [tariffs]);

  const onBackButtonClick = () => navigate(-1);

  const tariffList = useMemo(() => {
    if (!availableTariffs) return [];

    const filteredTariffs = availableTariffs.filter(
      (tf) => tf.storage > currentPlan?.storage
    );
    const choosenTariffs = currentPlan?.duration
      ? filteredTariffs
      : availableTariffs;
    const sortedTariffs = choosenTariffs.sort((a, b) => a.price - b.price);

    return sortedTariffs;
  }, [tariffs, availableTariffs, currentPlan?.storage]);

  const onPlanClick = (e) => {
    const element = e.target.closest('li');
    if (!element) return;

    const id = Number(element.id);
    if (id === plan) {
      setPlan(null);
      return;
    }
    setPlan(id);
  };

  const onClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const onPaymentSuccess = async () => {
    try {
      await updateWsStorage(
        subscription?.priceId,
        subscription?.subscriptionId
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.warn('something wrong');
    }
  };

  const payByCreditCard = async () => {
    try {
      const sub = await createStripeSorageSub(plan);
      setSubscription(sub);
      setShowPaymentModal(true);
    } catch (error) {
      console.warn(error);
    }
  };

  const selectedTariff = useMemo(() => {
    return tariffList.find((tariff) => tariff.id === plan);
  }, [plan, tariffList]);

  const payByTON = async () => {
    if (!selectedTariff) {
      return;
    }
    const paymentInfo = {
      user_id: user.id,
      workspace_id: ws.id,
      storage_id: selectedTariff.id
    };
    const recipientWallet = await getTonWallet(dispatch, paymentInfo);
    if (wallet && recipientWallet) {
      try {
        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
          messages: [
            {
              address: recipientWallet,
              amount: selectedTariff.ton_price * 1000000000
            }
          ]
        };
        await tonConnectUI.sendTransaction(transaction, {
          modals: ['before', 'success', 'error'],
          notifications: []
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      open();
    }
  };

  const getTariffMonthlyPrice = (price) => {
    return `${(price / duration / 100).toFixed(2)}`;
  };
  const getTariffYearlyPrice = (price) => {
    return duration === 1
      ? `${((price * 12) / 100).toFixed(2)}`
      : `${(price / 100).toFixed(2)}`;
  };

  const getCurrentPlanPrice = (price) => {
    const yearlyPrice =
      currentPlan?.duration === 1
        ? `${((price * 12) / 100).toFixed(2)}`
        : `${(price / 100).toFixed(2)}`;
    const monthlyPrice = `${(price / currentPlan?.duration / 100).toFixed(2)}`;
    return { yearlyPrice, monthlyPrice };
  };

  return (
    <div className={s.wrapper}>
      <header className={s.header}>
        <button className={s.header__backBtn} onClick={onBackButtonClick}>
          Back
        </button>
        {/* <h2 className={s.header__upgradeBtn}>Upgrade Storage</h2> */}
        <TonConnectButton />
      </header>
      <p className={s.headingText}>
        You will be charged immediately and each payment period until you change
        or cancel your plan.
      </p>
      <div className={s.currentPlanWrapper}>
        <h3 className={s.currentPlanTitle}>Curent plan</h3>
        <div className={s.upgradeOptionCard}>
          {currentPlan?.price ? (
            <>
              <span>{DEFAULT_TARIFFS_NAMES[currentPlan?.storage]}</span>
              <div>
                <p>{currentPlan?.ton_price ?? '0'} TON per year</p>
                <span>One-time payment for annual subscription</span>
              </div>
            </>
          ) : (
            <>
              <span>1GB</span>
              <div>
                <p>$0.00 per month</p>
                <span>free forever</span>
              </div>
            </>
          )}
        </div>
        <h3 className={s.currentPlanTitle}>Upgrade options</h3>
        <p className={s.upgradeText}>
          Your storage plan will automatically renew. You can cancel at any
          time. <a href="/">Learn more</a>
        </p>
      </div>
      <div className={s.options}>
        <div className={s.upgradeOptionsHeader}>
          <h3>Ghostdrive+</h3>
        </div>
        <ul className={s.optionsList} onClick={onPlanClick}>
          {tariffList.map((tariffPlan) => (
            <li id={tariffPlan.id} key={tariffPlan.id}>
              <div
                className={`${s.optionsList__card} ${
                  plan === '100GB' ? s.active : ''
                }`}>
                <span>{sidebarSizeTransformer(tariffPlan.storage)}</span>
                <div>
                  <p>{`${tariffPlan.ton_price} TON per year`}</p>
                  <span>One-time payment for annual subscription</span>
                </div>
                <input
                  className={s.checkbox}
                  readOnly
                  type="checkbox"
                  checked={plan === tariffPlan.id}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        disabled={!selectedTariff}
        className={`${s.payButton} ${!selectedTariff ? s.disabled : ''}`}
        onClick={payByTON}>
        Pay with TON
      </button>
      {/*<button*/}
      {/*  className={s.payButton}*/}
      {/*  onClick={payByCreditCard}*/}
      {/*  disabled={!!!plan}>*/}
      {/*  Pay <CoinIcon />*/}
      {/*</button>*/}
      {showTonPaymentModal && (
        <SuccessPopup
          onClose={() => showTonPaymentModal(false)}
          isLoading={!isTonCheckComplete}
          isPaymentSuccess={isTonPaymentSuccess}
        />
      )}
      {showPaymentModal && (
        <BillingModal
          isOpen={showPaymentModal}
          onClose={onClosePaymentModal}
          clientSecret={subscription?.clientSecret}
          successCallback={onPaymentSuccess}
        />
      )}
    </div>
  );
};
