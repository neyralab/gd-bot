import { useEffect, useState } from 'react';

import { getLeaderboardEffect } from '../../../effects/leaderboardEffect';
import Banner1 from '../assets/Banner1/Banner1';
import Menu from '../../../components/Menu/Menu';
import Header from '../assets/Header/Header';
import Table from '../assets/Table/Table';
import { ReactComponent as LoaderIcon } from '../../../assets/loader.svg';

import style from '../style.module.css';

export const LeaderboardLeague = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getLeaderboardEffect().then((data) => {
      setLeaderboard(data?.data);
      if (data?.total_users) setTotalUsers(data?.total_users);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <Header />

      <div className={style.banner}>
        <Banner1 />
      </div>

      {isLoading && (
        <div className={style.loader}>
          <LoaderIcon />
        </div>
      )}

      {!isLoading && leaderboard.length > 0 && (
        <Table items={leaderboard} totalUsers={totalUsers} />
      )}

      <Menu />
    </div>
  );
};
