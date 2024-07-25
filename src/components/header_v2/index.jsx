import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import useButtonVibration from '../../hooks/useButtonVibration';

export const Header = () => {
  const { t } = useTranslation('system');
  const handleVibrationClick = useButtonVibration();
  return (
    <header>
      <Link
        to="/start"
        className={styles['back-button']}
        onClick={handleVibrationClick()}>
        {t('dashboard.back')}
      </Link>
    </header>
  );
};
