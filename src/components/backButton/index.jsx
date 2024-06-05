import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import CN from 'classnames';

export const BackButton = ({ className }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={CN(styles.btn, className)}>
      Back
    </button>
  );
};
