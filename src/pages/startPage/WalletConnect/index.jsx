import React, { useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  useTonAddress,
  useTonConnectModal,
  // useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';
import { saveUserWallet } from '../../../effects/userEffects';

import style from './style.module.css';

export const WalletConnect = forwardRef(({ openDisconnectModal }, ref) => {
  const user = useSelector((state) => state.user.data);
  const address = useTonAddress(true);
  const { open } = useTonConnectModal();
  const wallet = useTonWallet();
  // const [tonConnectUI] = useTonConnectUI();
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

  // useEffect(
  //   () =>
  //     tonConnectUI.onStatusChange((wallet) => {
  //       console.log({ onStatusChange: wallet });
  //       if (
  //         wallet?.connectItems?.tonProof &&
  //         'proof' in wallet?.connectItems.tonProof
  //       ) {
  //         setTonProof(wallet?.connectItems.tonProof);
  //       }
  //     }),
  //   [tonConnectUI]
  // );

  useEffect(() => {
    if (!user?.wallet && address && wallet) {
      // if (address && tonProof && wallet) {
      (async () => {
        const res = await saveUserWallet({
          // tonProof,
          account: {
            ...wallet?.account,
            uiAddress: address
          }
        });
        console.log({ res });
      })();
    }
  }, [address, user?.wallet, wallet]);
  // }, [address, tonProof, wallet]);

  const handleClick = useCallback(() => {
    if (address.length) {
      openDisconnectModal(true);
    } else {
      open()
    }
  }, [openDisconnectModal, address, open])

  useImperativeHandle(ref, () => {
    return { handleClick };
  }, [handleClick]);

  return (
    <div className={style.wrapper}>
      {address.length ? (
        <span
          className={style.address}
          onClick={() => {
            openDisconnectModal(true);
          }}>
            {`...${address.slice(-4)}`}
        </span>
      ) : (
        <button className={style.connect} onClick={open}>
          <span>Add</span>
        </button>
      )}
    </div>
  );
});
