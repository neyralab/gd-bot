import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { LeaderIcon } from '../LeaderIcon';
import styles from './Table.module.css';

export default function Table({ items }) {
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

  function anonymizeFullName(str) {
    if (str.length <= 7) {
      return str;
    }
    const start = str.slice(0, 5);
    const end = str.slice(-2);
    const middle = '*'.repeat(str.length - 7);
    return `${start}${middle}${end}`;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className={styles.headerCell}>#</th>
          <th className={styles.headerCell}>User</th>
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
