import React, { FC } from "react";
import CN from 'classnames';

import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
  checked: boolean;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  checked,
  onChange = () => {},
  className,
  ...rest
}) => {
  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      <span className={CN(styles.slider, styles.round)}></span>
    </label>
  );
};

export default ToggleSwitch;
