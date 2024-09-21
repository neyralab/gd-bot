import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';
import { vibrate } from '../../utils/vibration';

export const Header = () => {
  const { t } = useTranslation('system');
  return (
    <header>
      <Link
        to="/start"
        className={styles['back-button']}
        onClick={vibrate}>
        {t('dashboard.back')}
      </Link>
    </header>
  );
};
