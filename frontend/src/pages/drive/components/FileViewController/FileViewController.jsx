import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  setFileMenuModal,
  setMediaSliderCurrentFile,
  setMediaSliderOpen
} from '../../../../store/reducers/drive/drive.slice';
import { toggleFileFavorite } from '../../../../store/reducers/drive/drive.thunks';
import PPVFileGridView from './file/PPVFileGridView';
import SimpleFileGridView from './file/SimpleFileGridView';
import PPVFileListView from './file/PPVFileListView';
import SimpleFileListView from './file/SimpleFileListView';
import { vibrate } from '../../../../utils/vibration';
import imageFileExtensions, {
  imageMediaTypesPreview,
  imagesWithoutPreview
} from '../../../../config/image-file-extensions';
import videoFileExtensions from '../../../../config/video-file-extensions';
import {
  getFilecoinPreviewEffect,
  getFilePreviewEffect
} from '../../../../effects/filesEffects';
import styles from './FileViewController.module.scss';

export default function FileViewController({
  file,
  index,
  viewType,
  showPreview = true
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.data);
  const [preview, setPreview] = useState(null);
  const isFolder = file?.type === 2;
  const isSearchFile = file?.isSearch;

  const formattedDate = useMemo(() => {
    return moment.unix(file.created_at).format('MMM DD, YYYY, h:mma');
  }, [file]);

  const isFavorite = useMemo(() => {
    return (
      user &&
      file?.user_favorites &&
      user?.id === file?.user_favorites[0]?.user?.id
    );
  }, [file?.user_favorites, user?.id]);

  useEffect(() => {
    const searchHasPreview =
      isSearchFile &&
      imageFileExtensions.includes(`.${file.extension}`) &&
      !imagesWithoutPreview.includes(`.${file.extension}`);
    const fileHasPreview =
      (imageMediaTypesPreview.includes(file.mime) &&
        imageFileExtensions.includes(`.${file.extension}`)) ||
      videoFileExtensions.includes(`.${file.extension}`);

    const fileHasValidPreview = file.preview_small || file.preview_large;

    if (
      (searchHasPreview || fileHasPreview) &&
      showPreview &&
      fileHasValidPreview
    ) {
      if (!file?.is_on_storage_provider) {
        getFilePreviewEffect(file.slug, null, file.extension).then((res) => {
          setPreview(res);
        });
      } else {
        getFilecoinPreviewEffect(file)
          .then(setPreview)
          .catch(() => setPreview(null));
      }
    }
  }, []);

  const onFavoriteClick = () => {
    vibrate();
    dispatch(toggleFileFavorite({ slug: file.slug }));
  };

  const onMenuClick = () => {
    vibrate();
    dispatch(setFileMenuModal(file));
  };

  const onFileOpenClick = () => {
    vibrate();
    dispatch(setMediaSliderCurrentFile(file));
    dispatch(setMediaSliderOpen(true));
  };

  return (
    <div
      data-animation="drive-file-animation-1"
      data-index={index}
      className={styles['file-controller']}>
      {!file.share_file && viewType === 'grid' && (
        <SimpleFileGridView
          file={file}
          viewType={viewType}
          isFolder={isFolder}
          preview={preview}
          isFavorite={isFavorite}
          isSearchFile={isSearchFile}
          formattedDate={formattedDate}
          onFavoriteClick={onFavoriteClick}
          onMenuClick={onMenuClick}
          onFileOpenClick={onFileOpenClick}
        />
      )}
      {!file.share_file && viewType === 'list' && (
        <SimpleFileListView
          file={file}
          viewType={viewType}
          isFolder={isFolder}
          preview={preview}
          isFavorite={isFavorite}
          isSearchFile={isSearchFile}
          formattedDate={formattedDate}
          onFavoriteClick={onFavoriteClick}
          onMenuClick={onMenuClick}
          onFileOpenClick={onFileOpenClick}
        />
      )}

      {!!file.share_file && viewType === 'grid' && (
        <PPVFileGridView
          file={file}
          viewType={viewType}
          isFolder={isFolder}
          isSearchFile={isSearchFile}
          preview={preview}
          onMenuClick={onMenuClick}
          onFileOpenClick={onFileOpenClick}
        />
      )}
      {!!file.share_file && viewType === 'list' && (
        <PPVFileListView
          file={file}
          viewType={viewType}
          isFolder={isFolder}
          isSearchFile={isSearchFile}
          preview={preview}
          onMenuClick={onMenuClick}
          onFileOpenClick={onFileOpenClick}
        />
      )}
    </div>
  );
}
