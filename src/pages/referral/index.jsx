import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useBalance } from '../../hooks/useBalance';
import { referralEffect } from '../../effects/referralEffect';
import { Header } from '../../components/header';
import { Tab } from '../../components/tab';
import { History } from '../../components/history';
import Menu from '../../components/Menu/Menu';

import styles from './styles.module.css';

const tabs = [
  {
    number: 0,
    name: 'users',
    key: 'users'
  },
  // {
  //   number: 0,
  //   name: 'referral files',
  //   key: 'refFiles'
  // },
  {
    number: 0,
    name: 'earn',
    key: 'earn'
  }
];

export const Referral = () => {
  const [tabList, setTabs] = useState({
    users: 0,
    // refFiles: 0,
    earn: 0
  });
  const balance = useBalance();
  console.log({ balance });

  useEffect(() => {
    setTabs((prevState) => ({
      ...prevState,
      // refFiles: balance?.fileCnt,
      earn: balance?.points
    }));
  }, [balance]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await referralEffect();
        setTabs((prevState) => ({
          ...prevState,
          users: data?.data?.current_usage,
          earn: data.data?.points
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
        label="Airdrop"
        headerClassName={styles.header}
      />
      <div className={styles.tabs}>
        {Object.keys(tabList).map((el, index) => (
          <Tab
            active={!index}
            tab={{
              number: tabList[el] || 0,
              name: tabs.find((tab) => tab.key === el)?.name
            }}
            key={index}
            onClick={() => {}}
          />
        ))}
      </div>

      <History history={balance.history} />

      <Menu />
    </div>
  );
};
