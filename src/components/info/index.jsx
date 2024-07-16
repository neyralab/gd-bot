import { useNavigate } from 'react-router-dom';

import { ReactComponent as CircleBackgroundIcon } from '../../assets/background.svg';
import { ReactComponent as PlusIcon } from '../../assets/boldPlusIcon.svg';

import { fomatNumber } from '../../utils/string';

import styles from './styles.module.css';

export const InfoBox = ({ points }) => {
  const navigate = useNavigate();

  const goToStorageUpdate = () => {
    navigate('/upgrade');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.value}>{fomatNumber(points || 0)}</p>
        <span
          className={styles.text}
          onClick={goToStorageUpdate}
        >
          <PlusIcon />
        </span>
      </div>
      <div className={styles.circle}>
        <CircleBackgroundIcon />
      </div>
    </div>
  );
};
