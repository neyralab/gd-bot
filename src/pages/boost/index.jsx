import CN from 'classnames';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';

import { Header } from '../../components/header';
import { Button } from '../../components/button';
import {
  selectCurrentWorkspace,
  selectWorkspacePlan
} from '../../store/reducers/workspaceSlice';
import { DEFAULT_TARIFFS_NAMES } from '../upgradeStorage';
import { getTonWallet } from '../../effects/paymentEffect';

import { ReactComponent as X1 } from '../../assets/x/x1.svg';
import { ReactComponent as X3 } from '../../assets/x/x3.svg';
import { ReactComponent as X5 } from '../../assets/x/x5.svg';
import { ReactComponent as X10 } from '../../assets/x/x10.svg';
import { ReactComponent as Diamond } from '../../assets/diamond.svg';
import { ReactComponent as Info } from '../../assets/info.svg';
import { ReactComponent as PayIcon } from '../../assets/pay_ton.svg';

import styles from './styles.module.css';

const multipliers = {
  1: <X3 className={styles.multiplier} />,
  5: <X5 className={styles.multiplier} />,
  10: <X10 className={styles.multiplier} />
};

const infoData = [
  'Points Booster with Storage Space',
  'Unlock increased storage capacity for 12 months.',
  'Boost your GDP points earnings with exclusive benefits.'
];

export const BoostPage = ({ tariffs }) => {
  const [activeMultiplier, setActiveMultiplier] = useState();
  const currentPlan = useSelector(selectWorkspacePlan) || {};
  const ws = useSelector(selectCurrentWorkspace);
  const user = useSelector((state) => state.user.data);
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();
  const dispatch = useDispatch();

  console.log({ activeMultiplier });
  const payByTON = async () => {
    if (!activeMultiplier) {
      return;
    }
    const paymentInfo = {
      user_id: user.id,
      workspace_id: ws.id,
      storage_id: activeMultiplier?.id
    };
    const recipientWallet = await getTonWallet(dispatch, paymentInfo);
    if (wallet && recipientWallet) {
      try {
        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
          messages: [
            {
              address: recipientWallet,
              amount: activeMultiplier?.ton_price * 1000000000
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

  return (
    <div className={styles.container}>
      <Header label={'Boost Points Rewards'} className={styles.backBtn} />
      <div>
        <p className={styles.header}>Current multiplayer</p>
        <div className={styles.current_item}>
          <div className={styles.flex}>
            <X1 className={styles.multiplier} />
            <p className={styles.current_storage}>
              <span className={styles.span}>
                {DEFAULT_TARIFFS_NAMES[currentPlan?.storage] || '1GB'}
              </span>
              {' Storage'}
            </p>
          </div>
          <div className={styles.cost}>
            <p className={styles.cost_value}>{currentPlan?.ton_price || '0'}</p>
            <Diamond className={styles.current_diamond} />
          </div>
        </div>
      </div>
      <div>
        <p className={styles.header}>Boost multiplayer</p>
        <ul className={styles.list}>
          {tariffs?.map((el, index) => (
            <li key={index}>
              <button
                onClick={() =>
                  setActiveMultiplier((prev) =>
                    prev?.storage === el.storage ? undefined : el
                  )
                }
                className={CN(
                  styles.item,
                  activeMultiplier?.storage === el.storage && styles.active_item
                )}>
                <div className={styles.flex}>
                  {multipliers[el?.ton_price]}
                  <div className={styles.item_storage}>
                    <p className={styles.storage}>
                      {DEFAULT_TARIFFS_NAMES[el?.storage]}
                    </p>
                    <p className={styles.item_text}>Storage per year</p>
                  </div>
                </div>
                <div className={styles.cost}>
                  <p className={styles.cost_value}>{el?.ton_price}</p>
                  <Diamond />
                </div>
              </button>
            </li>
          ))}
        </ul>
        <div>
          <div className={styles.info_header}>
            <Info />
            <p className={styles.header}>How it works?</p>
          </div>
          <p className={styles.info_text}>
            We also offer a Points Booster package that includes additional
            storage space for one year. Enhance your earning potential and enjoy
            expanded storage capabilities:
          </p>
          <ul className={styles.info_list}>
            {infoData.map((el, index) => (
              <li key={index} className={styles.info_item}>
                {el}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <footer className={styles.footer}>
        <Button
          disabled={!activeMultiplier}
          label="Pay"
          onClick={payByTON}
          img={<PayIcon className={styles.pay_icon} />}
          className={CN(styles.pay_btn, !activeMultiplier && styles.disabled)}
        />
      </footer>
    </div>
  );
};
