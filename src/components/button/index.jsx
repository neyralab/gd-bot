import CN from 'classnames';
import styles from './styles.module.css';

export const Button = ({
  disabled = false,
  label,
  className,
  onClick,
  img
}) => {
  return (
    <button
      disabled={disabled}
      type="button"
      className={CN(styles.btn, className)}
      onClick={onClick}>
      {label}
      {img}
    </button>
  );
};
