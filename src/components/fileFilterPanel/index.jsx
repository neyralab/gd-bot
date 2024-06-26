import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  selectFilesPage,
  setCount,
  setFiles
} from '../../store/reducers/filesSlice';
import {
  getDeletedFilesEffect,
  getFavoritesEffect,
  getFilesByTypeEffect,
  getFilesEffect,
  getGeoPinFilesEffect,
  getSharedFilesEffect
} from '../../effects/filesEffects';
import { getFileTypesCountEffect } from '../../effects/storageEffects';

import icons from './assets';

import style from './style.module.scss';

export const FileFilterPanel = ({}) => {
  const [types, setTypes] = useState({});
  const filesPage = useSelector(selectFilesPage);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getFileTypesCountEffect()
      .then((data) => setTypes(data))
      .catch(() => toast.error('Failed to load counts'));
  }, []);

  const getFiles = async (type) => {
    navigate(`?type=${type}`);

    try {
      let files;
      switch (type) {
        case 'all':
          files = await getFilesEffect(filesPage);
          break;
        case 'fav':
          files = await getFavoritesEffect();
          break;
        case 'share':
          files = await getSharedFilesEffect(filesPage);
          break;
        case 'delete':
          files = await getDeletedFilesEffect(filesPage);
          break;
        case 'geo':
          files = await getGeoPinFilesEffect(filesPage);
          break;
        default:
          files = await getFilesByTypeEffect(type);
          break;
      }
      dispatch(setFiles(files?.data));
      dispatch(setCount(files?.count));
    } catch (error) {
      toast.error('Sorry, something went wrong. Please try again later');
    }
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
      name: 'Geo Pin',
      value: types?.geo,
      icon: icons.geo_pin,
      callback: () => getFiles('geo')
    },
    {
      name: 'Documents',
      value: types?.docs,
      icon: icons.doc,
      callback: () => getFiles('docs')
    },
    {
      name: 'Pictures',
      value: types?.images,
      icon: icons.pictures,
      callback: () => getFiles('image')
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
    // { name: 'Pined', value: 0, icon: icons.pin },
    {
      name: 'Shared',
      value: types?.shared,
      icon: icons.shared,
      callback: () => getFiles('share')
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
      {options.map((option) => (
        <li
          key={crypto.randomUUID()}
          className={style.item}
          onClick={option.callback}>
          <div>
            <p className={style.count}>{option.value}</p>
            <span className={style.name}>{option.name}</span>
          </div>
          <option.icon />
        </li>
      ))}
    </ul>
  );
};
