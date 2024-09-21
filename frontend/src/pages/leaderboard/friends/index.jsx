import { useEffect, useState } from 'react';

import Banner2 from '../assets/Banner2/Banner2';
import Menu from '../../../components/Menu/Menu';
import Header from '../assets/Header/Header';
import Table from '../assets/Table/Table';
import { getFriends } from '../../../effects/friendsEffect';
import { ReactComponent as LoaderIcon } from '../../../assets/loader.svg';

import style from '../style.module.css';

export const LeaderboardFriends = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getFriends().then((data) => {
      setLeaderboard(data?.data ? data.data : []);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <Header />

      <div className={style.banner}>
        <Banner2 />
      </div>

      {isLoading && (
        <div className={style.loader}>
          <LoaderIcon />
        </div>
      )}

      {!isLoading && leaderboard.length > 0 && <Table items={leaderboard} />}

      <Menu />
    </div>
  );
};
