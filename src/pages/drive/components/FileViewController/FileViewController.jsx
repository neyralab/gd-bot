import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  setFileMenuFile,
  toggleFileFavorite
} from '../../../../store/reducers/driveSlice';
import PPVFileGridView from './file/PPVFileGridView';
import SimpleFileGridView from './file/SimpleFileGridView';
import PPVFileListView from './file/PPVFileListView';
import SimpleFileListView from './file/SimpleFileListView';
import { vibrate } from '../../../../utils/vibration';
import { setSelectedFile } from '../../../../store/reducers/filesSlice';
import { handleFilePreviewModal } from '../../../../store/reducers/modalSlice';
import imageFileExtensions, {
  imageMediaTypesPreview,
  imagesWithoutPreview
} from '../../../../config/image-file-extensions';
import videoFileExtensions from '../../../../config/video-file-extensions';
import { getFilePreviewEffect } from '../../../../effects/filesEffects';
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

    if ((searchHasPreview || fileHasPreview) && showPreview) {
      getFilePreviewEffect(file.slug, null, file.extension).then((res) => {
        setPreview(res);
      });
    }
  }, []);

  const onFavoriteClick = () => {
    vibrate();
    dispatch(toggleFileFavorite({ slug: file.slug }));
  };

  const onMenuClick = () => {
    vibrate();
    dispatch(setFileMenuFile(file));
  };

  const onFileOpenClick = () => {
    vibrate();
    dispatch(setSelectedFile(file));
    dispatch(handleFilePreviewModal(true));
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