import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import cn from 'classnames';

import {
  selectFileView,
  setSelectedFile
} from '../../store/reducers/filesSlice';
import { handleFilePreviewModal } from '../../store/reducers/modalSlice';
import { getFilePreviewEffect } from '../../effects/filesEffects';
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
  const isFolder = file?.type === 2;
  const location = useLocation();
  const isGridView = useMemo(() => (view === 'grid'), [view])
  const isDeletedPage = useMemo(
    () =>
      location.pathname === '/file-upload' &&
      new URLSearchParams(location.search).get('type') === 'delete',
    [location]
  );

  useEffect(() => {
    const hasPreview = (isSearch && imageFileExtensions.includes(`.${file.extension}`) && !imagesWithoutPreview.includes(`.${file.extension}`)) ||
      ((imageMediaTypesPreview.includes(file.mime) && imageFileExtensions.includes(`.${file.extension}`)) ||
        videoFileExtensions.includes(`.${file.extension}`));

    if (hasPreview && !isDeletedPage) {
      getFilePreviewEffect(file.slug, null, file.extension).then((res) => {
        setPreview(res);
      });
    }
  }, [file, isSearch, isDeletedPage]);

  const onMenuClick = (e) => {
    e?.stopPropagation();
    callback(file);
  };

  const onClickHandler = () => {
    dispatch(setSelectedFile(file));
    dispatch(handleFilePreviewModal(true));
  };

  return (
    <li
      className={isGridView ? style.fileSquare : style.fileList}
      id={file.id}
      onClick={onClickHandler}
    >
      <button
        className={cn(
          style.shareMenuButton,
          isGridView ? style.favBtnGrid : style.favBtnList
        )}>
        <StarFullIcon />
      </button>
      <button
        className={cn(style.shareMenuButton, isFileChecked && style.selectedFile)}
        onClick={onMenuClick}>
        <DotsIcon />
      </button>
      <div className={isGridView ? style.previewWrapper : style.fileListPreview}>
        {preview ? (
          <img
            src={preview}
            alt={file.name}
            className={style.previewImage}
            width={isGridView ? undefined : 30}
            height={isGridView ? undefined : 40}
          />
        ) : isFolder ? (
          <CustomFolderIcon viewType={view} color={file?.color[0]?.hex} />
        ) : isGridView ? (
          <CustomFileIcon
            extension={file.extension}
            color={file.color}
            dateCreated={file.created_at}
          />
        ) : (
          <CustomFileSmallIcon type={file.extension} />
        )}
      </div>
      <div className={isGridView ? style.squareInfo : style.info}>
        <p className={isGridView ? style.squareInfo__name : style.info__name}>
          {isSearch ? file.title : file.name}
        </p>
        <div className={isGridView ? style.squareInfo__statistic : style.info__statistic}>
          <p className={style[isGridView ? 'squareInfo__statistic_item' : 'info__statistic_item']}>
            <StarIcon width='12' height='12' viewBox='0 0 21 20' />
            <span>{file?.share_file?.price_view || 0}</span>
          </p>
          <p className={style[isGridView ? 'squareInfo__statistic_item' : 'info__statistic_item']}>
            <EyeIcon />
            <span>{file?.entry_statistic?.viewed || 0}</span>
          </p>
        </div>
      </div>
    </li>
  );
};
