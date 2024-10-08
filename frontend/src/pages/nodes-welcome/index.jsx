import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/header';
import styles from './styles.module.css';
import { NavLink } from 'react-router-dom';
import useTypingEffect from '../../utils/useTypingEffect';

export default function NodesWelcomePage() {
  const { t } = useTranslation('system');

  const typingDescription = useTypingEffect(
    t('node.nodeDesc'),
    10,
    0
  );

  return (
    <div className={styles.container}>
      <Header hideBack label={t('node.node')} />

      <div className={styles.content}>
        <div className={styles['img-container']}>
          <img src="/assets/node-welcome.png" alt="Nodes" />
        </div>

        <div className={styles.description}>
          <h1>{t('node.gdNodeShort')}</h1>
          <p>{typingDescription}</p>
        </div>
      </div>

      <NavLink
        className={styles.button}
        to={'/nodes'}>
        {t('node.dashboard')}
      </NavLink>
    </div>
  );
}
