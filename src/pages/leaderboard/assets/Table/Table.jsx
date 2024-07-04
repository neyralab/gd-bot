import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { LeaderIcon } from '../LeaderIcon';
import { anonymizeFullName } from '../../../../utils/anonymize';
import styles from './Table.module.css';

export default function Table({ items, totalUsers }) {
  const [animatedLeaderIds, setAnimatedLeaderIds] = useState(new Set());

  useEffect(() => {
    const notAnimatedLeaders = items.filter(
      (el) => !animatedLeaderIds.has(el.id)
    );

    notAnimatedLeaders.forEach((el, index) => {
      setTimeout(() => {
        setAnimatedLeaderIds((prevIds) => new Set(prevIds).add(el.id));
      }, index * 80);
    });
  }, [items]);

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.headerCell}>#</th>
          <th className={styles.headerCell}>
            {totalUsers ? `${totalUsers} USERS` : `Users`}
          </th>
          <th className={styles.headerCell}>Points</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {items.map((el, i) => {
          return (
            <tr
              className={classNames(
                styles.row,
                animatedLeaderIds.has(el.id) && styles['active-row']
              )}
              key={el.id}>
              <td className={styles.position}>
                <LeaderIcon position={i + 1} />
              </td>
              <td className={styles.username}>
                {anonymizeFullName(el.username)}
              </td>
              <td className={styles.points}>
                {Number(el.points).toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
