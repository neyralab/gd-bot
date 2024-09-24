import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { referralEffect } from '../../effects/referralEffect';
import { getBalanceEffect } from '../../effects/balanceEffect';
import { Header } from '../../components/header';
import { Tab } from '../../components/tab';
import { History } from '../../components/history';
import Menu from '../../components/Menu/Menu';
import { runInitAnimation } from './animations';
import styles from './styles.module.css';

export const Referral = () => {
  const { t } = useTranslation('game');
  const [users, setUsers] = useState(0);
  const [areUsersLoading, setUsersLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [arePointsLoading, setPointsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setUsersLoading(false);
        const { data } = await referralEffect();
        const totalUsers = data?.data?.reduce(
          (acc, item) => acc + item?.current_usage,
          0,
        );
        setUsers(totalUsers || 0);
        console.log({ referralEffect: data });
        setUsersLoading(false);
      } catch (error) {
        console.log({ referralEffectErr: error });
      }
    })();

    (async () => {
      try {
        setPointsLoading(true);
        const { data } = await getBalanceEffect({ page: 1 });
        setPoints(data?.points || 0);
        console.log({ getBalanceEffect: data });
        setPointsLoading(false);
      } catch (error) {
        console.log({ getBalanceEffectErr: error });
      }
    })();
  }, []);

  useEffect(() => {
    runInitAnimation();
  }, []);

  return (
    <div className={styles.container}>
      <Header
        hideBack
        label={t('airdrop.airdrop')}
        headerClassName={styles.header}
      />

      <div className={styles.tabs}>
        <Tab
          active={true}
          tab={{
            number: users,
            name: t('airdrop.users')
          }}
          isLoading={areUsersLoading}
          onClick={() => {}}
        />

        <Tab
          active={false}
          tab={{
            number: points,
            name: t('airdrop.earn')
          }}
          isLoading={arePointsLoading}
          onClick={() => {}}
        />
      </div>

      <History />

      <Menu />
    </div>
  );
};
