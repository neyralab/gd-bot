import { useEffect, useState } from 'react';

import { getLeaderboardEffect } from '../../../effects/leaderboardEffect';
import Banner1 from '../assets/Banner1/Banner1';
import Menu from '../../../components/Menu/Menu';
import Header from '../assets/Header/Header';
import Statistic from '../assets/Statistic/Statistic';
import Table from '../assets/Table/Table';
import { ReactComponent as LoaderIcon } from '../../../assets/loader.svg';

import style from '../style.module.css';

const BLACK_LIST = ['pshkv'];

export const LeaderboardLeague = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [info, setInfo] = useState({ totalTaps: 0, totalPoints: 0, totalUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getLeaderboardEffect().then((data) => {
      console.log(data);
      if (!data) return;
      setLeaderboard(data?.data?.filter((user) => (!BLACK_LIST.includes(user.username))));
      setInfo({
        totalTaps: data?.total_taps || 0,
        totalPoints: data?.total_points || 0,
        totalUsers: data?.total_users || 0
      })
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <Header />

      <div className={style.banner}>
        <Banner1 />
      </div>

      <Statistic {...info} />

      {isLoading && (
        <div className={style.loader}>
          <LoaderIcon />
        </div>
      )}

      {!isLoading && leaderboard.length > 0 && (
        <Table items={leaderboard} totalUsers={info.totalUsers} />
      )}

      <Menu />
    </div>
  );
};
