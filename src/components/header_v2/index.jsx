import { Link } from 'react-router-dom';
import styles from './styles.module.css';

export const Header = () => {
  return (
    <header>
      <Link to="/start" className={styles['back-button']}>
        Back
      </Link>
    </header>
  );
};
