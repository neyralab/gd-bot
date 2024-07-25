import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import useButtonVibration from '../../hooks/useButtonVibration';

import CN from 'classnames';
import styles from './styles.module.css';

export const BackButton = ({ className }) => {
  const { t } = useTranslation('system');
  const navigate = useNavigate();
  const handleVibrationClick = useButtonVibration();

  const onBackClick = () => navigate(-1);

  return (
    <button
      type="button"
      onClick={handleVibrationClick(onBackClick)}
      className={CN(styles.btn, className)}
    >
      {t('dashboard.back')}
    </button>
  );
};
