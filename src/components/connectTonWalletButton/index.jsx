import React from 'react';
import { useTonAddress, useTonConnectModal } from '@tonconnect/ui-react';

import { ReactComponent as PlusIcon } from '../../assets/plusIcon.svg';

import style from './style.module.scss';

export const ConnectTonWalletButton = ({ openDisconnectModal }) => {
  const address = useTonAddress(true);
  const { open } = useTonConnectModal();

  return (
    <div className={style.wrapper}>
      {address.length ? (
        <p
          className={style.address}
          onClick={() => {
            openDisconnectModal(true);
          }}>
          {address.slice(0, 3) + '...' + address.slice(-6)}
        </p>
      ) : (
        <button className={style.connect} onClick={open}>
          <PlusIcon />
          <h2 className={style.header__title_new}>Wallet</h2>
        </button>
      )}
    </div>
  );
};
