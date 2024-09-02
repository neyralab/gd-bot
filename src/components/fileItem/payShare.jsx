import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import cn from 'classnames';

import {
  selectFileView,
  setSelectedFile
} from '../../store/reducers/filesSlice';
import { handleFilePreviewModal } from '../../store/reducers/modalSlice';
import { getFilePreviewEffect} from '../../effects/filesEffects';
import videoFileExtensions from '../../config/video-file-extensions';
import imageFileExtensions, {
  imageMediaTypesPreview,
  imagesWithoutPreview
} from '../../config/image-file-extensions';

import CustomFolderIcon from '../../components/customFileIcon/CustomFolderIcon';
import CustomFileSmallIcon from '../../components/customFileIcon/CustomFileSmallIcon';
import CustomFileIcon from '../../components/customFileIcon';
import { ReactComponent as DotsIcon } from '../../assets/dots.svg';
import { ReactComponent as StarFullIcon } from '../../assets/starFull.svg';
import { ReactComponent as StarIcon } from '../../assets/star.svg';
import { ReactComponent as EyeIcon } from '../../assets/eye.svg';

import style from './style.module.css';

export const PayShareFile = ({
  file,
  callback,
  checkedFile,
  fileView,
  isSearch = false
}) => {
  const currentView = useSelector(selectFileView);
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
        style.shareMenuButton,
        view === 'grid' ? style.favBtnGrid : style.favBtnList
      )}>
      <StarFullIcon />
    </button>
  );

  const MenuButton = (
    <button
      className={cn(style.shareMenuButton, isFileChecked && style.selectedFile)}
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
            <div className={style.squareInfo__statistic}>
              <p className={style.squareInfo__statistic_item}>
                <StarIcon width='12' height='12' viewBox='0 0 21 20' />
                <span>{file.share_file.price_view}</span>
              </p>
              <p className={style.squareInfo__statistic_item}>
                <EyeIcon />
                <span>{file.entry_statistic.viewed}</span>
              </p>
            </div>
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
            <div className={style.info__statistic}>
              <p className={style.info__statistic_item}>
                <StarIcon width='12' height='12' viewBox='0 0 21 20' />
                <span>{file.share_file.price_view}</span>
              </p>
              <p className={style.info__statistic_item}>
                <EyeIcon />
                <span>{file.entry_statistic.viewed}</span>
              </p>
            </div>
          </div>
        </li>
      )}
    </>
  );
};
