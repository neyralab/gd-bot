import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { referralEffect } from '../../effects/referralEffect';

import styles from './styles.module.css';
import { Header } from '../../components/header';
import { Tab } from '../../components/tab';
import { Button } from '../../components/button';
import { History } from '../../components/history';

const tabs = [
  {
    number: 0,
    name: 'users',
    key: 'users'
  },
  {
    number: 0,
    name: 'referral files',
    key: 'refFiles'
  },
  {
    number: 0,
    name: 'earn',
    key: 'earn'
  }
];

export const Referral = () => {
  const [tabList, setTabs] = useState({
    users: 0,
    refFiles: 0,
    earn: 0
  });
  const link = useSelector((state) => state.user.link);

  useEffect(() => {
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

  const copyMe = async () => {
    try {
      await navigator.clipboard.writeText(link.copy);
    } catch (e) {
      console.log({ e });
    }
  };

  const sendLink = () => {
    window.open(link.send);
  };

  return (
    <div className={styles.container}>
      <Header label="Referral System" />
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
      <History />
      <footer>
        <Button
          label="Copy link"
          onClick={copyMe}
          className={styles.white_btn}
        />
        <Button
          label="Send link"
          onClick={sendLink}
          className={styles.black_btn}
        />
      </footer>
    </div>
  );
};
