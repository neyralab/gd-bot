import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

export const Header = () => {
  const { t } = useTranslation('system');
  return (
    <header>
      <Link
        to="/start"
        className={styles['back-button']}
      >
        {t('dashboard.back')}
      </Link>
    </header>
  );
};
