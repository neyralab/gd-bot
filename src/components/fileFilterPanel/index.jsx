import React, { useEffect } from 'react';
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleVibrationClick = useButtonVibration();

  useEffect(() => {
    getFileTypesCountEffect()
      .then((data) => dispatch(setFileTypesCount(data)))
      .catch(() => toast.error('Failed to load counts'));
  }, []);

  const getFiles = async (type) => {
    navigate(`?type=${type}`);
  };

  const options = [
    {
      name: 'All',
      value: types?.total,
      icon: icons.all,
      callback: () => getFiles('all')
    },
    {
      name: 'Favorites',
      value: types?.starred,
      icon: icons.fav,
      callback: () => getFiles('fav')
    },
    {
      name: 'Pictures',
      value: types?.images,
      icon: icons.pictures,
      callback: () => getFiles('image')
    },
    {
      name: 'Documents',
      value: types?.docs,
      icon: icons.doc,
      callback: () => getFiles('docs')
    },
    {
      name: 'Notes',
      value: types?.notes,
      icon: icons.notes,
      callback: () => getFiles('notes')
    },
    {
      name: 'Audio',
      value: types?.audios,
      icon: icons.audio,
      callback: () => getFiles('audio')
    },
    {
      name: 'Video',
      value: types?.videos,
      icon: icons.video,
      callback: () => getFiles('video')
    },
    {
      name: 'Deleted',
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
