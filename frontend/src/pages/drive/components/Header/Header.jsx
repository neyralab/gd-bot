import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../Search/Search';
import { vibrate } from '../../../../utils/vibration';
import { assignFilesQueryData } from '../../../../store/reducers/drive/drive.thunks';
import { isMobilePlatform } from '../../../../utils/client';
import styles from './Header.module.scss';

export default function Header() {
  const dispatch = useDispatch();
  const queryData = useSelector((state) => state.drive.filesQueryData);
  const { t } = useTranslation('system');
  const navigate = useNavigate();

  const onBackClick = () => {
    vibrate();

    if (!!queryData.search || queryData.category !== null) {
      // files list view
      dispatch(
        assignFilesQueryData({
          filesQueryData: { search: null, category: null }
        })
      );
    } else {
      // categories view
      navigate(-1);
    }
  };

  return (
    <div className={styles.header}>
      { isMobilePlatform ? <span></span> : (
        <button type="button" onClick={onBackClick} className={styles.btn}>
          {t('dashboard.back')}
        </button>
      ) }
      <Search />
    </div>
  );
}
