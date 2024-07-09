import { NoHistory } from './empty';

import { ReactComponent as Cloud } from '../../assets/clock.svg';
import styles from './styles.module.css';

export const History = ({ history }) => {
  return (
    <div className={styles.container}>
      <p className={styles.history}>History</p>
      <ul className={styles.list}>
        {!history?.length ? (
          <NoHistory />
        ) : (
          history.map((el, index) => (
            <li key={index} className={styles.item}>
              <Cloud width={32} height={32} />
              <div className={styles.text_container}>
                <p className={styles.value}>{el.points}</p>
                <p className={styles.text}>{el?.text || el?.point?.text}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
