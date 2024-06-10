import { useNavigate } from 'react-router-dom';
import { ReactComponent as MenuIcon } from '../../assets/menu.svg';
import styles from './styles.module.css';

export const Header = ({ label }) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={styles['back-button']}>
        Back
      </button>

      <div className={styles.titles}>
        <h1>{label}</h1>
        <p>Bot</p>
      </div>

      <div className={styles['action-container']}>
        <MenuIcon />
      </div>
    </header>
  );
};
