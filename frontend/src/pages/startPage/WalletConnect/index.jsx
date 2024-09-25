import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { saveUserWallet } from '../../../effects/userEffects';
import { setUser } from '../../../store/reducers/userSlice';

import style from './style.module.css';

export const WalletConnect = forwardRef(({ openDisconnectModal }, ref) => {
  const { t } = useTranslation('system');
  const user = useSelector((state) => state.user.data);
  const address = useTonAddress(true);
  const [tonConnectUI] = useTonConnectUI();
  const dispatch = useDispatch();

  // const [tonProof, setTonProof] = useState();
  //
  // useEffect(() => {
  //   (async () => {
  //     if (!wallet) {
  //       tonConnectUI.setConnectRequestParameters({
  //         state: 'ready',
  //         value: {
  //           tonProof: `Welcome to Neyra Network. Your ID for this signature request is`
  //         }
  //       });
  //     } else {
  //       tonConnectUI.setConnectRequestParameters({ state: 'loading' });
  //     }
  //   })();
  // }, [wallet, tonConnectUI]);

  const handleClick = useCallback(async () => {
    if (address?.length) {
      openDisconnectModal(true);
    } else {
      await tonConnectUI?.openModal();
    }
  }, [address?.length, openDisconnectModal, tonConnectUI]);

  useImperativeHandle(ref, () => {
    return { handleClick };
  }, [handleClick]);

  const handleConnect = useCallback(async () => {
    await tonConnectUI?.openModal();
  }, [tonConnectUI]);

  useEffect(() => {
    tonConnectUI.modal.onStateChange(async (state) => {
      if (
        state.status === 'closed' &&
        state.closeReason === 'wallet-selected' &&
        !!user?.wallet?.filter((el) => el !== tonConnectUI.account?.address)
          .length
      ) {
        const res = await saveUserWallet({
          account: tonConnectUI?.account,
          channel: 'ton'
        });
        const newWallets = res.map((el) => el.public_address);
        dispatch(setUser({ ...user, wallet: newWallets }));
      }
    });
  }, []);

  return (
    <div className={style.wrapper}>
      {address ? (
        <span
          className={style.address}
          onClick={() => {
            openDisconnectModal(true);
          }}>
          {`...${address.slice(-4)}`}
        </span>
      ) : (
        <button className={style.connect} onClick={handleConnect}>
          <span>{t('dashboard.add')}</span>
        </button>
      )}
    </div>
  );
});
