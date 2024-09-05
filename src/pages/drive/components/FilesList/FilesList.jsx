import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReactComponent as GridIcon } from '../../../../assets/grid_view.svg';
import { ReactComponent as ListIcon } from '../../../../assets/list_view.svg';
import { ReactComponent as FileIcon } from '../../../../assets/file_draft.svg';
import { vibrate } from '../../../../utils/vibration';
import { setViewType } from '../../../../store/reducers/driveSlice';
import GhostLoader from '../../../../components/ghostLoader';
import styles from './FilesList.module.scss';

export default function FilesList() {
  const { t } = useTranslation('drive');
  const dispatch = useDispatch();
  const viewType = useSelector((state) => state.drive.viewType);
  const queryData = useSelector((state) => state.drive.filesQueryData);
  const [mode, setMode] = useState(null); // null | 'search' | 'category'

  const viewTypeChange = () => {
    vibrate();
    dispatch(setViewType(viewType === 'grid' ? 'list' : 'grid'));
  };

  return (
    <div data-animation="drive-files-list-animation-1">
      <div className={styles.header}>
        <p>GHOSTDRIVE</p>
        <button onClick={viewTypeChange}>
          {viewType === 'grid' ? <ListIcon /> : <GridIcon />}
        </button>
      </div>

      <div className={styles.content}>
        {/* Initial loading */}
        <div className={styles['loader-container']}>
          <GhostLoader />
        </div>

        {/* No files found */}
        <div className={styles['no-files-found']}>
          <FileIcon />
          <b>{t('dashbord.notFound')}</b>
          <p>{t('dashbord.isEmpty')}</p>
        </div>
      </div>

      {/* <FileList loading={loading} files={fileList} checkedFile={checkedFile} /> */}
    </div>
  );
}
