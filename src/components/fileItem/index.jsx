import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import moment from 'moment';
import cn from 'classnames';

import { selectFileView } from '../../store/reducers/filesSlice';
import { getFilePreviewEffect } from '../../effects/filesEffects';
import videoFileExtensions from '../../config/video-file-extensions';
import imageFileExtensions, {
  imageMediaTypesPreview
} from '../../config/image-file-extensions';

import CustomFileSmallIcon from '../../components/customFileIcon/CustomFileSmallIcon';
import CustomFileIcon from '../../components/customFileIcon';
import { ReactComponent as DotsIcon } from '../../assets/dots.svg';
import { ReactComponent as FavoriteIcon } from '../../assets/favorite.svg';

import style from './style.module.css';

export const FileItem = ({
  file,
  callback,
  checkedFile,
  fileView,
  isSearch = false
}) => {
  const currentView = useSelector(selectFileView);
  const view = fileView || currentView;
  const [preview, setPreview] = useState(null);
  const isFileChecked = file.id === checkedFile.id;
  const formattedDate = (dateCreated) =>
    moment.unix(dateCreated).format('MMM DD, YYYY, h:mma');

  useEffect(() => {
    if (
      (imageMediaTypesPreview.includes(file.mime) &&
        imageFileExtensions.includes(`.${file.extension}`)) ||
      videoFileExtensions.includes(`.${file.extension}`)
    ) {
      getFilePreviewEffect(file.slug, null, file.extension).then((res) => {
        setPreview(res);
      });
    }
  }, []);

  const FavButton = (
    <button
      className={cn(
        style.fileMenuButton,
        view === 'grid' ? style.favBtnGrid : style.favBtnList
      )}
      onClick={() => {}}>
      <FavoriteIcon />
    </button>
  );

  const MenuButton = (
    <button
      className={cn(style.fileMenuButton, isFileChecked && style.selectedFile)}
      onClick={() => callback(file)}>
      <DotsIcon />
    </button>
  );

  return (
    <>
      {view === 'grid' ? (
        <li className={style.fileSquare} id={file.id}>
          {FavButton}
          {MenuButton}
          <div className={style.previewWrapper}>
            {preview ? (
              <img
                src={preview}
                alt={file.name}
                className={style.previewImage}
              />
            ) : (
              <CustomFileIcon
                extension={file.extension}
                color={file.color}
                dateCreated={file.created_at}
              />
            )}
          </div>
          <div className={style.squareInfo}>
            <p className={style.squareInfo__name}>{file.name}</p>
            <p className={style.squareInfo__date}>
              {formattedDate(file.created_at)}
            </p>
          </div>
        </li>
      ) : (
        <li className={style.fileList}>
          {FavButton}
          {MenuButton}
          <div className={style.fileListPreview}>
            {preview ? (
              <img src={preview} alt="file" width={30} height={40} />
            ) : (
              <CustomFileSmallIcon type={file.extension} />
            )}
          </div>
          <div className={style.info}>
            <h3 className={style.info__name}>
              {isSearch ? file.title : file.name}
            </h3>
            <p className={style.info__date}>
              {isSearch ? file.updated : formattedDate(file.created_at)}
            </p>
          </div>
        </li>
      )}
    </>
  );
};
