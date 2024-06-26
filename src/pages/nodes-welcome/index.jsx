import React from 'react';
import { Header } from '../../components/header';
import styles from './styles.module.css';
import { NavLink } from 'react-router-dom';
import useTypingEffect from '../../utils/useTypingEffect';

export default function NodesWelcomePage() {
  const typingDescription = useTypingEffect(
    `Earn more by uploading 100 GB of files and see your points increase
    by 5 times! The more files you store, the more points you will earn.
    Upgrade your storage today to maximize your points.`,
    10,
    0
  );

  return (
    <div className={styles.container}>
      <Header label={'Node'} />

      <div className={styles.content}>
        <div className={styles['img-container']}>
          <img src="/assets/node-welcome.png" alt="Nodes" />
        </div>

        <div className={styles.description}>
          <h1>GD Node</h1>
          <p>
            {typingDescription}
          </p>
        </div>
      </div>

      <NavLink className={styles.button} to={'/nodes'}>
        Dashboard
      </NavLink>
    </div>
  );
}
