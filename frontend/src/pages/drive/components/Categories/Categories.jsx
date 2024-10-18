import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { assignFilesQueryData } from '../../../../store/reducers/drive/drive.thunks';
import { ReactComponent as ImpulseLoader } from '../../../../assets/loader-impulse.svg';
import { vibrate } from '../../../../utils/vibration';
import { isDevEnv } from '../../../../utils/isDevEnv';
import icons from './assets';
import { runInitAnimation } from './animations';
import styles from './Categories.module.scss';

const HIDE_OPTION = ['ppv'];

export default function Categories() {
  const dispatch = useDispatch();
  const isDev = isDevEnv();
  const types = useSelector((state) => state.drive.fileTypesCount);
  const typesAreFetching = useSelector(
    (state) => state.drive.fileTypesCountIsFetching
  );
  const { t } = useTranslation('drive');
  const navigate = useNavigate();

  useEffect(() => {
    runInitAnimation();
  }, []);

  const getFiles = async (type) => {
    vibrate();
    dispatch(assignFilesQueryData({ filesQueryData: { category: type } }));
  };

  const options = useMemo(() => (
    [
      {
        name: t('dashbord.all'),
        value: types?.total,
        indexName: 'all',
        icon: icons.all,
        callback: () => getFiles('all')
      },
      {
        name: t('dashbord.favorites'),
        value: types?.starred,
        indexName: 'starred',
        icon: icons.fav,
        callback: () => getFiles('fav')
      },
      {
        name: 'Star Space',
        value: types?.ppv,
        indexName: 'ppv',
        icon: icons.star,
        callback: () => getFiles('payShare')
      },
      {
        name: t('dashbord.pictures'),
        value: types?.images,
        indexName: 'images',
        icon: icons.pictures,
        callback: () => getFiles('image')
      },
      {
        name: t('dashbord.documents'),
        value: types?.docs,
        indexName: 'docs',
        icon: icons.doc,
        callback: () => getFiles('docs')
      },
      {
        name: t('dashbord.notes'),
        value: types?.notes,
        indexName: 'notes',
        icon: icons.notes,
        callback: () => getFiles('notes')
      },
      {
        name: t('dashbord.audio'),
        value: types?.audios,
        indexName: 'audios',
        icon: icons.audio,
        callback: () => getFiles('audio')
      },
      {
        name: t('dashbord.video'),
        value: types?.videos,
        indexName: 'videos',
        icon: icons.video,
        callback: () => getFiles('video')
      },
      {
        name: t('dashbord.games'),
        value: types?.games,
        indexName: 'games',
        icon: icons.game,
        callback: () => {
          vibrate();
          navigate('/games');
        }
      }
    ].filter((item) => isDev ? true : !HIDE_OPTION.includes(item.indexName))
  ), [isDev, types]);

  return (
    <ul
      data-animation="drive-categories-animation-1"
      data-animation-display="grid"
      className={styles.wrapper}>
      {options.map(({ name, value, icon: Icon, callback }) => (
        <li
          key={name}
          data-animation="drive-categories-animation-2"
          className={styles.item}
          onClick={callback}>
          <div>
            <div className={styles.count}>
              {typesAreFetching && (
                <div className={styles['loader-container']}>
                  <ImpulseLoader />
                </div>
              )}
              {!typesAreFetching && value}
            </div>
            <span className={styles.name}>{name}</span>
          </div>
          <Icon />
        </li>
      ))}
    </ul>
  );
}
