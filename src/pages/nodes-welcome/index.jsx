import React from 'react';
import { Header } from '../../components/header';
import styles from './styles.module.css';
import { NavLink } from 'react-router-dom';
import useTypingEffect from '../../utils/useTypingEffect';

export default function NodesWelcomePage() {
  const typingDescription = useTypingEffect(
    `Are you ready to be at the forefront of the decentralized storage revolution? Invest in a Ghost Drive Node and reap the benefits of our cutting-edge technology and robust network.`,
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
          <p>{typingDescription}</p>
        </div>
      </div>

      <NavLink className={styles.button} to={'/nodes'}>
        Dashboard
      </NavLink>
    </div>
  );
}
