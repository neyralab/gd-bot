import CN from 'classnames';

import { BackButton } from '../backButton';

import styles from './styles.module.css';

export const Header = ({ label, className, headerClassName }) => {
  return (
    <header className={CN(styles.header, headerClassName)}>
      <BackButton className={className} />
      <h1 className={styles.head}>{label}</h1>
      <div className={styles.empty} />
    </header>
  );
};
