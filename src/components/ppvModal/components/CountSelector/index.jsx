import React, { useState, useRef, useEffect } from 'react';
import CN from 'classnames';

import { ReactComponent as AddIcon } from './assets/add.svg';
import { ReactComponent as RemoveIcon } from './assets/remove.svg';
import { ReactComponent as StarIcon } from '../../../../assets/star.svg';

import { AutosizeInput } from '../../../autosizeInput';

import { animateButton } from '../../animations';
import styles from './styles.module.css';

const initialState = { left: false, right: false };

const CountSelector = ({ title, value, onChange, name, min = 0, max }) => {
  const [disabled, setDisabled] = useState(initialState);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value >= max) {
      setDisabled((data) => ({ ...data, right: true }));
    } else if (value <= min) {
      setDisabled((data) => ({ ...data, left: true }));
    } else {
      setDisabled(initialState);
    }
  }, [value]);

  const onInputChange = (inputValue) => {
    const nextValue = Number(inputValue || 0);

    if (value === 0 && nextValue >= 10) {
      onChange({ [name]: Number(nextValue.toString().replace('0', '')) });
    } else if (max && nextValue > max) {
      onChange({ [name]: Number(max) });
    } else {
      onChange({ [name]: nextValue });
    }
  };

  const onIncreaseValue = (e) => {
    if (!disabled.right) {
      onChange({ [name]: Number(value) + 1 });
      animateButton(e.currentTarget);
    }
  };

  const onDecreaseValue = (e) => {
    if (!disabled.left) {
      onChange({ [name]: Number(value) - 1 });
      animateButton(e.currentTarget);
    }
  };

  return (
    <div data-animation="ppv-counter-animation-1" className={styles.container}>
      <p className={styles.header}>{title}</p>

      <div className={styles.input}>
        <StarIcon viewBox="0 0 21 21" />
        <AutosizeInput
          ref={inputRef}
          type="number"
          className={styles.inputComponent}
          value={value}
          onChange={onInputChange}
        />
      </div>

      <button
        className={CN(styles.action_button, styles.action_button_left)}
        disabled={disabled.left}
        onClick={onDecreaseValue}>
        <RemoveIcon />
      </button>

      <button
        className={CN(styles.action_button, styles.action_button_right)}
        disabled={disabled.right}
        onClick={onIncreaseValue}>
        <AddIcon />
      </button>
    </div>
  );
};

export default CountSelector;
