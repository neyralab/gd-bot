import { BackButton } from '../backButton';

import styles from './styles.module.css';

export const Header = ({ label, className }) => {
  return (
    <header className={styles.header}>
      <BackButton className={className} />
      <h1 className={styles.head}>{label}</h1>
      <div className={styles.empty} />
    </header>
  );
};
