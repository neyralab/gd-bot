import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address } from '@ton/core';
import CN from 'classnames';
import { useTranslation } from 'react-i18next';

import NavigatItem from '../Navigator/NavigatItem';

import { ReactComponent as NodeIcon } from '../../../assets/node.svg';

import { useContract } from '../../../utils/useContract';
import { NFT_ADDRESS } from '../../../config/contracts';
import { NftCollection } from '../../../effects/contracts/tact_NftCollection';

import styles from '../Navigator/Navigator.module.scss';

export default function Navigator({ wallet }) {
  const { t } = useTranslation('system');
  const [userNodes, setUserNodes] = useState('0');
  const contract = useContract(NFT_ADDRESS, NftCollection);
  const navigate = useNavigate();
  const [tonconnectUI, setTonconnectUI] = useState();

  useEffect(() => {
    if (contract && tonconnectUI?.account?.address) {
      contract
        .getTotalBought(Address.parse(tonconnectUI?.account.address))
        .then((total) => {
          setUserNodes(total.toString());
        })
        .catch((err) => {
          setUserNodes('0');
          console.log({ err });
        });
    }
  }, [contract, tonconnectUI?.account?.address]);

  const NAVIGATION = useMemo(
    () => [
      {
        id: 1,
        name: t('dashboard.nodes'),
        icon: <NodeIcon />,
        html: <span className={styles.actionBtn}>{userNodes}</span>,
        onClick: () => navigate('/nodes-welcome')
      }
    ],
    [navigate, userNodes]
  );

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
