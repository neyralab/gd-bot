import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  selectFileTypesCount,
  setFileTypesCount
} from '../../store/reducers/filesSlice';
import { getFileTypesCountEffect } from '../../effects/storageEffects';
import useButtonVibration from '../../hooks/useButtonVibration';

import icons from './assets';

import style from './style.module.scss';

export const FileFilterPanel = () => {
  const types = useSelector(selectFileTypesCount);
  const { t } = useTranslation('drive');
  const { t: tSystem } = useTranslation('system');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleVibrationClick = useButtonVibration();

  useEffect(() => {
    getFileTypesCountEffect()
      .then((data) => dispatch(setFileTypesCount(data)))
      .catch(() => toast.error(tSystem('message.failedLoad')));
  }, []);

  const getFiles = async (type) => {
    navigate(`?type=${type}`);
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
      name: t('dashbord.deleted'),
      value: types?.deleted,
      icon: icons.delete,
      callback: () => getFiles('delete')
    }
  ];
  return (
    <ul className={style.wrapper}>
      {options.map(({ name, value, icon: Icon, callback }) => (
        <li
          key={crypto.randomUUID()}
          className={style.item}
          onClick={handleVibrationClick(callback)}>
          <div>
            <p className={style.count}>{value}</p>
            <span className={style.name}>{name}</span>
          </div>
          <Icon />
        </li>
      ))}
    </ul>
  );
};
