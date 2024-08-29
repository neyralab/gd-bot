import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountUp } from 'react-countup';
import { ReactComponent as PlusIcon } from '../../assets/boldPlusIcon.svg';
import styles from './styles.module.scss';

export const InfoBox = ({ points }) => {
  const navigate = useNavigate();
  const countUpRef = useRef(null);
  const { update: countUpUpdate } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: points || 0,
    duration: 2.4
  });

  useEffect(() => {
    countUpUpdate(points);
  }, [points]);

  const goToStorageUpdate = () => {
    navigate('/boost');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p ref={countUpRef} className={styles.value}></p>
        <span className={styles.text} onClick={goToStorageUpdate}>
          <PlusIcon />
        </span>
      </div>
      <div className={styles.circle}>
        <img src="/assets/storage-circle.png" />
      </div>
    </div>
  );
};
