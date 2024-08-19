import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { referralEffect } from '../../effects/referralEffect';
import { getBalanceEffect } from '../../effects/balanceEffect';
import { Header } from '../../components/header';
import { Tab } from '../../components/tab';
import { History } from '../../components/history';
import Menu from '../../components/Menu/Menu';
import styles from './styles.module.css';

const tabs = (t) => [
  {
    number: 0,
    name: t('airdrop.users'),
    key: 'users'
  },
  {
    number: 0,
    name: t('airdrop.earn'),
    key: 'earn'
  }
];

export const Referral = () => {
  const { t } = useTranslation('game');
  const [tabList, setTabs] = useState({
    users: 0,
    earn: 0
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getBalanceEffect({ page: 1 });
        setTabs((prevState) => ({
          ...prevState,
          earn: data?.points
        }));
        console.log({ getBalanceEffect: data });
      } catch (error) {
        console.log({ getBalanceEffectErr: error });
      }
    })();

    (async () => {
      try {
        const { data } = await referralEffect();
        setTabs((prevState) => ({
          ...prevState,
          users: data?.data?.current_usage
        }));
        console.log({ referralEffect: data });
      } catch (error) {
        console.log({ referralEffectErr: error });
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <Header
        hideBack
        label={t('airdrop.airdrop')}
        headerClassName={styles.header}
      />
      <div className={styles.tabs}>
        {Object.keys(tabList).map((el, index) => (
          <Tab
            active={!index}
            tab={{
              number: tabList[el] || 0,
              name: tabs(t).find((tab) => tab.key === el)?.name
            }}
            key={index}
            onClick={() => {}}
          />
        ))}
      </div>

      <History />

      <Menu />
    </div>
  );
};