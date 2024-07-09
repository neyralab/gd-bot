import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address } from '@ton/core';
import CN from 'classnames';

import NavigatItem from './NavigatItem';
import { WalletConnect } from '../WalletConnect';
import { ReactComponent as WalletIcon } from '../assets/wallet.svg';
import { ReactComponent as DriveIcon } from '../assets/drive.svg';
import { ReactComponent as TapIcon } from '../assets/tap.svg';
import { ReactComponent as RewardsIcon } from '../assets/rewards.svg';
import { ReactComponent as BoostIcon } from '../assets/boost.svg';
// import { ReactComponent as LanguageIcon } from '../assets/language.svg';
import { ReactComponent as NodeIcon } from '../../../assets/node.svg';

import { useContract } from '../../../utils/useContract';
import { NFT_ADDRESS } from '../../../config/contracts'
import { NftCollection } from '../../../effects/contracts/tact_NftCollection';

import styles from './Navigator.module.css';

export default function Navigator({
  storage,
  human,
  tasks,
  wallet,
  openDisconnectModal
}) {
  const [userNodes, setUserNodes] = useState('0');
  const contract = useContract(NFT_ADDRESS, NftCollection);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (contract && wallet) {
      contract
        .getTotalBought(Address.parse(wallet))
        .then((total) => {
          setUserNodes(total.toString());
        })
        .catch((err) => {
          setUserNodes('0');
          console.log({ err });
        });
    }
  }, [contract, wallet]);

  const handleWalletClick = useCallback(() => {
    ref.current.handleClick()
  }, [])
  
  const NAVIGATION = useMemo(() => ([
    {
      id: 1,
      name: 'Wallet',
      icon: <WalletIcon />,
      html: (<WalletConnect openDisconnectModal={openDisconnectModal} ref={ref} />),
      onClick: handleWalletClick
    },
    {
      id: 2,
      name: 'Drive',
      icon: <DriveIcon />,
      html: (<span className={CN(styles.actionBtn, styles.addBt)}>{human.percent.label}</span>),
      onClick: () => navigate('/file-upload')
    },
    {
      id: 3,
      name: 'Tap',
      icon: <TapIcon />,
      html: (<span className={CN(styles.actionBtn, styles.playBtn)}>Play</span>),
      onClick: () => navigate('/game')
    },
    {
      id: 4,
      name: 'Rewards',
      icon: <RewardsIcon />,
      html: (<span className={styles.actionBtn}>{tasks?.length || 0}</span>),
      onClick: () => navigate('/task')
    },
    {
      id: 5,
      name: 'Boost',
      icon: <BoostIcon />,
      html: (<span className={styles.actionBtn}>{`X${storage.multiplier}`}</span>),
      onClick: () => navigate('/boost')
    },
    {
      id: 6,
      name: 'Nodes',
      icon: <NodeIcon />,
      html: (<span className={styles.actionBtn}>{userNodes}</span>),
      onClick: () => navigate('/nodes-welcome')
    }
    // {
    //   id: 7,
    //   name: 'Language',
    //   icon: <LanguageIcon />,
    //   html: (<span className={styles.actionBtn}>Eng</span>),
    //   onClick: () => {}
    // },
  ]), [storage, tasks, human, handleWalletClick, openDisconnectModal, navigate, userNodes])

  return (
    <ul className={CN(styles['navigator'], styles['to-appear'])}>
      {NAVIGATION.map(({ id, name, icon, html, onClick }) => (
        <NavigatItem
          key={id}
          name={name}
          icon={icon}
          html={html}
          onClick={onClick}
        />
      ))}
    </ul>
  );
}
