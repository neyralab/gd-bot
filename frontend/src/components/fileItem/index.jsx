import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import moment from 'moment';
import cn from 'classnames';

import {
  selectFileView,
  setSelectedFile
} from '../../store/reducers/filesSlice';
import { handleFilePreviewModal } from '../../store/reducers/modalSlice';
import {
  getFilePreviewEffect,
  updateFileFavoriteEffect
} from '../../effects/filesEffects';
import videoFileExtensions from '../../config/video-file-extensions';
import imageFileExtensions, {
  imageMediaTypesPreview,
  imagesWithoutPreview
} from '../../config/image-file-extensions';

import CustomFolderIcon from '../../components/customFileIcon/CustomFolderIcon';
import CustomFileSmallIcon from '../../components/customFileIcon/CustomFileSmallIcon';
import CustomFileIcon from '../../components/customFileIcon';
import { ReactComponent as DotsIcon } from '../../assets/dots.svg';
import { ReactComponent as FavoriteIcon } from '../../assets/favorite.svg';
import { ReactComponent as FavoriteActiveIcon } from '../../assets/favorite_active.svg';

import style from './style.module.css';

export const FileItem = ({
  file,
  callback,
  checkedFile,
  fileView,
  isSearch = false
}) => {
  const currentView = useSelector(selectFileView);
  const user = useSelector((state) => state?.user?.data);
  const dispatch = useDispatch();
  const view = fileView || currentView;
  const [preview, setPreview] = useState(null);
  const isFileChecked = file.id === checkedFile.id;
  const isSearchFile = file?.isSearch || isSearch;
  const isFolder = file?.type === 2;
  const location = useLocation();
  const isDeletedPage =
    location.pathname === '/file-upload' &&
    new URLSearchParams(location.search).get('type') === 'delete';
  const formattedDate = (dateCreated) =>
    moment.unix(dateCreated).format('MMM DD, YYYY, h:mma');
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

    if ((searchHasPreview || fileHasPreview) && !isDeletedPage) {
      getFilePreviewEffect(file.slug, null, file.extension).then((res) => {
        setPreview(res);
      });
    }
  }, []);

  const toggleFavorite = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');
    updateFileFavoriteEffect(file.slug, dispatch);
  };

  const onMenuClick = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    window?.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft');
    callback(file);
  };

  const onClickHandler = () => {
    dispatch(setSelectedFile(file));
    dispatch(handleFilePreviewModal(true));
  };

  const FavButton = (
    <button
      className={cn(
        style.fileMenuButton,
        view === 'grid' ? style.favBtnGrid : style.favBtnList
      )}
      onClick={toggleFavorite}>
      {isFavorite ? <FavoriteActiveIcon /> : <FavoriteIcon />}
    </button>
  );

  const MenuButton = (
    <button
      className={cn(style.fileMenuButton, isFileChecked && style.selectedFile)}
      onClick={onMenuClick}>
      <DotsIcon />
    </button>
  );

  return (
    <>
      {view === 'grid' ? (
        <li className={style.fileSquare} id={file.id} onClick={onClickHandler}>
          {FavButton}
          {MenuButton}
          <div className={style.previewWrapper}>
            {preview ? (
              <img
                src={preview}
                alt={file.name}
                className={style.previewImage}
              />
            ) : isFolder ? (
              <CustomFolderIcon viewType={view} color={file?.color[0]?.hex} />
            ) : (
              <CustomFileIcon
                extension={file.extension}
                color={file.color}
                dateCreated={file.created_at}
              />
            )}
          </div>
          <div className={style.squareInfo}>
            <p className={style.squareInfo__name}>
              {isSearchFile ? file.title : file.name}
            </p>
            <p className={style.squareInfo__date}>
              {isSearchFile ? file.updated : formattedDate(file.created_at)}
            </p>
          </div>
        </li>
      ) : (
        <li className={style.fileList} onClick={onClickHandler}>
          {FavButton}
          {MenuButton}
          <div className={style.fileListPreview}>
            {preview ? (
              <img
                src={preview}
                alt="file"
                width={30}
                height={40}
                className={style.previewImage}
              />
            ) : isFolder ? (
              <CustomFolderIcon viewType={view} color={file?.color[0]?.hex} />
            ) : (
              <CustomFileSmallIcon type={file.extension} />
            )}
          </div>
          <div className={style.info}>
            <h3 className={style.info__name}>
              {isSearchFile ? file.title : file.name}
            </h3>
            <p className={style.info__date}>
              {isSearchFile ? file.updated : formattedDate(file.created_at)}
            </p>
          </div>
        </li>
      )}
    </>
  );
};
