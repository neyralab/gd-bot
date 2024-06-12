import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  DEFAULT_MULTIPLIER_NAMES,
  DEFAULT_TARIFFS_NAMES
} from '../../pages/upgradeStorage';

import { ReactComponent as Dollar } from '../../assets/dollar_sign.svg';
import styles from './styles.module.css';

export const Range = () => {
  const [value, setValue] = useState(0);
  const user = useSelector((state) => state?.user?.data);

  const storage = useMemo(() => {
    const size = DEFAULT_TARIFFS_NAMES[user?.space_total] || '1GB';
    return {
      size,
      multiplier: DEFAULT_MULTIPLIER_NAMES[size] || 1
    };
  }, [user?.space_total]);

  return (
    <div className={styles.container}>
      <Dollar className={styles.img} />
      <input
        type="range"
        min="1"
        max="100"
        value={value}
        disabled
        className={styles.slider}
        onChange={(e) => setValue(e.target.value)}></input>
      <p className={styles.text}>x{storage.multiplier}</p>
    </div>
  );
};
