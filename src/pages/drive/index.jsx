import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearDriveState, initDrive } from '../../store/reducers/driveSlice';
import Header from './components/Header/Header';
import Storage from './components/Storage/Storage';
import Content from './components/Content/Content';
import Actions from './components/Actions/Actions';
import { FileMenu } from './components/FileMenu/FileMenu';
import MediaSlider from './components/MediaSlider/MediaSlider';
import { runInitAnimation } from './animations';
import styles from './style.module.scss';

export default function DrivePage() {
  const dispatch = useDispatch();
  const fileMenuFile = useSelector((state) => state.drive.fileMenuFile);

  useEffect(() => {
    dispatch(initDrive());
    runInitAnimation();

    return () => {
      dispatch(clearDriveState());
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles['top-statics']}>
          <Header />
          <Storage />
        </div>
        <Content />
      </div>
      <Actions />

      {fileMenuFile && <FileMenu />}

      <MediaSlider />
    </div>
  );
}
