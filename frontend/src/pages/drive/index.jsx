import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearDriveState, initDrive } from '../../store/reducers/drive/drive.thunks';
import {
  MediaSliderCacheProvider,
  useMediaSliderCache
} from './components/MediaSlider/MediaSliderCache';
import Header from './components/Header/Header';
import Storage from './components/Storage/Storage';
import Content from './components/Content/Content';
import TemporaryControls from '../../components/AssistantDashboard/TemporaryControls/TemporaryControls';
import Actions from './components/Actions/Actions';
import { FileMenuModal } from './components/FileMenuModal/FileMenuModal';
import FileInfoModal from './components/FileInfoModal/FileInfoModal';
import MediaSlider from './components/MediaSlider/MediaSlider';
import { runInitAnimation } from './animations';
import styles from './style.module.scss';

const MediaSliderWrapper = () => {
  const { clearCache } = useMediaSliderCache();

  useEffect(() => {
    return () => {
      clearCache();
    };
  }, []);

  return <MediaSlider />;
};

export default function DrivePage() {
  const dispatch = useDispatch();

  const fileMenuModal = useSelector((state) => state.drive.fileMenuModal);
  const fileInfoModal = useSelector((state) => state.drive.fileInfoModal);

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

      <TemporaryControls />
      
      {fileMenuModal && <FileMenuModal />}
      {fileInfoModal && <FileInfoModal />}

      <MediaSliderCacheProvider>
        <MediaSliderWrapper />
      </MediaSliderCacheProvider>
    </div>
  );
}
