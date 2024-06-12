import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={styles['back-button']}>
        Back
      </button>
    </header>
  );
};
