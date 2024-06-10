import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLeaderboardEffect } from '../../effects/leaderboardEffect';

import { LeaderIcon } from './assets/LeaderIcon';

import style from './style.module.css';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getLeaderboardEffect().then((data) => setLeaderboard(data));
  }, []);

  function anonymizeFullName(str) {
    if (str.length <= 7) {
      return str;
    }
    const start = str.slice(0, 5);
    const end = str.slice(-2);
    const middle = '*'.repeat(str.length - 7);
    return `${start}${middle}${end}`;
  }

  const onBackButtonClick = () => navigate(-1);

  return (
    <div className={style.wrapper}>
      <header className={style.pageHeader}>
        <button className={style.backButton} onClick={onBackButtonClick}>
          Back
        </button>
        <h2>Leaderboard</h2>
      </header>
      <table className={style.table}>
        <thead>
          <tr className={style.headerRow}>
            <th className={style.headerCell}>#</th>
            <th className={style.headerCell}>User</th>
            <th className={style.headerCell}>Points</th>
          </tr>
        </thead>
        <tbody className={style.tableBody}>
          {leaderboard.map((el, i) => (
            <tr className={style.row} key={i}>
              <td className={style.position}>
                <LeaderIcon position={i + 1} />
              </td>
              <td className={style.username}>
                {anonymizeFullName(el.username)}
              </td>
              <td className={style.points}>{el.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
