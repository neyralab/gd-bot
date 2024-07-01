import React, { FC, ReactElement, useMemo } from 'react';
import styles from './styles.module.css';

import { ReactComponent as X1 } from '../../assets/x/x1.svg';
import { ReactComponent as X3 } from '../../assets/x/x3.svg';
import { ReactComponent as X5 } from '../../assets/x/x5.svg';
import { ReactComponent as X10 } from '../../assets/x/x10.svg';
import { Storage } from './types';

const multipliers: Record<number, ReactElement> = {
  0: <X1 className={styles.multiplier} />,
  1: <X3 className={styles.multiplier} />,
  2: <X5 className={styles.multiplier} />,
  3: <X10 className={styles.multiplier} />
};

export const StorageIcon: FC<{ storage?: Storage }> = ({ storage }) => {
  const id = useMemo(() => {
    return storage?.id || 0;
  }, [storage?.id]);
  return (
    <div className={styles.icon}>
      {multipliers[id]}
      {id ? (
        <span className={styles.iconMultiplier}>X{storage?.multiplicator}</span>
      ) : null}
    </div>
  );
};
