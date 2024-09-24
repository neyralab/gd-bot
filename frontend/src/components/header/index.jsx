import CN from 'classnames';

import { BackButton } from '../backButton';

import styles from './styles.module.css';

export const Header = ({ label, className, headerClassName, hideBack }) => {
  return (
    <header className={CN(styles.header, headerClassName)}>
      { !hideBack &&  <BackButton className={className} /> }
      <h1 className={styles.head}>{label}</h1>
      <div className={styles.empty} />
    </header>
  );
};
