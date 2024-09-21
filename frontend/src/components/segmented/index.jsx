import React from 'react';
import CN from 'classnames';

import styles from './styles.module.css';

const Segmented = ({ options, active }) => {

  return (
    <div data-animation="segmented-animation-1" className={styles.container}>
      { options.map(({ name, title, onClick }) => (
        <button
          className={CN(
            styles.action,
            name === active && styles.actionActive,
          )}
          style={{ width: `calc(${100/options.length}% - 2px)` }}
          key={name}
          onClick={onClick}
        >
          { title }
        </button>
      )) }
    </div>
  );
}

export default Segmented;