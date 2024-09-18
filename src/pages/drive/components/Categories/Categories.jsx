import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { assignFilesQueryData } from '../../../../store/reducers/driveSlice';
import { ReactComponent as ImpulseLoader } from '../../../../assets/loader-impulse.svg';
import { vibrate } from '../../../../utils/vibration';
import icons from './assets';
import { runInitAnimation } from './animations';
import styles from './Categories.module.scss';

export default function Categories() {
  const dispatch = useDispatch();
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

  const options = [
    {
      name: t('dashbord.all'),
      value: types?.total,
      icon: icons.all,
      callback: () => getFiles('all')
    },
    {
      name: t('dashbord.favorites'),
      value: types?.starred,
      icon: icons.fav,
      callback: () => getFiles('fav')
    },
    // {
    //   name: 'Star Space',
    //   value: types?.ppv,
    //   icon: icons.star,
    //   callback: () => getFiles('payShare')
    // },
    {
      name: t('dashbord.pictures'),
      value: types?.images,
      icon: icons.pictures,
      callback: () => getFiles('image')
    },
    {
      name: t('dashbord.documents'),
      value: types?.docs,
      icon: icons.doc,
      callback: () => getFiles('docs')
    },
    {
      name: t('dashbord.notes'),
      value: types?.notes,
      icon: icons.notes,
      callback: () => getFiles('notes')
    },
    {
      name: t('dashbord.audio'),
      value: types?.audios,
      icon: icons.audio,
      callback: () => getFiles('audio')
    },
    {
      name: t('dashbord.video'),
      value: types?.videos,
      icon: icons.video,
      callback: () => getFiles('video')
    },
    {
      name: t('dashbord.games'),
      value: types?.games,
      icon: icons.game,
      callback: () => {
        vibrate();
        navigate('/games');
      }
    }
  ];

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
