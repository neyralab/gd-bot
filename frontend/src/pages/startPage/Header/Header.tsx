import { useNavigate } from "react-router-dom";

import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/assistant');
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={goBack}>Back</button>
    </div>
  )
}

export default Header;