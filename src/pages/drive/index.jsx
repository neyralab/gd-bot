import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initDrive } from '../../store/reducers/driveSlice';
import Header from './components/Header/Header';
import Storage from './components/Storage/Storage';
import Content from './components/Content/Content';
import Actions from './components/Actions/Actions';
import { runInitAnimation } from './animations';
import styles from './style.module.scss';

export default function DrivePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initDrive());
    runInitAnimation();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Header />
        <Storage />
        <Content />
      </div>
      <Actions />
    </div>
  );
}
