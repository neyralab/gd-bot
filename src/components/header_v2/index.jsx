import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import useButtonVibration from '../../hooks/useButtonVibration';

export const Header = () => {
  const handleVibrationClick = useButtonVibration();
  return (
    <header>
      <Link
        to="/start"
        className={styles['back-button']}
        onClick={handleVibrationClick()}>
        Back
      </Link>
    </header>
  );
};
