import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ReactComponent as TopIcon } from '../../assets/top.svg';
import { ReactComponent as EarnIcon } from '../../assets/earn.svg';

import styles from './styles.module.css';
import { vibrate } from '../../utils/vibration';

export const Header = () => {
  const { t } = useTranslation('system');
  return (
    <header>
      <Link
        to="/leadboard/league"
        className={styles['top-button']}
        onClick={() => {vibrate('soft')}}>
        <TopIcon />
      </Link>
      <Link
        to="/earn"
        className={styles['earn-button']}
        onClick={() => {vibrate('soft')}}>
        <EarnIcon />
      </Link>
    </header>
  );
};
