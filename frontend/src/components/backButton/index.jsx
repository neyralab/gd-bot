import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { vibrate } from '../../utils/vibration';

import CN from 'classnames';
import styles from './styles.module.css';

export const BackButton = ({ className }) => {
  const { t } = useTranslation('system');
  const navigate = useNavigate();

  const onBackClick = () => {
    vibrate();
    navigate(-1);
  }

  return (
    <button
      type="button"
      onClick={onBackClick}
      className={CN(styles.btn, className)}
    >
      {t('dashboard.back')}
    </button>
  );
};
