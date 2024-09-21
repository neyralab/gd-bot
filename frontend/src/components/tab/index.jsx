import { useCountUp } from 'react-countup';
import { useEffect, useRef } from 'react';
import CN from 'classnames';
import Loader2 from '../Loader2/Loader2';
import styles from './styles.module.scss';

export const Tab = ({ tab, active, isLoading, onClick }) => {
  const countUpRef = useRef(null);
  const { update: countUpUpdate } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: tab.number || 0,
    duration: 2.4
  });

  useEffect(() => {
    if (tab) {
      countUpUpdate(tab.number || 0);
    }
  }, [tab.number]);

  return (
    <button
      data-animation="tab-animation-1"
      type="button"
      className={styles.btn}
      onClick={onClick}>
      {isLoading && (
        <div className={styles['loader-container']}>
          <Loader2 />
        </div>
      )}

      {/* Hide with the help of styles, because otherwise countup won't work (countUpRef cannot be found) */}
      <div
        className={styles.content}
        style={{ display: !isLoading ? 'block' : 'none' }}>
        <p
          className={CN(active && styles.active, styles.value)}
          ref={countUpRef}>
          {tab.number}
        </p>
        <p className={styles.name}>{tab.name}</p>
      </div>
    </button>
  );
};
