import { ReactComponent as Clock } from '../../assets/clock.svg';
import styles from './styles.module.css';

export const NoHistory = () => {
  return (
    <div className={styles.empty_container}>
      <Clock width={48} height={48} />
      <p className={styles.header}>No Referral History</p>
      <p className={styles.text}>Share your referral link to start earning.</p>
    </div>
  );
};
